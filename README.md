# Strength Log

A small offline-capable PWA for logging strength workouts. No build step, no dependencies.

- `index.html` – shell
- `app.js` – all logic (catalog, storage/migration, views, actions)
- `app.css` – styles
- `sw.js` – network-first service worker (offline fallback). Bump `VERSION` if the asset list changes.

## Progress tracking
- **Main metric:** estimated 1RM (Epley) of each workout's best set. Bodyweight exercises use body weight + added weight
  when a body weight is set in Settings, otherwise best reps. Sets over 12 reps are drawn faded (rough estimate).
- **Exercise page:** chart with workout dots, trend line (best of last 3 workouts), ★ PRs; toggle Est. 1RM / Top weight / Volume;
  range 1M–All; tap/drag the chart for exact values (date, value, best set, PR); 8-week change; personal bests by reps (heaviest weight for ≥ 5, 8, 10, 12, 15, 18 reps, date first achieved).
- **Home:** this week (days trained, sets) + 12-week consistency strip, latest PR per exercise, sets per muscle group
  over the last 7 days vs a 10–20 sets/week guide band, and a sparkline + 6-week % change on each exercise row.

## Data
Stored in `localStorage` under `strength-log-v3` (schema version 5). Weights are always stored in kg.
Items carry `updatedAt`, and deletions are recorded in `deleted` so sync can merge copies without losing edits or resurrecting deleted items.

Safety copies kept in the same browser:
- `strength-log-premigrate-v*` – original data before a schema migration
- `strength-log-autobackup-<timestamp>` – data before each import/reset (last 3 kept)
- `strength-log-newer-v*` – data written by a newer app version (shown read-only, never overwritten)
- `strength-log-corrupt-*` – unreadable data (the app never deletes it)

Use **Export backup** regularly; **Import** offers Merge or Replace.

## Cloud sync (GitHub Gist)
Settings → Cloud sync. Paste a fine-grained GitHub token with only **Account permissions → Gists: Read and write**.
The app keeps a private gist (`Strength Log sync`, file `strength-log.json`) in sync: it pulls and merges on open,
when the app regains focus, when the network comes back, and ~1.5 s after each change.
After clearing browser data or on a new device, paste the token again and everything is restored.
The gist also contains `strength-log.csv` (one row per set: date, exercise, group, type, set, weight_kg, weight_lb, reps, est_1rm_kg, volume_kg, note).
GitHub shows it as a searchable table; **Raw** opens it in Excel/Google Sheets. It is regenerated on every sync — edit data in the app, not the CSV.
The token is stored only in this browser (`strength-log-sync`) and is never included in exports or the gist.

## Deploy
Push to GitHub Pages; the app is served from `/strength-log/`.
Local: `python3 -m http.server` then open http://localhost:8000.

## Exercise images
Photos from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (The Unlicense / public domain).
`images.js` maps each built-in exercise to an image key; `img/t/` has 120px list thumbnails, `img/f/` has 480px start/end photos.
Custom exercises show a representative photo for their muscle group (`GROUP_IMAGE` in `app.js`).
Images are cached by the service worker on first view (cache `strength-log-img`).
