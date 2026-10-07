# Strength Log

A small offline-capable PWA for logging strength workouts. No build step, no dependencies.

- `index.html` – shell
- `app.js` – all logic (catalog, storage/migration, views, actions)
- `app.css` – styles
- `sw.js` – network-first service worker (offline fallback). Bump `VERSION` if the asset list changes.

## Data
Stored in `localStorage` under `strength-log-v3` (schema version 4). Weights are always stored in kg.

Safety copies kept in the same browser:
- `strength-log-premigrate-v*` – original data before a schema migration
- `strength-log-autobackup` – data before the last import/reset
- `strength-log-corrupt-*` – unreadable data (the app never deletes it)

Use **Export backup** regularly; **Import** offers Merge or Replace.

## Deploy
Push to GitHub Pages; the app is served from `/strength-log/`.
Local: `python3 -m http.server` then open http://localhost:8000.
