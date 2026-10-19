# GokuLabs

Marketing site for GokuLabs — a vanilla HTML/CSS/JS front end served by a lightweight Flask app.

## Structure

```
Goku_Labs/
├── app.py                 # Flask server + contact form endpoint
├── requirements.txt
├── templates/
│   └── index.html         # Page markup
├── static/
│   ├── css/style.css      # Design system (dark glassmorphism)
│   └── js/main.js         # Micro-interactions (vanilla JS)
└── data/
    └── messages.jsonl     # Contact enquiries (created at runtime, git-ignored)
```

## Run

The quickest way — install once, then run:

```bash
python -m pip install -r requirements.txt
python app.py
```

Then open <http://127.0.0.1:5000>. Set `PORT` to use a different port.

### Using a virtual environment (recommended for development)

```bash
python -m venv .venv
.venv\Scripts\python.exe app.py      # Windows
# source .venv/bin/activate && python app.py    # macOS / Linux
```

> **`ModuleNotFoundError: No module named 'flask'`?**
> This means the `python` on your PATH is a different interpreter than the one you
> installed Flask into. Either install the requirements with that same interpreter
> (`python -m pip install -r requirements.txt`), or call the venv directly with
> `.venv\Scripts\python.exe app.py`. To check which interpreter you're using, run
> `python -c "import sys; print(sys.executable)"`.

## Endpoints

| Method | Path           | Description                                     |
| ------ | -------------- | ----------------------------------------------- |
| GET    | `/`            | Renders the site                                |
| POST   | `/api/contact` | Validates and stores a contact submission       |
| GET    | `/api/health`  | Health check                                    |

`POST /api/contact` accepts form-encoded or JSON bodies with `name`, `email`, and `message`.
It returns `{"ok": true, "message": "..."}` on success, or `400` with a per-field `errors`
object on validation failure. Valid submissions are appended to `data/messages.jsonl`.

## Features

- Dark first design with neon purple / electric blue accents, glassmorphism cards and glow states.
- Vanilla JS: scroll reveals, count-up stats, hero particle canvas, mouse-tracked hero glow,
  card tilt, scroll progress bar, scroll spy, mobile nav, and AJAX form submission.
- Accessible: semantic landmarks, skip link, visible focus states, `aria-expanded`/`aria-live`
  wiring, and a full `prefers-reduced-motion` fallback.
- Client-side validation mirrors the server rules; the server remains the source of truth.
