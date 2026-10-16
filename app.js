"use strict";

/* ---------- Catalog ----------
 * Each entry: "Name|type" where type is
 * b=barbell, d=dumbbell, c=cable, m=machine, w=bodyweight, o=other
 * Built-in ids are derived from the name, so reordering is safe.
 */
const CATALOG = {
  Chest: ["Barbell Bench Press|b", "Incline Barbell Bench Press|b", "Decline Barbell Bench Press|b", "Dumbbell Bench Press|d", "Incline Dumbbell Press|d", "Decline Dumbbell Press|d", "Dumbbell Fly|d", "Incline Dumbbell Fly|d", "Cable Crossover High to Low|c", "Cable Crossover Low to High|c", "Machine Chest Press|m", "Pec Deck|m", "Push Up|w", "Chest Dip|w"],
  Back: ["Conventional Deadlift|b", "Sumo Deadlift|b", "Lat Pulldown|c", "Close Grip Lat Pulldown|c", "Pull Up|w", "Chin Up|w", "Assisted Pull Up|m", "Barbell Row|b", "T-Bar Row|b", "Single Arm Dumbbell Row|d", "Seated Cable Row|c", "Single Arm Cable Row|c", "Machine Row|m", "Straight Arm Pulldown|c", "Dumbbell Pullover|d", "Chest Supported Dumbbell Row|d", "Dumbbell Shrug|d", "Back Extension|w"],
  Quads: ["Barbell Back Squat|b", "Front Squat|b", "Hack Squat|m", "Leg Press|m", "Leg Extension|m", "Bulgarian Split Squat|d", "Walking Lunge|d", "Dumbbell Lunge|d", "Goblet Squat|d", "Smith Machine Squat|m"],
  Hamstrings: ["Romanian Deadlift|b", "Stiff Leg Deadlift|b", "Good Morning|b", "Glute Ham Raise|w", "Lying Leg Curl|m", "Seated Leg Curl|m"],
  Glutes: ["Barbell Hip Thrust|b", "Machine Hip Thrust|m", "Glute Bridge|b", "Cable Kickback|c", "Cable Pull Through|c", "Step Up|d", "45 Degree Hip Extension|w"],
  Shoulders: ["Overhead Press|b", "Push Press|b", "Seated Dumbbell Shoulder Press|d", "Standing Dumbbell Shoulder Press|d", "Behind the Neck Press|b", "Arnold Press|d", "Dumbbell Lateral Raise|d", "Cable Lateral Raise|c", "Front Raise|d", "Rear Delt Fly|d", "Reverse Pec Deck|m", "Face Pull|c", "Upright Row|b"],
  Biceps: ["Barbell Curl|b", "EZ Bar Curl|b", "Dumbbell Curl|d", "Incline Dumbbell Curl|d", "Hammer Curl|d", "Preacher Curl|b", "Cable Curl|c", "Concentration Curl|d", "Machine Curl|m"],
  Triceps: ["Close Grip Bench Press|b", "Triceps Pushdown|c", "Rope Pushdown|c", "Overhead Cable Extension|c", "Dumbbell Overhead Extension|d", "Skull Crusher|b", "Parallel Bar Dip|w", "Bench Dip|w", "Triceps Kickback|d"],
  Calves: ["Standing Calf Raise|m", "Seated Calf Raise|m", "Leg Press Calf Raise|m"],
  Core: ["Cable Crunch|c", "Machine Crunch|m", "Hanging Leg Raise|w", "Hanging Knee Raise|w", "Ab Wheel Rollout|w", "Plank|w", "Side Plank|w", "Russian Twist|o", "Sit Up|w", "Pallof Press|c"],
  Forearms: ["Wrist Curl|b", "Reverse Wrist Curl|b", "Farmer Carry|d"],
  "Full Body": ["Power Clean|b", "Clean and Press|b", "Kettlebell Swing|o", "Thruster|b", "Sled Push|o"],
};
const TYPE_CODES = { b: "barbell", d: "dumbbell", c: "cable", m: "machine", w: "bodyweight", o: "other" };
const TYPES = {
  barbell: { label: "Barbell · total weight including bar", hint: "Record total weight including the bar." },
  dumbbell: { label: "Dumbbell · one dumbbell", hint: "Record the weight of one dumbbell." },
  machine: { label: "Machine · selected stack weight", hint: "Record the selected machine weight." },
  cable: { label: "Cable · selected stack weight", hint: "Record the selected cable stack weight." },
  bodyweight: { label: "Bodyweight · added weight only", hint: "Record added weight only (0 for bodyweight)." },
  other: { label: "Other", hint: "Record the weight used." },
};
const ICONS = { Chest: "🏋️", Back: "🦾", Quads: "🦵", Hamstrings: "🦵", Glutes: "🍑", Shoulders: "💪", Biceps: "💪", Triceps: "💪", Calves: "🦵", Core: "🎯", Forearms: "🤝", "Full Body": "🏋️" };
const iconFor = (g) => ICONS[g] || "🏋️";
const IMG = typeof IMAGES === "object" ? IMAGES : {};
function imageKey(e) {
  // Custom exercises show their group emoji rather than a borrowed, possibly misleading photo.
  return IMG[e.name] || null;
}
function thumbHTML(e) {
  const k = imageKey(e);
  return k
    ? '<div class="thumb"><img src="img/t/' + esc(k) + '.jpg" alt="" loading="lazy" decoding="async" width="52" height="52" onerror="this.remove()"></div>'
    : '<div class="thumb">' + esc(e.icon) + "</div>";
}
function heroHTML(e) {
  const k = imageKey(e);
  if (!k) return "";
  return '<div class="hero" data-action="hero-toggle" title="Tap to pause">' +
    '<img src="img/f/' + esc(k) + '-0.jpg" alt="' + esc(e.name) + ' start position" decoding="async">' +
    '<img class="end" src="img/f/' + esc(k) + '-1.jpg" alt="' + esc(e.name) + ' end position" decoding="async">' +
    (e.builtin ? "" : '<span class="hero-tag">' + esc(e.group) + "</span>") + "</div>";
}
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const builtinId = (name) => "b:" + slug(name);
const uid = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const BUILTINS = Object.entries(CATALOG).flatMap(([group, list]) =>
  list.map((entry) => {
    const [name, code] = entry.split("|");
    return { id: builtinId(name), name, group, type: TYPE_CODES[code], icon: iconFor(group), builtin: true };
  })
);
const BUILTIN_BY_NAME = new Map(BUILTINS.map((e) => [e.name.toLowerCase(), e]));
// Former custom-exercise names that were promoted to built-ins; their workouts move to the built-in.
// Former names (custom or renamed built-ins); their workouts move to the current built-in.
const BUILTIN_ALIASES = {
  "chest supported dumbell row": "Chest Supported Dumbbell Row", shrugs: "Dumbbell Shrug",
  "dumbbell row": "Single Arm Dumbbell Row", "cable crossover": "Cable Crossover High to Low",
};
for (const [alias, name] of Object.entries(BUILTIN_ALIASES)) BUILTIN_BY_NAME.set(alias, BUILTIN_BY_NAME.get(name.toLowerCase()));

/** Reuse an existing group's spelling when only the case differs ("chest" -> "Chest"). */
function canonGroup(g, existing) {
  const v = String(g || "").trim() || "Other";
  return existing.find((x) => x.toLowerCase() === v.toLowerCase()) || v;
}

/* ---------- Storage ---------- */
const APP_VERSION = "v32"; // keep in sync with VERSION in sw.js; shown in Settings
const KEY = "strength-log-v3";
const LEGACY_KEYS = ["strength-log-v2"];
const SCHEMA = 5; // 5: updatedAt on items + deletion tombstones (for sync)
const KG_PER_LB = 0.45359237;

let data;
let storageBroken = false;  // true => never write to KEY (unreadable or newer-schema data)
let brokenReason = "";      // "corrupt" | "newer"
let brokenRaw = null;       // the untouched stored JSON when storageBroken
let saveError = "";         // last failed write (e.g. quota exceeded)
let updateReady = false;    // a new service worker took over this page
let pendingImport = null;
const AUTOBACKUP_PREFIX = "strength-log-autobackup-";
const AUTOBACKUP_KEEP = 3;

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
    let fromLegacy = false;
    if (raw == null) {
      for (const k of LEGACY_KEYS) {
        raw = localStorage.getItem(k);
        if (raw != null) { fromLegacy = true; break; }
      }
    }
    if (raw == null) return migrate({});
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    if ((parsed.schemaVersion || 0) > SCHEMA) {
      // Written by a newer app version: show it read-only, never overwrite fields we don't know.
      storageBroken = true;
      brokenReason = "newer";
      brokenRaw = raw;
      const bk = "strength-log-newer-v" + parsed.schemaVersion;
      try { if (localStorage.getItem(bk) == null) localStorage.setItem(bk, raw); } catch (_) {}
      return migrate(parsed);
    }
    if ((parsed.schemaVersion || 0) < SCHEMA || fromLegacy) {
      const bk = "strength-log-premigrate-v" + (parsed.schemaVersion || 3);
      if (localStorage.getItem(bk) == null) localStorage.setItem(bk, raw);
    }
    return migrate(parsed);
  } catch (err) {
    // Never destroy data we couldn't read. Keep a copy and stop saving.
    storageBroken = true;
    brokenReason = "corrupt";
    brokenRaw = raw;
    try { if (raw != null) localStorage.setItem("strength-log-corrupt-" + Date.now(), raw); } catch (_) {}
    return migrate({});
  }
}

function save() {
  writeLocal();
  scheduleSync();
}
function writeLocal() {
  latestCache = null;
  if (storageBroken) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    saveError = "";
  } catch (err) {
    // Shown as a persistent banner (see render) instead of an alert on every save.
    saveError = err && err.name === "QuotaExceededError"
      ? "Browser storage is full."
      : "Could not save: " + (err && err.message);
  }
}

const num = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
function isDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00");
  return !isNaN(d) && localDate(d) === s;
}

/** Normalises any older/foreign data shape into the current schema. Pure: returns a new object. */
function migrate(input) {
  const src = input && typeof input === "object" ? input : {};
  const oldExercises = Array.isArray(src.exercises) ? src.exercises : [];
  const oldSessions = Array.isArray(src.sessions) ? src.sessions : [];

  const idMap = new Map(); // old id -> new id
  const customs = [];
  const seenCustomNames = new Map();
  const customIds = new Set();

  const usedIds = new Set(oldSessions.map((s) => s && String(s.exerciseId)));
  for (const e of oldExercises) {
    if (!e || typeof e !== "object" || e.id == null || !e.name) continue;
    // Built-ins dropped from the catalog are only kept (as custom) if they have workouts.
    if (e.builtin && !BUILTIN_BY_NAME.has(String(e.name).trim().toLowerCase()) && !usedIds.has(String(e.id))) continue;
    const oldId = String(e.id);
    // Old builds could produce duplicate ids; the old app's find() resolved to the first one,
    // so that's what sessions were logged against. Ignore later duplicates.
    if (idMap.has(oldId)) continue;
    const name = String(e.name).trim();
    const b = BUILTIN_BY_NAME.get(name.toLowerCase());
    if (b) { idMap.set(oldId, b.id); continue; }
    const key = name.toLowerCase();
    if (seenCustomNames.has(key)) { idMap.set(oldId, seenCustomNames.get(key)); continue; }
    const id = oldId.startsWith("c") && !customIds.has(oldId) ? oldId : uid("c" + slug(name) + "-");
    customIds.add(id);
    const group = canonGroup(e.group, [...Object.keys(CATALOG), ...customs.map((c) => c.group)]);
    customs.push({
      id, name, group,
      type: TYPES[e.type] ? e.type : "other",
      icon: typeof e.icon === "string" && e.icon ? e.icon : iconFor(group),
      builtin: false,
      updatedAt: num(e.updatedAt),
    });
    seenCustomNames.set(key, id);
    idMap.set(oldId, id);
  }
  for (const b of BUILTINS) idMap.set(b.id, b.id);
  // Renamed built-ins: sessions may reference the old "b:" id without an exercise entry.
  for (const [alias, name] of Object.entries(BUILTIN_ALIASES)) if (!idMap.has(builtinId(alias))) idMap.set(builtinId(alias), builtinId(name));

  const sessions = [];
  const seenSessionIds = new Set();
  for (const s of oldSessions) {
    if (!s || typeof s !== "object") continue;
    const exerciseId = idMap.get(String(s.exerciseId));
    if (!exerciseId) continue;
    const sets = (Array.isArray(s.sets) ? s.sets : [])
      .map((z) => ({ weight: num(z && z.weight), reps: Math.round(num(z && z.reps)) }))
      .filter((z) => z.reps > 0);
    if (!sets.length) continue;
    let id = s.id != null ? String(s.id) : "";
    if (!id || seenSessionIds.has(id)) id = uid("s");
    seenSessionIds.add(id);
    const createdAt = num(s.createdAt) || Date.now();
    sessions.push({
      id, exerciseId,
      date: isDate(s.date) ? s.date : localDate(new Date(createdAt)),
      createdAt,
      updatedAt: num(s.updatedAt) || createdAt,
      sets,
      note: typeof s.note === "string" ? s.note : "",
    });
  }

  const settings = src.settings && typeof src.settings === "object" ? src.settings : {};
  const del = src.deleted && typeof src.deleted === "object" ? src.deleted : {};
  const stamps = (m) => Object.fromEntries(Object.entries(m && typeof m === "object" ? m : {})
    .map(([id, t]) => [id, num(t)]).filter(([id, t]) => t > 0 && !id.startsWith("b:")));
  return {
    schemaVersion: SCHEMA,
    settings: { unit: settings.unit === "lb" ? "lb" : "kg", bodyweight: num(settings.bodyweight), updatedAt: num(settings.updatedAt) },
    deleted: { sessions: stamps(del.sessions), exercises: stamps(del.exercises) },
    exercises: [...BUILTINS.map((b) => ({ ...b })), ...customs],
    sessions,
  };
}

/* ---------- Cloud sync (private GitHub Gist) ----------
 * The token and gist id live under their own key, never in exported backups.
 * Flow: pull the gist, merge with local (mergeData), save locally, push if the cloud copy differs.
 */
const SYNC_KEY = "strength-log-sync";
const GIST_FILE = "strength-log.json";
const GIST_CSV = "strength-log.csv"; // read-only table view, regenerated from the JSON on every sync
const GIST_DESC = "Strength Log sync";
const API = "https://api.github.com";
let sync = readSyncConfig();
let syncTimer = null, syncing = false, syncAgain = false;

function readSyncConfig() {
  try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch (_) { return {}; }
}
function writeSyncConfig() {
  try { localStorage.setItem(SYNC_KEY, JSON.stringify(sync)); } catch (_) {}
}
function scheduleSync(delay = 1500) {
  if (!sync.token || storageBroken) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(runSync, delay);
}
async function gh(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + sync.token, "Content-Type": "application/json" },
  });
  if (res.status === 401) throw new Error("GitHub rejected the token. Check it hasn't expired or been revoked.");
  if (res.status === 403 || res.status === 404) {
    const err = new Error(res.status === 404 ? "Not found" : "Token lacks the Gists permission (or rate limited).");
    err.status = res.status;
    throw err;
  }
  if (!res.ok) throw new Error("GitHub error " + res.status);
  return res.json();
}
async function findOrCreateGist() {
  for (let page = 1; page <= 10; page++) {
    const list = await gh("/gists?per_page=100&page=" + page);
    const hit = list.find((g) => g.description === GIST_DESC && g.files && g.files[GIST_FILE]);
    if (hit) return hit.id;
    if (list.length < 100) break;
  }
  const g = await gh("/gists", { method: "POST", body: JSON.stringify({ description: GIST_DESC, public: false, files: gistFiles(JSON.stringify(data)) }) });
  return g.id;
}
function gistFiles(text) {
  return { [GIST_FILE]: { content: text }, [GIST_CSV]: { content: toCSV(JSON.parse(text)) } };
}
let gistHasCsv = false;
async function readGist() {
  const g = await gh("/gists/" + sync.gistId);
  gistHasCsv = !!(g.files && g.files[GIST_CSV]);
  const f = g.files && g.files[GIST_FILE];
  if (!f) return null;
  const text = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
  const parsed = JSON.parse(text);
  if ((parsed.schemaVersion || 0) > SCHEMA) throw new Error("Cloud data is from a newer app version. Reload to update.");
  return migrate(parsed);
}
async function runSync() {
  if (!sync.token || storageBroken) return;
  if (syncing) { syncAgain = true; return; }
  syncing = true;
  showSyncStatus("Syncing…");
  try {
    if (!sync.gistId) { sync.gistId = await findOrCreateGist(); writeSyncConfig(); }
    let remote;
    try {
      remote = await readGist();
    } catch (err) {
      if (err.status !== 404) throw err;
      sync.gistId = await findOrCreateGist(); // gist was deleted: start a new one
      writeSyncConfig();
      remote = await readGist();
    }
    // No awaits between merge and assignment, so edits made while fetching are kept.
    const merged = remote ? mergeData(data, remote) : data;
    const text = JSON.stringify(merged);
    if (text !== JSON.stringify(data)) {
      data = merged;
      writeLocal();
      if (view.name !== "log" && view.name !== "custom") render();
    }
    if (!remote || !gistHasCsv || JSON.stringify(mergeData(remote, remote)) !== text) {
      await gh("/gists/" + sync.gistId, { method: "PATCH", body: JSON.stringify({ files: gistFiles(text) }) });
    }
    sync.lastSync = Date.now();
    sync.error = "";
  } catch (err) {
    sync.error = navigator.onLine === false ? "Offline – will sync when back online." : err.message;
  }
  writeSyncConfig();
  syncing = false;
  showSyncStatus();
  if (syncAgain) { syncAgain = false; scheduleSync(0); }
}
/** One row per set, oldest first. Opens directly in Excel / Google Sheets / Numbers. */
function toCSV(d) {
  const ex = new Map(d.exercises.map((e) => [e.id, e]));
  const cell = (v) => {
    let t = String(v == null ? "" : v);
    if (typeof v === "string" && /^[=+\-@]/.test(t)) t = "'" + t; // don't let spreadsheets run text as a formula
    return /[",\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  };
  const r1 = (n) => Math.round(n * 10) / 10;
  const rows = [["date", "exercise", "group", "type", "set", "weight_kg", "weight_lb", "reps", "est_1rm_kg", "volume_kg", "note"]];
  for (const s of d.sessions.slice().sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)) {
    const e = ex.get(s.exerciseId) || { name: s.exerciseId, group: "", type: "" };
    s.sets.forEach((z, i) => rows.push([
      s.date, e.name, e.group, e.type, i + 1, z.weight, r1(z.weight / KG_PER_LB), z.reps,
      r1(z.reps <= 1 ? z.weight : z.weight * (1 + z.reps / 30)), r1(z.weight * z.reps), i === 0 ? s.note : "",
    ]));
  }
  return rows.map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";
}

function syncStatusText() {
  if (sync.error) return "⚠ " + sync.error;
  if (!sync.lastSync) return "Not synced yet.";
  const mins = Math.round((Date.now() - sync.lastSync) / 60000);
  return "Synced " + (mins < 1 ? "just now" : mins < 60 ? mins + " min ago" : new Date(sync.lastSync).toLocaleString());
}
function showSyncStatus(text) {
  const el = document.getElementById("sync-status");
  if (el) el.textContent = text || syncStatusText();
}

/* ---------- Helpers ---------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function fmtDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
const unit = () => data.settings.unit;
const round1 = (n) => Math.round(n * 10) / 10;
/** kg -> display number in current unit */
const toUnit = (kg) => round1(unit() === "lb" ? kg / KG_PER_LB : kg);
/** display-unit input -> kg (stored with 3 decimals so round-trips are stable) */
const fromUnit = (v) => Math.round((unit() === "lb" ? v * KG_PER_LB : v) * 1000) / 1000;
/** kg -> form value: 2 decimals so small plates (1.25 kg) survive */
const toInput = (kg) => Math.round((unit() === "lb" ? kg / KG_PER_LB : kg) * 100) / 100;
const fmtW = (kg) => toUnit(kg) + " " + unit();
const bestSet = (sets) => sets.reduce((b, z) => (!b || z.weight > b.weight || (z.weight === b.weight && z.reps > b.reps) ? z : b), null);

const fmtSet = (z) => (z.weight ? fmtW(z.weight) + " × " : "") + z.reps + (z.weight ? "" : " reps");
const sessionSummary = (s) => fmtSet(bestSet(s.sets));
const byNewest = (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
const byOldest = (a, b) => -byNewest(a, b);

const findExercise = (id) => data.exercises.find((e) => e.id === id);
const findSession = (id) => data.sessions.find((s) => s.id === id);
const sessionsFor = (id) => data.sessions.filter((s) => s.exerciseId === id);
let latestCache = null; // exerciseId -> newest session; reset by save()
function lastFor(id) {
  if (!latestCache) {
    latestCache = new Map();
    for (const s of data.sessions) {
      const cur = latestCache.get(s.exerciseId);
      if (!cur || byNewest(s, cur) < 0) latestCache.set(s.exerciseId, s);
    }
  }
  return latestCache.get(id);
}

/* ---------- Progress metrics ----------
 * Est. 1RM (Epley) of the best set is the main strength measure. Bodyweight exercises track
 * best reps instead (only added weight is recorded, so their load is unknown).
 */
const DAY = 86400000;
const E1RM_MAX_REPS = 12; // above this the estimate is unreliable: points are drawn faded
const loadOf = (z) => z.weight;
const e1rmOf = (z, e) => { const w = loadOf(z, e); return z.reps <= 1 ? w : w * (1 + z.reps / 30); };
const exOf = (s) => findExercise(s.exerciseId);
const bestE1rmSet = (s) => { const e = exOf(s); return s.sets.reduce((b, z) => (!b || e1rmOf(z, e) > e1rmOf(b, e) ? z : b), null); };
const sessionE1rm = (s) => { const z = bestE1rmSet(s); return z ? e1rmOf(z, exOf(s)) : 0; };

const METRICS = {
  e1rm: { label: "Est. 1RM", weight: true, of: sessionE1rm },
  top: { label: "Top weight", weight: true, of: (s) => Math.max(0, ...s.sets.map((z) => z.weight)) },
  volume: { label: "Volume", weight: true, of: (s) => { const e = exOf(s); return s.sets.reduce((a, z) => a + loadOf(z, e) * z.reps, 0); } },
  reps: { label: "Best reps", weight: false, of: (s) => Math.max(0, ...s.sets.map((z) => z.reps)) },
};
/** Weighted exercises track est. 1RM; bodyweight exercises (load unknown) track reps. */
const isWeighted = (sessions) => {
  const e = sessions.length ? exOf(sessions[0]) : null;
  // "Added weight only" would make e.g. +5 kg pull-ups look weak: track reps instead.
  if (e && e.type === "bodyweight") return false;
  return sessions.some((s) => sessionE1rm(s) > 0);
};
const metricsFor = (sessions) => (isWeighted(sessions) ? ["e1rm", "top", "volume"] : ["reps"]);
const primaryMetric = (sessions) => metricsFor(sessions)[0];

/** Oldest-first points for a metric, with a trend (best of the last 3 sessions) and PR flags. */
function series(sessions, metric) {
  const pts = [];
  let best = -1;
  for (const s of sessions.slice().sort(byOldest)) {
    const v = METRICS[metric].of(s);
    if (METRICS[metric].weight && metric !== "volume" && v <= 0) continue;
    const z = metric === "e1rm" ? bestE1rmSet(s) : null;
    pts.push({ date: s.date, id: s.id, v, pr: v > best /* first workout is the best so far; later ones must beat it, ties don't count */, faded: !!z && z.reps > E1RM_MAX_REPS });
    best = Math.max(best, v);
  }
  pts.forEach((p, i) => { p.trend = Math.max(...pts.slice(Math.max(0, i - 2), i + 1).map((q) => q.v)); });
  return pts;
}
/**
 * The current best workout (highest main metric; earliest wins a tie) -> index of the set that achieved it.
 * Only one workout per exercise holds the star; it moves when a later workout beats it.
 */
function workoutPRs(sessions) {
  const out = new Map();
  if (!sessions.length) return out;
  const m = primaryMetric(sessions);
  let top = null;
  for (const p of series(sessions, m)) if (!top || p.v > top.v) top = p; // series is oldest-first
  if (!top) return out;
  const s = sessions.find((x) => x.id === top.id);
  const z = m === "e1rm" ? bestE1rmSet(s) : s.sets.reduce((b, x) => (x.reps > b.reps ? x : b));
  out.set(s.id, s.sets.indexOf(z));
  return out;
}
/** Session ids that set a new best in the exercise's main metric. */
function prSessionIds(sessions) {
  if (!sessions.length) return new Set();
  return new Set(series(sessions, primaryMetric(sessions)).filter((p) => p.pr).map((p) => p.id));
}
/** Trend change over ~days: { diff, pct, since } or null when there isn't enough history. */
function trendChange(pts, days) {
  if (pts.length < 2) return null;
  const last = pts[pts.length - 1];
  const cutoff = localDate(new Date(Date.parse(last.date + "T00:00:00") - days * DAY));
  let base = null;
  for (const p of pts) if (p.date <= cutoff) base = p;
  if (!base) {
    base = pts[0];
    if (Date.parse(last.date) - Date.parse(base.date) < 14 * DAY) return null; // under 2 weeks: too early to tell
  }
  if (!base.trend) return null;
  return { diff: last.trend - base.trend, pct: ((last.trend - base.trend) / base.trend) * 100, since: base.date };
}
const mondayOf = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

/* ---------- Rendering ---------- */
const app = document.getElementById("app");
let view = { name: "today", tab: "today" };
let libFilter = "All";
let libQuery = "";

/** Sessions grouped by workout date, newest first: [[date, sessions[]], ...]. */
function workoutDays() {
  const days = new Map();
  for (const s of data.sessions.slice().sort(byNewest)) {
    if (!findExercise(s.exerciseId)) continue;
    if (!days.has(s.date)) days.set(s.date, []);
    days.get(s.date).push(s);
  }
  return [...days];
}

function dayHTML([d, list]) {
  const today = localDate(), yesterday = localDate(addDays(new Date(), -1));
  const label = d === today ? "Today" : d === yesterday ? "Yesterday" : fmtDate(d);
  const sets = list.reduce((n, s) => n + s.sets.length, 0);
  return '<div class="section day"><h3>' + esc(label) + ' <span class="muted">· ' + list.length + " exercise" + (list.length > 1 ? "s" : "") + " · " + sets + " set" + (sets === 1 ? "" : "s") + "</span></h3>" +
    list.map((s) => exerciseRow(findExercise(s.exerciseId), s.sets.length + " set" + (s.sets.length === 1 ? "" : "s") + " · best " + sessionSummary(s))).join("") + "</div>";
}

/* ---------- Navigation ----------
 * Bottom tabs + URL hash (#/insights, #/exercise/<id>, #/log/<id>/<sessionId>) so the
 * phone's back button works. Detail pages keep the tab they were opened from highlighted.
 */
const TABS = [
  ["today", "Today", '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/>'],
  ["activity", "Activity", '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>'],
  ["insights", "Insights", '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'],
  ["library", "Exercises", '<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>'],
  ["settings", "Settings", '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'],
];
let navDepth = 0; // in-app pages on the history stack, so Back never leaves the app
const TAB_NAMES = new Set(TABS.map((t) => t[0]));
const FORM_VIEWS = new Set(["log", "custom", "import"]); // no tab bar: keeps forms clear of the keyboard

function viewHash(v) {
  const parts = [v.name];
  if (v.id) parts.push(v.id);
  if (v.sessionId) parts.push(v.sessionId);
  return "#/" + parts.map(encodeURIComponent).join("/");
}
function viewFromHash(h) {
  const [name, id, sessionId] = String(h || "").replace(/^#\/?/, "").split("/").map((s) => { try { return decodeURIComponent(s); } catch (_) { return ""; } });
  if (name === "home" || name === "history") return { name: name === "home" ? "today" : "activity" };
  if (!VIEWS[name] || name === "import") return { name: "today" };
  return { name, ...(id ? { id } : {}), ...(sessionId ? { sessionId } : {}) };
}
/** opts.replace: swap out the current page (e.g. a submitted form) instead of stacking a new one. */
function go(name, params = {}, opts = {}) {
  if (name === "home") name = "today";
  const tab = TAB_NAMES.has(name) ? name : view.tab || (name === "exercise" || name === "custom" ? "library" : "today");
  view = { name, ...params, tab };
  const h = viewHash(view);
  if (opts.replace) history.replaceState(null, "", h);
  else if (location.hash !== h) { history.pushState(null, "", h); navDepth++; }
  render();
  window.scrollTo(0, 0);
}
window.addEventListener("popstate", () => {
  navDepth = Math.max(0, navDepth - 1);
  const prevTab = view.tab;
  view = viewFromHash(location.hash);
  view.tab = TAB_NAMES.has(view.name) ? view.name : prevTab;
  if (location.hash !== viewHash(view)) history.replaceState(null, "", viewHash(view)); // e.g. a hand-typed bad hash
  render();
});
function tabBarHTML() {
  if (FORM_VIEWS.has(view.name)) return "";
  const active = TAB_NAMES.has(view.name) ? view.name : view.tab;
  return '<nav class="tabbar">' + TABS.map(([id, label, icon]) =>
    '<button data-action="tab" data-id="' + id + '"' + (id === active ? ' class="active" aria-current="page"' : "") + ">" +
    '<svg viewBox="0 0 24 24" aria-hidden="true">' + icon + "</svg><span>" + label + "</span></button>"
  ).join("") + "</nav>";
}

function render() {
  const fn = VIEWS[view.name] || VIEWS.today;
  let banner = "";
  if (storageBroken && brokenReason === "newer") {
    banner += '<div class="banner"><b>This data was saved by a newer version of Strength Log.</b> It is shown read-only and changes are <b>not being saved</b>. Reload to get the latest version, or <button class="btn small" data-action="unlock-storage">start fresh</button> (a copy is kept as <code>strength-log-newer-*</code>).</div>';
  } else if (storageBroken) {
    banner += '<div class="banner"><b>Saved data could not be read.</b> A copy was kept in this browser (key <code>strength-log-corrupt-*</code>). Changes are <b>not being saved</b>. Import a backup, or <button class="btn small" data-action="unlock-storage">start fresh</button>.</div>';
  }
  if (saveError) {
    banner += '<div class="banner"><b>' + esc(saveError) + '</b> Recent changes are <b>not saved</b>. <button class="btn small" data-action="export">Export backup</button> now.</div>';
  }
  if (updateReady) {
    banner += '<div class="banner info">A new version is available. <button class="btn small" data-action="reload">Reload</button></div>';
  }
  app.innerHTML = banner + fn(view) + tabBarHTML();
  if (view.name === "library") renderLibraryList();
}

function exerciseRow(e, sub, right = "") {
  return '<button class="exercise" data-action="open" data-id="' + esc(e.id) + '">' + thumbHTML(e) +
    '<div class="info"><b>' + esc(e.name) + "</b><small>" + esc(sub) + "</small></div>" +
    (right ? '<div class="right">' + right + "</div>" : "<span>›</span>") + "</button>";
}

/** Value in the metric's display unit. */
function fmtMetric(v, m) {
  if (!METRICS[m].weight) return Math.round(v) + " reps";
  if (m === "volume") return Math.round(toUnit(v)).toLocaleString() + " " + unit();
  return fmtW(v);
}
function fmtChange(ch, m) {
  const up = ch.diff >= 0;
  const d = METRICS[m].weight ? toUnit(Math.abs(ch.diff)) + " " + unit() : Math.round(Math.abs(ch.diff)) + " reps";
  return '<span class="change ' + (up ? "up" : "down") + '">' + (up ? "▲ +" : "▼ −") + esc(d) + " (" + (up ? "+" : "−") + Math.abs(ch.pct).toFixed(0) + "%)</span>";
}

/* ---------- Insights helpers ---------- */
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
const daysAgo = (iso) => Math.round((Date.parse(localDate() + "T00:00:00") - Date.parse(iso + "T00:00:00")) / DAY);
const agoText = (iso) => { const n = daysAgo(iso); return n <= 0 ? "today" : n === 1 ? "yesterday" : n + " days ago"; };
const weekKey = (iso) => localDate(mondayOf(new Date(iso + "T00:00:00")));
const sessionVolume = (s) => METRICS.volume.of(s);

/** Sessions of known exercises, grouped by exercise id. */
function sessionsByExercise() {
  const byEx = new Map();
  for (const s of data.sessions) {
    if (!findExercise(s.exerciseId)) continue;
    if (!byEx.has(s.exerciseId)) byEx.set(s.exerciseId, []);
    byEx.get(s.exerciseId).push(s);
  }
  return byEx;
}

/** Per-week totals for the last n weeks, oldest first: [{ week, sets, days }]. */
function weeklyTotals(n) {
  const mon = mondayOf(new Date());
  const weeks = [];
  for (let i = n - 1; i >= 0; i--) weeks.push({ week: localDate(addDays(mon, -7 * i)), sets: 0, days: new Set() });
  const idx = new Map(weeks.map((w, i) => [w.week, i]));
  for (const s of data.sessions) {
    const i = idx.get(weekKey(s.date));
    if (i === undefined || !exOf(s)) continue;
    weeks[i].sets += s.sets.length;
    weeks[i].days.add(s.date);
  }
  return weeks.map((w) => ({ ...w, days: w.days.size }));
}

/** Consecutive weeks with at least one workout. The current week only counts once trained. */
function weekStreaks() {
  const weeks = new Set(data.sessions.filter(exOf).map((s) => weekKey(s.date)));
  let w = mondayOf(new Date());
  if (!weeks.has(localDate(w))) w = addDays(w, -7);
  let current = 0;
  while (weeks.has(localDate(w))) { current++; w = addDays(w, -7); }
  let best = 0, run = 0, prev = null;
  for (const k of [...weeks].sort()) {
    run = prev && localDate(addDays(new Date(prev + "T00:00:00"), 7)) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return { current, best };
}

/** Workout days per week, averaged over the last 4 weeks and the 4 before. */
function frequency() {
  const today = new Date();
  const from4 = localDate(addDays(today, -27)), from8 = localDate(addDays(today, -55));
  const recent = new Set(), before = new Set();
  for (const s of data.sessions) {
    if (!exOf(s)) continue;
    if (s.date >= from4) recent.add(s.date);
    else if (s.date >= from8) before.add(s.date);
  }
  return { recent: recent.size / 4, before: before.size / 4 };
}

/** New bests in the main metric (not counting an exercise's first workout), newest first. */
function recentPRs(days) {
  const from = localDate(addDays(new Date(), -days));
  const out = [];
  for (const [id, list] of sessionsByExercise()) {
    const m = primaryMetric(list);
    const pts = series(list, m);
    let prevBest = pts.length ? pts[0].v : 0;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      if (p.pr && p.date >= from) out.push({ e: findExercise(id), m, date: p.date, v: p.v, diff: p.v - prevBest });
      prevBest = Math.max(prevBest, p.v);
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

/* ---------- Insights cards ---------- */
function consistencyCardHTML() {
  const st = weekStreaks(), fq = frequency();
  const wk = weeklyTotals(1)[0];
  const trend = fq.before > 0
    ? '<div class="muted" style="margin-top:8px">Workouts per week: <b style="color:#fff">' + fq.recent.toFixed(1) + "</b> over the last 4 weeks vs " + fq.before.toFixed(1) + " the 4 weeks before</div>"
    : "";
  return '<div class="card"><b>Consistency</b><div class="stats">' +
    stat(plural(st.current, "week"), "Current streak") + stat(plural(st.best, "week"), "Best streak") +
    stat(wk.days, "Workouts this week") + stat(fq.recent.toFixed(1), "Avg / week (4 wk)") + "</div>" + trend + "</div>";
}

/** Bar chart of sets per week (last 12 weeks), with this week vs last week volume. */
function weeklyCardHTML() {
  const weeks = weeklyTotals(12);
  const W = 360, H = 150, P = { l: 8, r: 8, t: 18, b: 22 };
  const max = Math.max(10, ...weeks.map((w) => w.sets));
  const bw = (W - P.l - P.r) / weeks.length;
  const bars = weeks.map((w, i) => {
    const h = ((H - P.t - P.b) * w.sets) / max;
    const x = P.l + i * bw + 3, y = H - P.b - h;
    const cur = i === weeks.length - 1;
    return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw - 6).toFixed(1) + '" height="' + Math.max(h, w.sets ? 2 : 0).toFixed(1) + '" rx="3" fill="' + (cur ? "#fff" : "#555") + '"><title>' +
      esc("Week of " + fmtDate(w.week) + ": " + plural(w.sets, "set")) + "</title></rect>" +
      (w.sets ? '<text x="' + (x + (bw - 6) / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle">' + w.sets + "</text>" : "");
  }).join("");
  const short = (iso) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const labels = '<text x="' + P.l + '" y="' + (H - 6) + '">' + esc(short(weeks[0].week)) + '</text><text x="' + (W - P.r) + '" y="' + (H - 6) + '" text-anchor="end">This week</text>';
  // Compare this week so far with last week up to the same weekday, so a half-done week isn't "down".
  const mon = mondayOf(new Date());
  const thisFrom = localDate(mon), prevFrom = localDate(addDays(mon, -7));
  const prevTo = localDate(addDays(new Date(), -7));
  const volumeIn = (from, to) => data.sessions.reduce((a, s) => (s.date >= from && s.date <= to && exOf(s) ? a + sessionVolume(s) : a), 0);
  const vCur = volumeIn(thisFrom, localDate()), vPrev = volumeIn(prevFrom, prevTo);
  let vs = "";
  if (vPrev > 0) {
    const diff = vCur - vPrev;
    vs = '<div style="margin-top:8px">Volume ' + fmtChange({ diff, pct: (diff / vPrev) * 100 }, "volume") + '</div><div class="muted">This week so far vs last week up to ' +
      esc(new Date().toLocaleDateString(undefined, { weekday: "long" })) + "</div>";
  }
  return '<div class="card"><b>Weekly sets</b><div class="muted">Last 12 weeks · this week in white</div>' +
    '<svg class="chart bars" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Sets per week, last 12 weeks">' + bars + labels + "</svg>" + vs + "</div>";
}

function prCardHTML() {
  const prs = recentPRs(30);
  const body = prs.length
    ? prs.slice(0, 6).map((p) => {
      const val = p.m === "e1rm" ? "Est. 1RM " + fmtMetric(p.v, p.m) : fmtMetric(p.v, p.m);
      const gain = p.diff > 0 ? '<span class="change up">+' + esc(p.m === "e1rm" ? toUnit(p.diff) + " " + unit() : Math.round(p.diff) + " reps") + "</span>" : "";
      return exerciseRow(p.e, val + " · " + agoText(p.date), gain);
    }).join("")
    : '<div class="muted" style="margin-top:6px">No new bests in the last 30 days.</div>';
  return '<div class="card"><b>Personal records</b><div class="muted">New bests in the last 30 days' + (prs.length > 6 ? " · " + prs.length + " total" : "") + "</div>" + body + "</div>";
}

/** Trained in the last 2 weeks, but no new best est. 1RM in the last 6 weeks. */
function plateauCardHTML() {
  const today = new Date();
  const from14 = localDate(addDays(today, -14)), from42 = localDate(addDays(today, -42));
  const stalled = [];
  for (const [id, list] of sessionsByExercise()) {
    if (list.length < 3 || !isWeighted(list)) continue;
    const lastSession = list.reduce((d, s) => (s.date > d ? s.date : d), "");
    if (lastSession < from14) continue;
    const prPts = series(list, "e1rm").filter((p) => p.pr);
    const lastPR = prPts.length ? prPts[prPts.length - 1].date : "";
    if (lastPR < from42) stalled.push({ e: findExercise(id), lastPR });
  }
  stalled.sort((a, b) => a.lastPR.localeCompare(b.lastPR));
  return '<div class="card"><b>Plateaus</b>' + (stalled.length
    ? '<div class="muted">No new best est. 1RM in 6+ weeks. Try adding a rep or a small plate.</div>' +
      stalled.slice(0, 5).map(({ e, lastPR }) => exerciseRow(e, "Last best " + fmtDate(lastPR))).join("")
    : '<div class="muted" style="margin-top:6px">None: every recently trained lift has set a best in the last 6 weeks.</div>') + "</div>";
}

/** Sets per muscle group in the last 7 days, with a 10–20 sets/week guide band. */
function muscleCardHTML() {
  const today = new Date();
  const from7 = localDate(addDays(today, -6)), from28 = localDate(addDays(today, -27));
  const count = new Map();
  for (const s of data.sessions) {
    if (s.date < from28) continue;
    const e = exOf(s);
    if (!e) continue;
    if (!count.has(e.group)) count.set(e.group, 0);
    if (s.date >= from7) count.set(e.group, count.get(e.group) + s.sets.length);
  }
  if (!count.size) return "";
  const rows = [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(22, ...rows.map(([, n]) => n + 2));
  const pct = (n) => ((n / max) * 100).toFixed(1) + "%";
  return '<div class="card"><b>Sets per muscle group</b><div class="muted">Last 7 days · shaded band = 10–20 sets, a common weekly target for muscle growth</div>' +
    rows.map(([g, n]) =>
      '<div class="mrow"><span>' + esc(g) + '</span><div class="mbar"><div class="mband" style="left:' + pct(10) + ";width:" + pct(10) + '"></div>' +
      '<div class="mfill" style="width:' + pct(n) + '"></div></div><b>' + n + "</b></div>"
    ).join("") + "</div>";
}

/** Last 16 weeks, one square per day (Mon top), shaded by sets logged. */
function heatmapHTML() {
  const WEEKS = 16;
  const sets = new Map();
  for (const s of data.sessions) if (exOf(s)) sets.set(s.date, (sets.get(s.date) || 0) + s.sets.length);
  const start = addDays(mondayOf(new Date()), -7 * (WEEKS - 1));
  const today = localDate();
  let cells = "";
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = localDate(addDays(start, i));
    const n = sets.get(d) || 0;
    const lvl = d > today ? " future" : n >= 20 ? " l3" : n >= 10 ? " l2" : n > 0 ? " l1" : "";
    cells += '<i class="' + lvl.trim() + '" title="' + esc(fmtDate(d) + (n ? " · " + plural(n, "set") : "")) + '"></i>';
  }
  const days = new Set([...sets.keys()].filter((d) => d >= localDate(start) && d <= today)).size;
  return '<div class="card"><div class="card-head"><b>Last 16 weeks</b><span class="muted">' + plural(days, "workout day") + "</span></div>" +
    '<div class="heat">' + cells + "</div>" +
    '<div class="legend"><span>Less</span><span class="heat-key"><i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i></span><span>More · 1–9 / 10–19 / 20+ sets</span></div></div>';
}

/** Exercises you train regularly that weren't done today, most overdue first. */
function suggestionsHTML() {
  const today = localDate(), from42 = localDate(addDays(new Date(), -42));
  const doneToday = new Set(data.sessions.filter((s) => s.date === today).map((s) => s.exerciseId));
  const rows = [];
  for (const [id, list] of sessionsByExercise()) {
    if (doneToday.has(id)) continue;
    const recent = list.filter((s) => s.date >= from42);
    if (!recent.length) continue;
    rows.push({ e: findExercise(id), last: lastFor(id), n: recent.length });
  }
  rows.sort((a, b) => a.last.date.localeCompare(b.last.date) || b.n - a.n);
  if (!rows.length) return "";
  return '<div class="top" style="margin:22px 0 0"><h3>Your exercises</h3><span class="muted">Least recently trained first</span></div>' +
    rows.slice(0, 8).map(({ e, last }) => exerciseRow(e, sessionSummary(last) + " · " + agoText(last.date),
      '<span class="btn small primary" data-action="log" data-id="' + esc(e.id) + '">+ Log</span>')).join("");
}

function settingsHTML() {
  return '<div class="card">' +
    '<label style="margin-top:0">Units</label><div class="seg">' + ["kg", "lb"].map((u) => '<button data-action="unit" data-id="' + u + '" class="' + (unit() === u ? "active" : "") + '">' + u + "</button>").join("") + "</div>" +
    '<label>Data</label><div class="muted" style="margin-bottom:10px">Your workouts stay on this device. Export a backup regularly.</div>' +
    '<div class="row"><button class="btn" data-action="export">Export backup</button><button class="btn" data-action="import">Import backup</button><button class="btn danger" data-action="reset">Reset app</button></div>' +
    syncSettingsHTML() +
    '<div class="muted" style="margin-top:16px">App version ' + APP_VERSION + "</div></div>";
}

const VIEWS = {
  today() {
    const today = localDate();
    const done = data.sessions.filter((s) => s.date === today && exOf(s)).sort(byOldest);
    const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    let html = '<div class="top"><div><h1>Today</h1><div class="muted">' + esc(dateLabel) + '</div></div><button class="btn" data-action="library">+ Exercise</button></div>';
    if (!data.sessions.length) {
      return html + '<div class="card empty">No exercises logged yet.<br><br><button class="btn primary" data-action="library">Choose an exercise</button></div>';
    }
    if (done.length) {
      html += dayHTML([today, done]);
    } else {
      const last = workoutDays()[0];
      html += '<div class="card"><b>No workout logged yet today</b>' +
        (last ? '<div class="muted" style="margin-top:4px">Last workout ' + esc(agoText(last[0])) + " · " + esc(plural(last[1].length, "exercise")) + "</div>" : "") + "</div>";
    }
    const wk = weeklyTotals(1)[0], st = weekStreaks();
    html += '<div class="stats">' + stat(wk.days, "Workouts this week") + stat(wk.sets, "Sets this week") +
      stat(plural(st.current, "week"), "Streak") + stat(recentPRs(7).length, "PRs this week") + "</div>";
    return html + suggestionsHTML();
  },

  activity() {
    const all = workoutDays();
    let html = '<div class="top"><div><h1>Activity</h1><div class="muted">' + plural(all.length, "workout day") + "</div></div></div>";
    if (!all.length) return html + '<div class="card empty">No workouts logged yet.</div>';
    html += heatmapHTML();
    let month = "";
    for (const day of all) {
      const m = new Date(day[0] + "T00:00").toLocaleDateString(undefined, { month: "long", year: "numeric" });
      if (m !== month) { month = m; html += '<h2 class="muted" style="margin:24px 0 0">' + esc(m) + "</h2>"; }
      html += dayHTML(day);
    }
    return html;
  },

  insights() {
    const html = '<div class="top"><div><h1>Insights</h1><div class="muted">How your training is going</div></div></div>';
    if (!sessionsByExercise().size) return html + '<div class="card empty">Log a few workouts to see insights.</div>';
    return html + consistencyCardHTML() + weeklyCardHTML() + prCardHTML() + muscleCardHTML() + plateauCardHTML();
  },

  settings() {
    return '<div class="top"><div><h1>Settings</h1></div></div>' + settingsHTML();
  },

  library() {
    const groups = Object.keys(CATALOG);
    const customGroups = [...new Set(data.exercises.filter((e) => !e.builtin).map((e) => e.group))].filter((g) => !groups.includes(g));
    const all = ["All", ...groups, ...customGroups];
    if (!all.includes(libFilter)) libFilter = "All";
    const chips = all.map((g) => '<button class="chip' + (g === libFilter ? " active" : "") + '" data-action="filter" data-id="' + esc(g) + '">' + esc(g) + "</button>").join("");
    return '<div class="top"><div><h1>Exercises</h1><div class="muted">' + data.exercises.length + " exercises · " + (all.length - 1) + ' muscle groups</div></div><button class="btn" data-action="custom">+ Custom</button></div>' +
      '<div class="search"><input id="q" type="search" placeholder="Search exercises..." value="' + esc(libQuery) + '"></div>' +
      '<div class="chips">' + chips + '</div><div id="lib"></div>';
  },

  custom({ id }) {
    const e = id ? findExercise(id) : null;
    if (id && (!e || e.builtin)) return notFound();
    const opts = Object.entries(TYPES).map(([k, v]) => '<option value="' + k + '"' + (e && e.type === k ? " selected" : "") + ">" + esc(v.label) + "</option>").join("");
    const groupOpts = [...new Set(data.exercises.map((x) => x.group))].map((g) => '<option value="' + esc(g) + '">').join("");
    return backBtn("back", "Back") +
      "<h2>" + (e ? "Edit exercise" : "Custom exercise") + "</h2>" +
      '<label for="ename">Exercise name</label><input id="ename" placeholder="e.g. Hammer Strength Press" value="' + esc(e ? e.name : "") + '">' +
      '<label for="egroup">Muscle group</label><input id="egroup" list="groups" placeholder="e.g. Chest" value="' + esc(e ? e.group : "") + '"><datalist id="groups">' + groupOpts + "</datalist>" +
      '<label for="etype">Weight convention</label><select id="etype">' + opts + "</select>" +
      '<div class="row" style="margin-top:18px"><button class="btn primary" data-action="save-custom" data-id="' + esc(e ? e.id : "") + '">' + (e ? "Save" : "Create exercise") + "</button>" +
      (e ? '<button class="btn danger" data-action="delete-custom" data-id="' + esc(e.id) + '">Delete exercise</button>' : "") + "</div>";
  },

  exercise({ id }) {
    const e = findExercise(id);
    if (!e) return notFound();
    const sessions = sessionsFor(id).sort(byNewest);
    const prInfo = workoutPRs(sessions);
    const metrics = sessions.length ? metricsFor(sessions) : ["e1rm"];
    const metric = metrics.includes(chartMetric) ? chartMetric : metrics[0];
    const weighted = metrics[0] === "e1rm";
    let top = 0, best1rm = 0, bestReps = 0;
    for (const s of sessions) {
      top = Math.max(top, METRICS.top.of(s));
      best1rm = Math.max(best1rm, sessionE1rm(s));
      bestReps = Math.max(bestReps, METRICS.reps.of(s));
    }
    const last = sessions[0];

    const mainMetric = metrics[0];
    const history = sessions.length ? sessions.map((s) => {
      const isPR = prInfo.has(s.id);
      const prSet = isPR ? prInfo.get(s.id) : -1;
      return '<div class="session' + (isPR ? " is-pr" : "") + '"><div class="session-head"><b>' + esc(fmtDate(s.date)) + (isPR ? '<span class="pr">★ PR</span>' : "") + "</b>" +
        '<div class="row"><button class="btn small" data-action="edit-session" data-id="' + esc(s.id) + '">Edit</button>' +
        '<button class="btn small danger" data-action="delete-session" data-id="' + esc(s.id) + '">Delete</button></div></div>' +
        '<div class="session-sub' + (isPR ? " pr-text" : "") + '">' + (isPR ? "★ " : "") +
        (mainMetric === "e1rm" ? "Est. 1RM " + esc(fmtW(sessionE1rm(s))) : esc(METRICS.reps.of(s)) + " best reps") + "</div>" +
        '<table class="history"><tr><th>Set</th><th>Weight</th><th>Reps</th></tr>' +
        s.sets.map((z, i) => "<tr" + (i === prSet ? ' class="pr-set"' : "") + "><td>" + (i + 1) + "</td><td>" + esc(fmtW(z.weight)) + (i === prSet ? ' <span class="pr-text">★</span>' : "") + "</td><td>" + esc(z.reps) + "</td></tr>").join("") +
        "</table>" + (s.note ? '<div class="session-note">' + esc(s.note) + "</div>" : "") + "</div>";
    }).join("") : '<div class="empty">No workouts logged yet.</div>';

    // Progress chart: metric toggle, time range, trend change.
    const all = series(sessions, metric);
    const days = RANGES[chartRange];
    const cutoff = days ? localDate(new Date(Date.now() - days * DAY)) : "";
    const pts = all.filter((p) => p.date >= cutoff);
    const ch = trendChange(series(sessions, metrics[0]), 56);
    let progress = '<div class="card"><div class="card-head"><b>Progress</b>' +
      (metrics.length > 1 ? '<div class="seg small">' + metrics.map((m) => '<button data-action="metric" data-id="' + m + '" class="' + (m === metric ? "active" : "") + '">' + METRICS[m].label + "</button>").join("") + "</div>" : "") +
      "</div>";
    if (ch) progress += '<div class="muted" style="margin-top:6px">' + METRICS[metrics[0]].label + " " + fmtChange(ch, metrics[0]) + " since " + esc(fmtDate(ch.since)) + "</div>";
    if (all.length < 2) {
      progress += '<div class="muted" style="margin-top:6px">' + (sessions.length ? "Log one more workout" : "Log at least two workouts") + " to see your progress chart.</div>";
    } else {
      progress += (pts.length >= 2 ? chart(pts, metric) : '<div class="empty">Not enough workouts in this range.</div>') +
        '<div class="legend"><span><i class="dot"></i>workout</span><span><i class="line"></i>trend (best of last 3)</span><span class="star">★ PR</span>' +
        (metric === "e1rm" && all.some((p) => p.faded) ? '<span><i class="dot faded"></i>&gt;' + E1RM_MAX_REPS + " reps (rough estimate)</span>" : "") + "</div>" +
        '<div class="chips" style="margin-top:10px">' + Object.keys(RANGES).map((r) => '<button class="chip' + (r === chartRange ? " active" : "") + '" data-action="range" data-id="' + r + '">' + r + "</button>").join("") + "</div>";
    }
    progress += "</div>";

    return backBtn("back", "Back") +
      '<div class="top"><div><h2>' + esc(e.name) + '</h2><div class="muted">' + esc(e.group) + " · " + esc(e.type) +
      (e.builtin ? "" : ' · <a href="#" data-action="custom" data-id="' + esc(e.id) + '" style="color:#aaa">edit</a>') +
      '</div></div><button class="btn primary" data-action="log" data-id="' + esc(id) + '">+ Log</button></div>' +
      heroHTML(e) +
      '<div class="note">' + esc((TYPES[e.type] || TYPES.other).hint) + "</div>" +
      '<div class="stats">' +
      (weighted
        ? stat(best1rm ? fmtW(best1rm) : "—", "Best est. 1RM") + stat(top ? fmtW(top) : "—", "Best weight")
        : stat(bestReps || "—", "Best reps") + stat(sessions.reduce((a, s) => a + s.sets.length, 0), "Total sets")) +
      stat(sessions.length, "Workouts") +
      stat(last ? fmtDate(last.date) : "—", "Last trained") + "</div>" +
      progress +
      '<div class="card"><b>History</b>' + history + "</div>";
  },

  log({ id, sessionId }) {
    const e = findExercise(id);
    if (!e) return notFound();
    const editing = sessionId ? findSession(sessionId) : null;
    if (sessionId && !editing) return notFound();
    const last = lastFor(id);
    const base = editing ? editing.sets : last ? last.sets : [{ weight: "", reps: "" }];
    const sets = base.map((z) => ({ weight: z.weight === "" ? "" : toInput(z.weight), kg: z.weight, reps: z.reps }));
    return backBtn("back", "Back") +
      "<h2>" + (editing ? "Edit workout" : "Log workout") + '</h2><div class="muted">' + (editing ? "" : last ? "Previous workout pre-filled." : "") + "</div>" +
      '<label for="wdate">Date</label><input id="wdate" type="date" max="' + localDate() + '" value="' + esc(editing ? editing.date : localDate()) + '">' +
      '<div class="card"><div class="set" style="margin-top:0"><span></span><small class="muted">Weight (' + unit() + ')</small><small class="muted">Reps</small><span></span></div>' +
      '<div id="sets">' + sets.map(setRow).join("") + '</div><button class="btn" data-action="add-set">+ Set</button></div>' +
      '<label for="wnote">Note (optional)</label><textarea id="wnote" placeholder="How did it feel?">' + esc(editing ? editing.note : "") + "</textarea>" +
      '<div style="margin-top:15px"><button class="btn primary" data-action="save-session" data-id="' + esc(id) + '"' + (editing ? ' data-session="' + esc(editing.id) + '"' : "") + ">Save workout</button></div>";
  },

  import() {
    if (!pendingImport) return notFound();
    const p = pendingImport;
    return backBtn("settings", "Cancel") + "<h2>Import backup</h2>" +
      '<div class="card">Backup contains <b>' + p.sessions.length + "</b> workouts and <b>" + p.exercises.filter((e) => !e.builtin).length + "</b> custom exercises.<br>" +
      'This device has <b>' + data.sessions.length + "</b> workouts.</div>" +
      '<div class="note">Merge keeps everything here and adds what is new from the backup. Replace discards current data. A copy of current data is saved in this browser either way.</div>' +
      '<div class="row" style="margin-top:15px"><button class="btn primary" data-action="import-merge">Merge</button><button class="btn danger" data-action="import-replace">Replace</button></div>';
  },
};

function syncSettingsHTML() {
  if (sync.token) {
    return '<label>Cloud sync</label><div class="muted">GitHub Gist · <span id="sync-status">' + esc(syncStatusText()) + "</span></div>" +
      '<div class="row" style="margin-top:10px"><button class="btn" data-action="sync-now">Sync now</button><button class="btn danger" data-action="sync-off">Disconnect</button></div>';
  }
  return '<label for="gtoken">Cloud sync (GitHub Gist)</label>' +
    '<div class="muted" style="margin-bottom:10px">Keeps your workouts in a private gist so they survive clearing browser data and sync across devices. ' +
    'Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style="color:#aaa">fine-grained token</a> ' +
    'with only <b>Account permissions → Gists: Read and write</b>, then paste it here. It is stored only on this device.</div>' +
    '<input id="gtoken" type="password" autocomplete="off" placeholder="github_pat_…">' +
    '<div class="row" style="margin-top:10px"><button class="btn primary" data-action="sync-on">Connect</button></div>';
}

function backBtn(action, label, id = "") {
  return '<button class="btn back" data-action="' + action + '" data-id="' + esc(id) + '">← ' + esc(label) + "</button>";
}
function stat(v, label) { return '<div class="stat"><b>' + esc(v) + "</b><span>" + esc(label) + "</span></div>"; }
function notFound() { return backBtn("today", "Today") + '<div class="card empty">Not found.</div>'; }

/** z: { weight: display value, kg?: original stored kg (kept if the field is left unchanged), reps } */
function setRow(z, i) {
  const keep = z.kg !== undefined && z.kg !== "" ? ' data-kg="' + esc(z.kg) + '" data-shown="' + esc(z.weight) + '"' : "";
  return '<div class="set"><span>' + (i + 1) + '</span><input class="wt" type="number" inputmode="decimal" step="any" min="0"' + keep + ' value="' + esc(z.weight) +
    '" placeholder="' + unit() + '"><input class="rp" type="number" inputmode="numeric" min="0" step="1" value="' + esc(z.reps) +
    '" placeholder="reps"><button class="del" data-action="remove-set" aria-label="Remove set">×</button></div>';
}
function renumberSets() {
  document.querySelectorAll("#sets .set > span").forEach((el, i) => { el.textContent = i + 1; });
}

const RANGES = { "1M": 30, "3M": 91, "6M": 182, "1Y": 365, All: 0 };
let chartMetric = null; // null = exercise's main metric
let chartRange = "All";

/**
 * Whole-number y-axis that adapts to the data: tries round steps (1, 2, 5, 10, 20, 25, 50, 100, …),
 * snaps the bounds to each, and keeps the one giving closest to 5 gridlines (max 6).
 * e.g. 68–84 -> 65 70 75 80 85;  55–95 -> 50 60 70 80 90 100;  1.2k–5.4k -> 1000 … 6000.
 */
function niceAxis(min, max) {
  if (max - min < 2) { min -= 1; max += 1; } // flat data: give it some room
  const pad = (max - min) * 0.05;
  min = Math.max(0, min - pad); max += pad;
  let best = null;
  for (let k = 1; k <= 1e7; k *= 10) {
    for (const step of [k, 2 * k, 5 * k, ...(k >= 10 ? [2.5 * k] : [])]) {
      const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
      const n = Math.round((hi - lo) / step) + 1;
      if (n > 6) continue;
      const score = Math.abs(n - 5) + (hi - lo - (max - min)) / (max - min) * 0.5; // prefer ~5 ticks, little wasted space
      if (!best || score < best.score) best = { lo, hi, step, score };
    }
  }
  const ticks = [];
  for (let v = best.lo; v <= best.hi + 1e-9; v += best.step) ticks.push(v);
  return { lo: best.lo, hi: best.hi, ticks };
}

/** Progress chart: grey line through workouts, white trend line, gold ★ on PRs, faded low-confidence points. */
function chart(pts, metric) {
  const toV = (v) => (METRICS[metric].weight ? toUnit(v) : v);
  const W = 360, H = 200, P = { l: 38, r: 10, t: 14, b: 24 }; // ~phone width, so text isn't scaled down
  const vals = pts.map((p) => toV(p.v)), trend = pts.map((p) => toV(p.trend));
  const { lo, hi, ticks } = niceAxis(Math.min(...vals), Math.max(...vals));
  const t0 = Date.parse(pts[0].date), t1 = Date.parse(pts[pts.length - 1].date);
  const x = (d, i) => P.l + (W - P.l - P.r) * (t1 > t0 ? (Date.parse(d) - t0) / (t1 - t0) : i / Math.max(1, pts.length - 1));
  const y = (v) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  const path = (vs) => vs.map((v, i) => (i ? "L" : "M") + x(pts[i].date, i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  const grid = ticks.map((v) =>
    '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#262626"/><text x="' + (P.l - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + v.toLocaleString() + "</text>"
  ).join("");
  const labels = '<text x="' + P.l + '" y="' + (H - 6) + '">' + esc(fmtDate(pts[0].date)) + '</text><text x="' + (W - P.r) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(fmtDate(pts[pts.length - 1].date)) + "</text>";
  const marks = pts.map((p, i) => {
    const cx = x(p.date, i).toFixed(1), cy = y(vals[i]).toFixed(1);
    return p.pr
      ? '<text class="pr-star" x="' + cx + '" y="' + (+cy + 5) + '" text-anchor="middle"' + (p.faded ? ' opacity=".4"' : "") + ">★</text>"
      : '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#bbb"' + (p.faded ? ' opacity=".35"' : "") + "></circle>";
  }).join("");
  // Tap/drag on the chart selects the nearest workout; its exact numbers show in the readout.
  chartPoints = pts.map((p, i) => ({ x: x(p.date, i), y: y(vals[i]), label: fmtMetric(p.v, metric), html: pointReadout(p, metric) }));
  chartBox = { W, left: P.l, right: W - P.r, top: P.t, bottom: H - P.b };
  const last = chartPoints[chartPoints.length - 1];
  const tag = tagPos(last);
  return '<div class="readout" id="readout">' + last.html + "</div>" +
    '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(METRICS[metric].label) + ' progress chart. Tap to see values.">' + grid + labels +
    '<path d="' + path(vals) + '" fill="none" stroke="#555" stroke-width="1.5"/>' +
    '<path d="' + path(trend) + '" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' + marks +
    '<g id="cursor"><line x1="' + last.x + '" x2="' + last.x + '" y1="' + P.t + '" y2="' + (H - P.b) + '" stroke="#ffd76a" stroke-dasharray="3 3"/>' +
    '<circle cx="' + last.x + '" cy="' + last.y + '" r="6" fill="none" stroke="#ffd76a" stroke-width="2"/>' +
    '<rect x="' + tag.rx + '" y="' + tag.ry + '" width="' + tag.w + '" height="20" rx="6" fill="#ffd76a"/>' +
    '<text class="tag" x="' + tag.tx + '" y="' + tag.ty + '" text-anchor="middle">' + esc(last.label) + "</text></g></svg>";
}
/** Value label next to the cursor: above the point, or below it near the top edge; kept inside the plot. */
function tagPos(p) {
  const w = Math.round(p.label.length * 6.6 + 14);
  const cx = Math.min(Math.max(p.x, chartBox.left + w / 2), chartBox.right - w / 2);
  const above = p.y - 32 >= chartBox.top - 10;
  const ry = above ? p.y - 32 : p.y + 12;
  return { w, rx: (cx - w / 2).toFixed(1), ry: ry.toFixed(1), tx: cx.toFixed(1), ty: (ry + 14).toFixed(1) };
}

let chartPoints = [], chartBox = null;
/** "Oct 2, 2026 · Est. 1RM 87.5 kg · best set 75 kg × 5 · ★ PR" */
function pointReadout(p, metric) {
  const s = findSession(p.id);
  let detail = "";
  if (s && metric === "e1rm") detail = "best set " + fmtSet(bestE1rmSet(s));
  else if (s && metric === "top") detail = s.sets.length + " sets";
  else if (s && metric === "volume") detail = s.sets.length + " sets · " + s.sets.reduce((a, z) => a + z.reps, 0) + " reps";
  else if (s) detail = s.sets.length + " sets";
  return "<b>" + esc(fmtMetric(p.v, metric)) + "</b> <span>" + esc(METRICS[metric].label) + "</span>" +
    (p.pr ? ' <span class="pr">★ PR</span>' : "") +
    '<div class="muted">' + esc(fmtDate(p.date)) + (detail ? " · " + esc(detail) : "") + "</div>";
}
function selectChartPoint(svg, clientX) {
  if (!chartPoints.length || !chartBox) return;
  const rect = svg.getBoundingClientRect();
  const vx = ((clientX - rect.left) / rect.width) * chartBox.W;
  let best = chartPoints[0];
  for (const p of chartPoints) if (Math.abs(p.x - vx) < Math.abs(best.x - vx)) best = p;
  const g = svg.querySelector("#cursor");
  const [line, dot, box, text] = g.children;
  line.setAttribute("x1", best.x); line.setAttribute("x2", best.x);
  dot.setAttribute("cx", best.x); dot.setAttribute("cy", best.y);
  const t = tagPos(best);
  box.setAttribute("x", t.rx); box.setAttribute("y", t.ry); box.setAttribute("width", t.w);
  text.setAttribute("x", t.tx); text.setAttribute("y", t.ty); text.textContent = best.label;
  const ro = document.getElementById("readout");
  if (ro) ro.innerHTML = best.html;
}

function renderLibraryList() {
  const q = libQuery.trim().toLowerCase();
  const xs = data.exercises.filter((e) => (libFilter === "All" || e.group === libFilter) &&
    (!q || e.name.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)));
  const el = document.getElementById("lib");
  if (!el) return;
  el.innerHTML = xs.map((e) => {
    const l = lastFor(e.id);
    return exerciseRow(e, l ? sessionSummary(l) + " · " + fmtDate(l.date) : e.group + (e.builtin ? "" : " · custom"));
  }).join("") || '<div class="empty">No exercise found.</div>';
}

/* ---------- Actions ---------- */
const ACTIONS = {
  home: () => go("today"),
  tab: (t) => { view.tab = t; go(t); },
  // Return to the previous in-app page; fall back to the current tab after a reload or deep link.
  back: () => (navDepth > 0 ? history.back() : go(view.tab || "today")),
  today: () => go("today"),
  settings: () => go("settings"),
  library: () => go("library"),
  open: (id) => go("exercise", { id }),
  log: (id) => go("log", { id }),
  custom: (id) => go("custom", { id: id || null }),
  filter: (g) => { libFilter = g; go("library"); },
  history: () => go("activity"),
  reload: () => location.reload(),
  metric: (m) => { chartMetric = m; render(); },
  range: (r) => { chartRange = r; render(); },
  "sync-on": async () => {
    const token = document.getElementById("gtoken").value.trim();
    if (!token) return alert("Paste a GitHub token first.");
    sync = { token };
    writeSyncConfig();
    render();
    await runSync();
    if (sync.error && !sync.lastSync) {
      alert("Couldn't connect: " + sync.error);
      sync = {};
      writeSyncConfig();
    }
    render();
  },
  "sync-now": () => runSync(),
  "sync-off": () => {
    if (!confirm("Stop syncing on this device? Your data stays here and in the gist.")) return;
    clearTimeout(syncTimer);
    sync = {};
    writeSyncConfig();
    render();
  },
  unit: (u) => { Object.assign(data.settings, { unit: u, updatedAt: Date.now() }); save(); render(); },

  "edit-session": (sid) => {
    const s = findSession(sid);
    if (s) go("log", { id: s.exerciseId, sessionId: sid });
  },
  "delete-session": (sid) => {
    const s = findSession(sid);
    if (!s || !confirm("Delete the workout from " + fmtDate(s.date) + "?")) return;
    tombstone("sessions", [sid]);
    save();
    render();
  },
  "add-set": () => {
    const n = document.querySelectorAll("#sets .set").length;
    const lastRow = document.querySelector("#sets .set:last-child");
    const wt = lastRow && lastRow.querySelector(".wt");
    const prev = lastRow ? { weight: wt.value, kg: wt.value === wt.dataset.shown ? wt.dataset.kg : undefined, reps: lastRow.querySelector(".rp").value } : { weight: "", reps: "" };
    document.getElementById("sets").insertAdjacentHTML("beforeend", setRow(prev, n));
  },
  "hero-toggle": (_, el) => el.classList.toggle("paused"),
  "remove-set": (_, el) => { el.closest(".set").remove(); renumberSets(); },
  "save-session": (id, el) => {
    const rows = [...document.querySelectorAll("#sets .set")];
    const bad = (v) => v.trim() !== "" && !(Number(v) >= 0 && Number.isFinite(Number(v)));
    if (rows.some((r) => bad(r.querySelector(".wt").value) || bad(r.querySelector(".rp").value))) {
      return alert("Weights and reps must be numbers of 0 or more.");
    }
    const sets = rows.map((r) => {
      const wt = r.querySelector(".wt");
      const weight = wt.dataset.kg !== undefined && wt.value === wt.dataset.shown ? num(wt.dataset.kg) : fromUnit(num(wt.value));
      return { weight, reps: Math.round(num(r.querySelector(".rp").value)) };
    }).filter((z) => z.reps > 0);
    if (!sets.length) return alert("Enter at least one set with reps.");
    const date = document.getElementById("wdate").value;
    if (!isDate(date)) return alert("Pick a valid date.");
    if (date > localDate()) return alert("The date can't be in the future.");
    const note = document.getElementById("wnote").value.trim();
    const sid = el.dataset.session;
    if (sid) {
      const s = findSession(sid);
      if (s) Object.assign(s, { date, sets, note, updatedAt: Date.now() });
    } else {
      data.sessions.push({ id: uid("s"), exerciseId: id, date, createdAt: Date.now(), updatedAt: Date.now(), sets, note });
    }
    save();
    go("exercise", { id }, { replace: true });
  },

  "save-custom": (id) => {
    const name = document.getElementById("ename").value.trim();
    if (!name) return alert("Enter a name.");
    const clash = data.exercises.find((e) => e.name.toLowerCase() === name.toLowerCase() && e.id !== id);
    if (clash) return alert('"' + clash.name + '" already exists.');
    const group = canonGroup(document.getElementById("egroup").value, [...new Set(data.exercises.map((x) => x.group))]);
    const type = document.getElementById("etype").value;
    let e = id && findExercise(id);
    if (e) Object.assign(e, { name, group, type, icon: iconFor(group), updatedAt: Date.now() });
    else {
      e = { id: uid("c"), name, group, type, icon: iconFor(group), builtin: false, updatedAt: Date.now() };
      data.exercises.push(e);
    }
    save();
    go("exercise", { id: e.id }, { replace: true });
  },
  "delete-custom": (id) => {
    const e = findExercise(id);
    if (!e || e.builtin) return;
    const n = sessionsFor(id).length;
    if (!confirm('Delete "' + e.name + '"' + (n ? " and its " + n + " workout" + (n > 1 ? "s" : "") : "") + "?")) return;
    tombstone("sessions", sessionsFor(id).map((s) => s.id));
    tombstone("exercises", [id]);
    save();
    go("library");
  },

  export: () => {
    let text = JSON.stringify(data, null, 2), name = "strength-log-backup-";
    if (storageBroken && brokenRaw != null) {
      if (!confirm("Your saved data couldn't be loaded normally. Export the original stored data, unchanged?\n\nOK = original data (recommended)\nCancel = what is shown on screen")) {
        if (!confirm("The on-screen data may be incomplete. Export it anyway?")) return;
      } else {
        text = brokenRaw;
        name = "strength-log-original-";
      }
    }
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + localDate() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  import: () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const x = JSON.parse(r.result);
          if (!x || typeof x !== "object" || !Array.isArray(x.exercises) || !Array.isArray(x.sessions)) throw new Error();
          pendingImport = migrate(x);
          go("import");
        } catch (_) {
          alert("That file is not a valid Strength Log backup.");
        }
      };
      r.readAsText(file);
    };
    input.click();
  },
  "import-merge": () => {
    if (!pendingImport || !confirmAutoBackup()) return;
    const ids = new Set(data.exercises.map((e) => e.id));
    const names = new Map(data.exercises.map((e) => [e.name.toLowerCase(), e.id]));
    const remap = new Map();
    for (const e of pendingImport.exercises) {
      const same = names.get(e.name.toLowerCase());
      if (same) { if (same !== e.id) remap.set(e.id, same); continue; }
      // Same id but a different name on this device: give the import a fresh id.
      const id = ids.has(e.id) ? uid("c" + slug(e.name) + "-") : e.id;
      if (id !== e.id) remap.set(e.id, id);
      data.exercises.push({ ...e, id, updatedAt: Date.now() });
      delete data.deleted.exercises[id];
      ids.add(id);
      names.set(e.name.toLowerCase(), id);
    }
    const sids = new Set(data.sessions.map((s) => s.id));
    for (const s of pendingImport.sessions) {
      if (sids.has(s.id)) continue;
      data.sessions.push({ ...s, exerciseId: remap.get(s.exerciseId) || s.exerciseId, updatedAt: Date.now() });
      delete data.deleted.sessions[s.id];
    }
    finishImport();
  },
  "import-replace": () => {
    if (!pendingImport || !confirm("Replace all workouts on this device with the backup?") || !confirmAutoBackup()) return;
    // Record deletions for everything not in the backup so sync doesn't bring it back.
    const keep = pendingImport;
    tombstone("sessions", data.sessions.filter((s) => !keep.sessions.some((k) => k.id === s.id)).map((s) => s.id));
    tombstone("exercises", data.exercises.filter((e) => !e.builtin && !keep.exercises.some((k) => k.id === e.id)).map((e) => e.id));
    const now = Date.now();
    for (const x of [...keep.sessions, ...keep.exercises]) if (!x.builtin) x.updatedAt = now;
    for (const k of ["sessions", "exercises"]) {
      keep.deleted[k] = { ...keep.deleted[k], ...data.deleted[k] };
      for (const x of keep[k]) delete keep.deleted[k][x.id];
    }
    data = keep;
    finishImport();
  },
  reset: () => {
    if (!confirm("Delete ALL workouts and custom exercises from this device?")) return;
    if (!confirm("Are you sure? Export a backup first if unsure.")) return;
    if (!confirmAutoBackup()) return;
    tombstone("sessions", data.sessions.map((s) => s.id));
    tombstone("exercises", data.exercises.filter((e) => !e.builtin).map((e) => e.id));
    data = migrate({ deleted: data.deleted, settings: data.settings });
    save();
    go("home");
  },
  "unlock-storage": () => {
    if (!confirm("Start with empty data? The unreadable copy stays in browser storage.")) return;
    storageBroken = false;
    brokenRaw = null;
    save();
    render();
  },
};

/** Removes items and records when they were deleted, so other devices delete them too on sync. */
function tombstone(kind, ids) {
  const set = new Set(ids);
  if (!set.size) return;
  const now = Date.now();
  for (const id of set) data.deleted[kind][id] = now;
  data[kind] = data[kind].filter((x) => !set.has(x.id));
}

/**
 * Combines two copies of the data (e.g. this device and the cloud) without losing edits:
 * for each item the most recently updated version wins, and deletions win over older versions.
 * Pure and deterministic, so every device converges to the same result.
 */
function mergeData(a, b) {
  const deleted = { sessions: {}, exercises: {} };
  for (const k of ["sessions", "exercises"]) {
    for (const src of [a.deleted[k], b.deleted[k]]) {
      for (const [id, t] of Object.entries(src)) deleted[k][id] = Math.max(deleted[k][id] || 0, t);
    }
  }
  const newest = (list, kind) => {
    const m = new Map();
    for (const x of list) {
      const cur = m.get(x.id);
      if (!cur || (x.updatedAt || 0) > (cur.updatedAt || 0)) m.set(x.id, x);
    }
    return [...m.values()].filter((x) => !(deleted[kind][x.id] >= (x.updatedAt || 0)));
  };
  const allEx = [...a.exercises, ...b.exercises].filter((e) => !e.builtin);
  // Same name created separately on two devices: keep the lowest id, move workouts to it.
  const remap = new Map();
  const byName = new Map([...BUILTIN_BY_NAME].map(([k, x]) => [k, x.id]));
  const customs = [];
  for (const e of newest(allEx, "exercises").sort((x, y) => (x.id < y.id ? -1 : 1))) {
    const k = e.name.toLowerCase();
    if (byName.has(k)) { remap.set(e.id, byName.get(k)); continue; }
    byName.set(k, e.id);
    customs.push(e);
  }
  const exIds = new Set([...BUILTINS.map((x) => x.id), ...customs.map((e) => e.id)]);
  const sessions = newest([...a.sessions, ...b.sessions], "sessions")
    .map((s) => (remap.has(s.exerciseId) ? { ...s, exerciseId: remap.get(s.exerciseId) } : s))
    .filter((s) => exIds.has(s.exerciseId))
    .sort((x, y) => (x.id < y.id ? -1 : 1));
  return {
    schemaVersion: SCHEMA,
    settings: { ...((b.settings.updatedAt || 0) > (a.settings.updatedAt || 0) ? b.settings : a.settings) },
    deleted,
    exercises: [...BUILTINS.map((x) => ({ ...x })), ...customs.map((e) => ({ ...e }))],
    sessions: sessions.map((s) => ({ ...s, sets: s.sets.map((z) => ({ ...z })) })),
  };
}

/** Keeps the last AUTOBACKUP_KEEP snapshots taken before import/reset. Returns false if it couldn't be written. */
function autoBackup() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(AUTOBACKUP_PREFIX)).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - AUTOBACKUP_KEEP + 1))) localStorage.removeItem(k);
  try {
    localStorage.setItem(AUTOBACKUP_PREFIX + Date.now(), JSON.stringify({ at: Date.now(), data }));
    return true;
  } catch (_) {
    return false;
  }
}
function confirmAutoBackup() {
  return autoBackup() || confirm("Couldn't save a safety copy (browser storage is full). Export a backup first. Continue anyway?");
}
function finishImport() {
  pendingImport = null;
  storageBroken = false;
  brokenRaw = null;
  save();
  go("home");
}

app.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el || !app.contains(el)) return;
  const fn = ACTIONS[el.dataset.action];
  if (!fn) return;
  ev.preventDefault();
  fn(el.dataset.id || "", el);
});
for (const type of ["pointerdown", "pointermove"]) {
  app.addEventListener(type, (ev) => {
    const svg = ev.target.closest && ev.target.closest("svg.chart:not(.bars)");
    if (svg) selectChartPoint(svg, ev.clientX);
  });
}
app.addEventListener("input", (ev) => {
  if (ev.target.id === "q") { libQuery = ev.target.value; renderLibraryList(); }
});

// Another tab saved: reload from storage so this tab never overwrites newer data.
window.addEventListener("storage", (ev) => {
  if (ev.key !== KEY || ev.newValue == null || storageBroken) return;
  data = load();
  latestCache = null;
  // Don't wipe a form the user is filling in; the next save uses the fresh data.
  if (view.name !== "log" && view.name !== "custom") render();
});

document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") scheduleSync(0); });
window.addEventListener("online", () => scheduleSync(0));

/* ---------- Boot ---------- */
data = load();
save();
view = viewFromHash(location.hash);
view.tab = TAB_NAMES.has(view.name) ? view.name : view.name === "exercise" || view.name === "custom" ? "library" : "today";
history.replaceState(null, "", viewHash(view));
render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) return; // first install, nothing changed
    updateReady = true;
    if (view.name !== "log" && view.name !== "custom") render();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
