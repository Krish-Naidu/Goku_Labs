"""Build a static copy of the GokuLabs site into `_site/` for GitHub Pages.

GitHub Pages only serves static files and cannot run Flask, so this renders the
Jinja template through Flask's test client and copies the static assets.

Usage:
    python build_static.py
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
OUT_DIR = BASE_DIR / "_site"

sys.path.insert(0, str(BASE_DIR))

try:
    from app import app
except ModuleNotFoundError as exc:  # pragma: no cover - dev convenience
    sys.exit(f"Missing dependency: {exc}\nRun: python -m pip install -r requirements.txt")


def build() -> Path:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)

    # Static deploys have no Python backend, so the form degrades to a mailto link.
    with app.test_request_context("/"):
        from flask import render_template

        html = render_template("index.html", static_build=True)

    (OUT_DIR / "index.html").write_text(html, encoding="utf-8")

    shutil.copytree(BASE_DIR / "static", OUT_DIR / "static")

    # Serve the custom domain from the published artifact.
    (OUT_DIR / "CNAME").write_text("gokulabs.com\n", encoding="utf-8")

    # Stop GitHub Pages running the output through Jekyll.
    (OUT_DIR / ".nojekyll").write_text("", encoding="utf-8")

    return OUT_DIR


if __name__ == "__main__":
    out = build()
    files = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file())
    print(f"Built {len(files)} files into {out.name}/")
    for name in files:
        print(f"  {name}")
