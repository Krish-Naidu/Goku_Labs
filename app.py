"""GokuLabs — a lightweight Flask app serving the marketing site and contact form.

Run locally:
    python app.py            # http://127.0.0.1:5000
    PORT=8080 python app.py  # custom port
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from flask import Flask, jsonify, render_template, request
except ModuleNotFoundError:
    sys.exit(
        "Flask isn't installed for the interpreter running this file:\n"
        f"  {sys.executable}\n\n"
        "Install the dependencies first:\n"
        "  python -m pip install -r requirements.txt\n\n"
        "Or run the app inside its virtual environment:\n"
        "  .venv\\Scripts\\python.exe app.py      (Windows)\n"
        "  source .venv/bin/activate && python app.py   (macOS / Linux)"
    )

BASE_DIR = Path(__file__).resolve().parent
MESSAGES_FILE = BASE_DIR / "data" / "messages.jsonl"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")

MAX_NAME_LEN = 80
MAX_EMAIL_LEN = 254
MAX_MESSAGE_LEN = 4000

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False


def _clean(value: Any) -> str:
    """Normalise an incoming form/JSON value into a trimmed string."""
    if value is None:
        return ""
    return str(value).replace("\x00", "").strip()


def validate_contact(payload: dict[str, Any]) -> tuple[dict[str, str], dict[str, str]]:
    """Return (cleaned_fields, field_errors) for a contact submission."""
    fields = {
        "name": _clean(payload.get("name")),
        "email": _clean(payload.get("email")),
        "message": _clean(payload.get("message")),
    }
    errors: dict[str, str] = {}

    if not fields["name"]:
        errors["name"] = "Please tell us your name."
    elif len(fields["name"]) > MAX_NAME_LEN:
        errors["name"] = f"Names are limited to {MAX_NAME_LEN} characters."

    if not fields["email"]:
        errors["email"] = "An email address is required so we can reply."
    elif len(fields["email"]) > MAX_EMAIL_LEN or not EMAIL_RE.match(fields["email"]):
        errors["email"] = "That email address doesn't look right."

    if not fields["message"]:
        errors["message"] = "Please add a short description of your project."
    elif len(fields["message"]) > MAX_MESSAGE_LEN:
        errors["message"] = f"Messages are limited to {MAX_MESSAGE_LEN} characters."

    return fields, errors


def save_message(fields: dict[str, str], meta: dict[str, str]) -> None:
    """Append an enquiry to data/messages.jsonl, creating the folder if needed."""
    record = {
        "received_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        **fields,
        **meta,
    }
    MESSAGES_FILE.parent.mkdir(parents=True, exist_ok=True)
    try:
        with MESSAGES_FILE.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError as exc:  # Never fail the request just because the disk is unhappy.
        app.logger.warning("Could not persist enquiry: %s", exc)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/contact")
def contact():
    payload: dict[str, Any] = {}
    if request.is_json:
        payload = request.get_json(silent=True) or {}
    else:
        payload = request.form.to_dict()

    fields, errors = validate_contact(payload)
    if errors:
        return jsonify({"ok": False, "errors": errors, "message": "Please check the highlighted fields."}), 400

    save_message(
        fields,
        {
            "user_agent": request.headers.get("User-Agent", "")[:300],
            "referer": request.headers.get("Referer", "")[:300],
        },
    )
    app.logger.info("New enquiry from %s", fields["email"])

    return jsonify(
        {
            "ok": True,
            "message": f"Thanks {fields['name'].split()[0]} — your message is with the GokuLabs team.",
        }
    )


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "status": "healthy"})


@app.errorhandler(404)
def not_found(_error):
    if request.path.startswith("/api/"):
        return jsonify({"ok": False, "message": "Unknown endpoint."}), 404
    return render_template("index.html"), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=True)
