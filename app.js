"use strict";

/* ---------- Catalog ----------
 * Each entry: "Name|type" where type is
 * b=barbell, d=dumbbell, c=cable, m=machine, w=bodyweight, o=other
 * Built-in ids are derived from the name, so reordering is safe.
 */
const CATALOG = {
  Chest: ["Barbell Bench Press|b", "Incline Barbell Bench Press|b", "Decline Barbell Bench Press|b", "Dumbbell Bench Press|d", "Incline Dumbbell Press|d", "Dumbbell Fly|d", "Cable Crossover|c", "Machine Chest Press|m", "Pec Deck|m", "Push Up|w", "Chest Dip|w"],
  Back: ["Conventional Deadlift|b", "Sumo Deadlift|b", "Lat Pulldown|c", "Close Grip Lat Pulldown|c", "Pull Up|w", "Chin Up|w", "Assisted Pull Up|m", "Barbell Row|b", "T-Bar Row|b", "Dumbbell Row|d", "Seated Cable Row|c", "Machine Row|m", "Straight Arm Pulldown|c", "Dumbbell Pullover|d"],
  Quads: ["Barbell Back Squat|b", "Front Squat|b", "Hack Squat|m", "Leg Press|m", "Leg Extension|m", "Bulgarian Split Squat|d", "Walking Lunge|d", "Dumbbell Lunge|d", "Goblet Squat|d", "Smith Machine Squat|m"],
  Hamstrings: ["Romanian Deadlift|b", "Stiff Leg Deadlift|b", "Good Morning|b", "Glute Ham Raise|w", "Lying Leg Curl|m", "Seated Leg Curl|m"],
  Glutes: ["Barbell Hip Thrust|b", "Machine Hip Thrust|m", "Glute Bridge|b", "Cable Kickback|c", "Cable Pull Through|c", "Step Up|d", "45 Degree Hip Extension|w"],
  Shoulders: ["Overhead Press|b", "Push Press|b", "Seated Dumbbell Shoulder Press|d", "Arnold Press|d", "Dumbbell Lateral Raise|d", "Cable Lateral Raise|c", "Front Raise|d", "Rear Delt Fly|d", "Reverse Pec Deck|m", "Face Pull|c", "Upright Row|b"],
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
// Representative exercise whose photo is used for custom exercises in each group.
const GROUP_IMAGE = { Chest: "Barbell Bench Press", Back: "Barbell Row", Quads: "Barbell Back Squat", Hamstrings: "Romanian Deadlift", Glutes: "Barbell Hip Thrust", Shoulders: "Overhead Press", Biceps: "Barbell Curl", Triceps: "Triceps Pushdown", Calves: "Standing Calf Raise", Core: "Plank", Forearms: "Wrist Curl", "Full Body": "Power Clean" };
const IMG = typeof IMAGES === "object" ? IMAGES : {};
function imageKey(e) {
  if (IMG[e.name]) return IMG[e.name];
  if (e.builtin) return null;
  const g = Object.keys(GROUP_IMAGE).find((k) => k.toLowerCase() === String(e.group).toLowerCase());
  return g ? IMG[GROUP_IMAGE[g]] || null : null;
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

/** Reuse an existing group's spelling when only the case differs ("chest" -> "Chest"). */
function canonGroup(g, existing) {
  const v = String(g || "").trim() || "Other";
  return existing.find((x) => x.toLowerCase() === v.toLowerCase()) || v;
}

/* ---------- Storage ---------- */
const KEY = "strength-log-v3";
const LEGACY_KEYS = ["strength-log-v2"];
const SCHEMA = 4;
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
    });
    seenCustomNames.set(key, id);
    idMap.set(oldId, id);
  }
  for (const b of BUILTINS) idMap.set(b.id, b.id);

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
      sets,
      note: typeof s.note === "string" ? s.note : "",
    });
  }

  const settings = src.settings && typeof src.settings === "object" ? src.settings : {};
  return {
    schemaVersion: SCHEMA,
    settings: { unit: settings.unit === "lb" ? "lb" : "kg" },
    exercises: [...BUILTINS.map((b) => ({ ...b })), ...customs],
    sessions,
  };
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
const e1rm = (z) => (z.reps <= 1 ? z.weight : z.weight * (1 + z.reps / 30));
const bestSet = (sets) => sets.reduce((b, z) => (!b || z.weight > b.weight || (z.weight === b.weight && z.reps > b.reps) ? z : b), null);
const sessionE1rm = (s) => Math.max(0, ...s.sets.map(e1rm));
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

/** Session ids that set a new best estimated 1RM vs all earlier sessions of that exercise. */
function prSessionIds(sessions) {
  const ids = new Set();
  let best = -1;
  sessions.slice().sort(byOldest).forEach((s, i) => {
    const v = sessionE1rm(s);
    if (i > 0 && v > best) ids.add(s.id);
    best = Math.max(best, v);
  });
  return ids;
}

/* ---------- Rendering ---------- */
const app = document.getElementById("app");
let view = { name: "home" };
let libFilter = "All";
let libQuery = "";

function go(name, params = {}) {
  view = { name, ...params };
  render();
  window.scrollTo(0, 0);
}

function render() {
  const fn = VIEWS[view.name] || VIEWS.home;
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
  app.innerHTML = banner + fn(view);
  if (view.name === "library") renderLibraryList();
}

function exerciseRow(e, sub) {
  return '<button class="exercise" data-action="open" data-id="' + esc(e.id) + '">' + thumbHTML(e) +
    '<div class="info"><b>' + esc(e.name) + "</b><small>" + esc(sub) + "</small></div><span>›</span></button>";
}

const VIEWS = {
  home() {
    const used = new Set(data.sessions.map((s) => s.exerciseId));
    const exercises = data.exercises.filter((e) => used.has(e.id));
    let html = '<div class="top"><div><h1>Strength Log</h1><div class="muted">Log. Compare. Get stronger.</div></div><button class="btn" data-action="library">+ Exercise</button></div>';

    if (!exercises.length) {
      html += '<div class="card empty">No exercises logged yet.<br><br><button class="btn primary" data-action="library">Choose an exercise</button></div>';
    } else {
      const recent = data.sessions.slice().sort(byNewest);
      const recentIds = [...new Set(recent.map((s) => s.exerciseId))].slice(0, 5);
      html += '<div class="section"><h3>Recent</h3>';
      for (const id of recentIds) {
        const e = findExercise(id); if (!e) continue;
        const s = lastFor(id);
        html += exerciseRow(e, fmtDate(s.date) + " · " + sessionSummary(s));
      }
      html += "</div>";

      const groups = new Map();
      for (const e of exercises) {
        if (!groups.has(e.group)) groups.set(e.group, []);
        groups.get(e.group).push(e);
      }
      for (const [g, list] of groups) {
        html += '<div class="section"><h3>' + esc(g) + "</h3>";
        for (const e of list) html += exerciseRow(e, sessionSummary(lastFor(e.id)));
        html += "</div>";
      }
    }

    html += '<div class="section"><div class="card"><b>Settings</b>' +
      '<label>Units</label><div class="seg">' + ["kg", "lb"].map((u) => '<button data-action="unit" data-id="' + u + '" class="' + (unit() === u ? "active" : "") + '">' + u + "</button>").join("") + "</div>" +
      '<label>Data</label><div class="muted" style="margin-bottom:10px">Your workouts stay on this device. Export a backup regularly.</div>' +
      '<div class="row"><button class="btn" data-action="export">Export backup</button><button class="btn" data-action="import">Import backup</button><button class="btn danger" data-action="reset">Reset app</button></div>' +
      "</div></div>";
    return html;
  },

  library() {
    const groups = Object.keys(CATALOG);
    const customGroups = [...new Set(data.exercises.filter((e) => !e.builtin).map((e) => e.group))].filter((g) => !groups.includes(g));
    const all = ["All", ...groups, ...customGroups];
    if (!all.includes(libFilter)) libFilter = "All";
    const chips = all.map((g) => '<button class="chip' + (g === libFilter ? " active" : "") + '" data-action="filter" data-id="' + esc(g) + '">' + esc(g) + "</button>").join("");
    return backBtn("home", "Back") +
      '<div class="top"><div><h2>Exercise library</h2><div class="muted">' + data.exercises.length + " exercises · " + (all.length - 1) + ' muscle groups</div></div><button class="btn" data-action="custom">+ Custom</button></div>' +
      '<div class="search"><input id="q" type="search" placeholder="Search exercises..." value="' + esc(libQuery) + '"></div>' +
      '<div class="chips">' + chips + '</div><div id="lib"></div>';
  },

  custom({ id }) {
    const e = id ? findExercise(id) : null;
    if (id && (!e || e.builtin)) return notFound();
    const opts = Object.entries(TYPES).map(([k, v]) => '<option value="' + k + '"' + (e && e.type === k ? " selected" : "") + ">" + esc(v.label) + "</option>").join("");
    const groupOpts = [...new Set(data.exercises.map((x) => x.group))].map((g) => '<option value="' + esc(g) + '">').join("");
    return (e ? backBtn("open", e.name, e.id) : backBtn("library", "Library")) +
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
    const prs = prSessionIds(sessions);
    let top = 0, best1rm = 0, volume = 0;
    for (const s of sessions) for (const z of s.sets) {
      top = Math.max(top, z.weight);
      best1rm = Math.max(best1rm, e1rm(z));
      volume += z.weight * z.reps;
    }

    const history = sessions.length ? sessions.map((s) =>
      '<div class="session"><div class="session-head"><b>' + esc(fmtDate(s.date)) + (prs.has(s.id) ? '<span class="pr">PR</span>' : "") + "</b>" +
      '<div class="row"><button class="btn small" data-action="edit-session" data-id="' + esc(s.id) + '">Edit</button>' +
      '<button class="btn small danger" data-action="delete-session" data-id="' + esc(s.id) + '">Delete</button></div></div>' +
      '<table class="history"><tr><th>Set</th><th>Weight</th><th>Reps</th></tr>' +
      s.sets.map((z, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(fmtW(z.weight)) + "</td><td>" + esc(z.reps) + "</td></tr>").join("") +
      "</table>" + (s.note ? '<div class="session-note">' + esc(s.note) + "</div>" : "") + "</div>"
    ).join("") : '<div class="empty">No workouts logged yet.</div>';

    return backBtn("home", "Exercises") +
      '<div class="top"><div><h2>' + esc(e.name) + '</h2><div class="muted">' + esc(e.group) + " · " + esc(e.type) +
      (e.builtin ? "" : ' · <a href="#" data-action="custom" data-id="' + esc(e.id) + '" style="color:#aaa">edit</a>') +
      '</div></div><button class="btn primary" data-action="log" data-id="' + esc(id) + '">+ Log</button></div>' +
      heroHTML(e) +
      '<div class="note">' + esc((TYPES[e.type] || TYPES.other).hint) + "</div>" +
      '<div class="stats">' +
      stat(top ? fmtW(top) : "—", "Best weight") +
      stat(best1rm ? fmtW(round1(best1rm)) : "—", "Est. 1RM") +
      stat(volume ? Math.round(toUnit(volume)).toLocaleString() + " " + unit() : "—", "Total volume") +
      stat(sessions.length, "Workouts") + "</div>" +
      '<div class="card"><b>Progress</b><div class="muted">' +
      (sessions.length > 1
        ? (best1rm ? "Best est. 1RM per workout" : "Best reps per workout") + "</div>" + chart(sessions)
        : (sessions.length ? "Log one more workout" : "Log at least two workouts") + " to see your progress chart.</div>") +
      "</div>" +
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
    return backBtn("open", e.name, id) +
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
    return backBtn("home", "Cancel") + "<h2>Import backup</h2>" +
      '<div class="card">Backup contains <b>' + p.sessions.length + "</b> workouts and <b>" + p.exercises.filter((e) => !e.builtin).length + "</b> custom exercises.<br>" +
      'This device has <b>' + data.sessions.length + "</b> workouts.</div>" +
      '<div class="note">Merge keeps everything here and adds what is new from the backup. Replace discards current data. A copy of current data is saved in this browser either way.</div>' +
      '<div class="row" style="margin-top:15px"><button class="btn primary" data-action="import-merge">Merge</button><button class="btn danger" data-action="import-replace">Replace</button></div>';
  },
};

function backBtn(action, label, id = "") {
  return '<button class="btn back" data-action="' + action + '" data-id="' + esc(id) + '">← ' + esc(label) + "</button>";
}
function stat(v, label) { return '<div class="stat"><b>' + esc(v) + "</b><span>" + esc(label) + "</span></div>"; }
function notFound() { return backBtn("home", "Home") + '<div class="card empty">Not found.</div>'; }

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

function chart(sessions) {
  // One metric for the whole chart: est. 1RM if any session is weighted, otherwise reps.
  const weighted = sessions.some((s) => sessionE1rm(s) > 0);
  const pts = sessions.slice().sort(byOldest)
    .filter((s) => !weighted || sessionE1rm(s) > 0)
    .map((s) => ({ date: s.date, v: weighted ? sessionE1rm(s) : Math.max(...s.sets.map((z) => z.reps)), isWeight: weighted }));
  const W = 600, H = 220, P = { l: 40, r: 12, t: 14, b: 26 };
  const vals = pts.map((p) => (p.isWeight ? toUnit(p.v) : p.v));
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (hi === lo) { hi += 1; lo = Math.max(0, lo - 1); }
  const pad = (hi - lo) * 0.1; lo = Math.max(0, lo - pad); hi += pad;
  const t0 = Date.parse(pts[0].date), t1 = Date.parse(pts[pts.length - 1].date);
  const x = (d, i) => P.l + (W - P.l - P.r) * (t1 > t0 ? (Date.parse(d) - t0) / (t1 - t0) : i / Math.max(1, pts.length - 1));
  const y = (v) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  const xy = pts.map((p, i) => [x(p.date, i), y(vals[i])]);
  const path = xy.map(([a, b], i) => (i ? "L" : "M") + a.toFixed(1) + " " + b.toFixed(1)).join(" ");
  const grid = [lo, (lo + hi) / 2, hi].map((v) =>
    '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#262626"/><text x="' + (P.l - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + round1(v) + "</text>"
  ).join("");
  const labels = '<text x="' + P.l + '" y="' + (H - 8) + '">' + esc(fmtDate(pts[0].date)) + '</text><text x="' + (W - P.r) + '" y="' + (H - 8) + '" text-anchor="end">' + esc(fmtDate(pts[pts.length - 1].date)) + "</text>";
  const dots = xy.map(([a, b]) => '<circle cx="' + a + '" cy="' + b + '" r="3" fill="#fff"/>').join("");
  return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Progress chart">' + grid + labels +
    '<path d="' + path + '" fill="none" stroke="#fff" stroke-width="2"/>' + dots + "</svg>";
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
  home: () => go("home"),
  library: () => go("library"),
  open: (id) => go("exercise", { id }),
  log: (id) => go("log", { id }),
  custom: (id) => go("custom", { id: id || null }),
  filter: (g) => { libFilter = g; go("library"); },
  reload: () => location.reload(),
  unit: (u) => { data.settings.unit = u; save(); render(); },

  "edit-session": (sid) => {
    const s = findSession(sid);
    if (s) go("log", { id: s.exerciseId, sessionId: sid });
  },
  "delete-session": (sid) => {
    const s = findSession(sid);
    if (!s || !confirm("Delete the workout from " + fmtDate(s.date) + "?")) return;
    data.sessions = data.sessions.filter((x) => x.id !== sid);
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
      if (s) Object.assign(s, { date, sets, note });
    } else {
      data.sessions.push({ id: uid("s"), exerciseId: id, date, createdAt: Date.now(), sets, note });
    }
    save();
    go("exercise", { id });
  },

  "save-custom": (id) => {
    const name = document.getElementById("ename").value.trim();
    if (!name) return alert("Enter a name.");
    const clash = data.exercises.find((e) => e.name.toLowerCase() === name.toLowerCase() && e.id !== id);
    if (clash) return alert('"' + clash.name + '" already exists.');
    const group = canonGroup(document.getElementById("egroup").value, [...new Set(data.exercises.map((x) => x.group))]);
    const type = document.getElementById("etype").value;
    let e = id && findExercise(id);
    if (e) Object.assign(e, { name, group, type, icon: iconFor(group) });
    else {
      e = { id: uid("c"), name, group, type, icon: iconFor(group), builtin: false };
      data.exercises.push(e);
    }
    save();
    go("exercise", { id: e.id });
  },
  "delete-custom": (id) => {
    const e = findExercise(id);
    if (!e || e.builtin) return;
    const n = sessionsFor(id).length;
    if (!confirm('Delete "' + e.name + '"' + (n ? " and its " + n + " workout" + (n > 1 ? "s" : "") : "") + "?")) return;
    data.exercises = data.exercises.filter((x) => x.id !== id);
    data.sessions = data.sessions.filter((s) => s.exerciseId !== id);
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
      data.exercises.push({ ...e, id });
      ids.add(id);
      names.set(e.name.toLowerCase(), id);
    }
    const sids = new Set(data.sessions.map((s) => s.id));
    for (const s of pendingImport.sessions) {
      if (sids.has(s.id)) continue;
      data.sessions.push({ ...s, exerciseId: remap.get(s.exerciseId) || s.exerciseId });
    }
    finishImport();
  },
  "import-replace": () => {
    if (!pendingImport || !confirm("Replace all workouts on this device with the backup?") || !confirmAutoBackup()) return;
    data = pendingImport;
    finishImport();
  },
  reset: () => {
    if (!confirm("Delete ALL workouts and custom exercises from this device?")) return;
    if (!confirm("Are you sure? Export a backup first if unsure.")) return;
    if (!confirmAutoBackup()) return;
    data = migrate({});
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

/* ---------- Boot ---------- */
data = load();
save();
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
