"use strict";

/* ---------- Catalog ----------
 * Each entry: "Name|type" where type is
 * b=barbell, d=dumbbell, c=cable, m=machine, w=bodyweight, o=other
 * Built-in ids are derived from the name, so reordering is safe.
 */
const CATALOG = {
  Chest: ["Barbell Bench Press|b", "Incline Barbell Bench Press|b", "Decline Barbell Bench Press|b", "Paused Bench Press|b", "Dumbbell Bench Press|d", "Incline Dumbbell Press|d", "Decline Dumbbell Press|d", "Dumbbell Fly|d", "Incline Dumbbell Fly|d", "Cable Fly|c", "Low Cable Fly|c", "High Cable Fly|c", "Cable Crossover|c", "Machine Chest Press|m", "Incline Machine Press|m", "Pec Deck|m", "Push Up|w", "Incline Push Up|w", "Decline Push Up|w", "Chest Dip|w"],
  Back: ["Conventional Deadlift|b", "Sumo Deadlift|b", "Rack Pull|b", "Deficit Deadlift|b", "Lat Pulldown|c", "Wide Grip Lat Pulldown|c", "Close Grip Lat Pulldown|c", "Neutral Grip Pulldown|c", "Pull Up|w", "Chin Up|w", "Assisted Pull Up|m", "Barbell Row|b", "Pendlay Row|b", "T-Bar Row|b", "Dumbbell Row|d", "One Arm Cable Row|c", "Seated Cable Row|c", "Close Grip Cable Row|c", "Chest Supported Row|d", "Machine Row|m", "Meadows Row|b", "Straight Arm Pulldown|c", "Dumbbell Pullover|d", "Barbell Pullover|b"],
  Quads: ["Barbell Back Squat|b", "High Bar Squat|b", "Low Bar Squat|b", "Front Squat|b", "Pause Squat|b", "Box Squat|b", "Hack Squat|m", "Leg Press|m", "Single Leg Press|m", "Leg Extension|m", "Bulgarian Split Squat|d", "Walking Lunge|d", "Reverse Lunge|d", "Forward Lunge|d", "Dumbbell Lunge|d", "Barbell Lunge|b", "Goblet Squat|d", "Heels Elevated Squat|b", "Smith Machine Squat|m", "Sissy Squat|w"],
  Hamstrings: ["Romanian Deadlift|b", "Stiff Leg Deadlift|b", "Single Leg Romanian Deadlift|d", "Good Morning|b", "Nordic Curl|w", "Glute Ham Raise|w", "Lying Leg Curl|m", "Seated Leg Curl|m", "Standing Leg Curl|m", "Single Leg Curl|m", "Cable Leg Curl|c", "Slider Leg Curl|w", "Stability Ball Leg Curl|w"],
  Glutes: ["Barbell Hip Thrust|b", "Dumbbell Hip Thrust|d", "Smith Machine Hip Thrust|m", "Glute Bridge|b", "Single Leg Glute Bridge|w", "Cable Kickback|c", "Machine Glute Kickback|m", "45 Degree Hip Extension|w", "Cable Pull Through|c", "Step Up|d", "High Step Up|d", "Reverse Hyperextension|m"],
  Shoulders: ["Overhead Press|b", "Push Press|b", "Seated Barbell Press|b", "Seated Dumbbell Shoulder Press|d", "Arnold Press|d", "Dumbbell Lateral Raise|d", "Cable Lateral Raise|c", "Machine Lateral Raise|m", "Lean Away Lateral Raise|d", "Front Raise|d", "Cable Front Raise|c", "Plate Front Raise|o", "Rear Delt Fly|d", "Reverse Pec Deck|m", "Bent Over Rear Delt Raise|d", "Cable Rear Delt Fly|c", "Face Pull|c", "Upright Row|b", "Cable Upright Row|c", "Landmine Press|b"],
  Biceps: ["Barbell Curl|b", "EZ Bar Curl|b", "Dumbbell Curl|d", "Alternating Dumbbell Curl|d", "Incline Dumbbell Curl|d", "Hammer Curl|d", "Cross Body Hammer Curl|d", "Preacher Curl|b", "Dumbbell Preacher Curl|d", "Cable Curl|c", "Rope Cable Curl|c", "Bayesian Cable Curl|c", "Spider Curl|d", "Concentration Curl|d", "Reverse Curl|b", "Zottman Curl|d", "Machine Curl|m"],
  Triceps: ["Close Grip Bench Press|b", "Triceps Pushdown|c", "Rope Pushdown|c", "Straight Bar Pushdown|c", "V Bar Pushdown|c", "Overhead Cable Extension|c", "Single Arm Cable Extension|c", "Dumbbell Overhead Extension|d", "EZ Bar Overhead Extension|b", "Skull Crusher|b", "Dumbbell Skull Crusher|d", "Cable Skull Crusher|c", "Tate Press|d", "JM Press|b", "Bench Dip|w", "Parallel Bar Dip|w", "Assisted Dip|m", "Triceps Kickback|d"],
  Calves: ["Standing Calf Raise|m", "Seated Calf Raise|m", "Leg Press Calf Raise|m", "Donkey Calf Raise|m", "Smith Machine Calf Raise|m", "Single Leg Calf Raise|w", "Bodyweight Calf Raise|w", "Tibialis Raise|w"],
  Core: ["Cable Crunch|c", "Machine Crunch|m", "Weighted Crunch|o", "Hanging Knee Raise|w", "Hanging Leg Raise|w", "Captain's Chair Knee Raise|w", "Reverse Crunch|w", "Ab Wheel Rollout|w", "Plank|w", "Weighted Plank|o", "Side Plank|w", "Dead Bug|w", "Bird Dog|w", "Pallof Press|c", "Cable Wood Chop|c", "Cable Lift|c", "Russian Twist|o", "Bicycle Crunch|w", "V Up|w", "Sit Up|w", "Decline Sit Up|w", "Toe Touch|w", "Dragon Flag|w"],
  Forearms: ["Wrist Curl|b", "Reverse Wrist Curl|b", "Behind Back Wrist Curl|b", "Reverse Barbell Curl|b", "Farmer Carry|d", "Suitcase Carry|d", "Plate Pinch Hold|o", "Dead Hang|w"],
  "Full Body": ["Barbell Clean|b", "Power Clean|b", "Hang Clean|b", "Clean and Press|b", "Push Jerk|b", "Split Jerk|b", "Snatch|b", "Hang Snatch|b", "Dumbbell Clean|d", "Dumbbell Clean and Press|d", "Kettlebell Swing|o", "Turkish Get Up|o", "Thruster|b", "Man Maker|d", "Sled Push|o", "Sled Drag|o"],
};
const TYPE_CODES = { b: "barbell", d: "dumbbell", c: "cable", m: "machine", w: "bodyweight", o: "other" };
const TYPES = {
  barbell: "Barbell · total weight including bar",
  dumbbell: "Dumbbell · one dumbbell",
  machine: "Machine · selected stack weight",
  cable: "Cable · selected stack weight",
  bodyweight: "Bodyweight · added weight only",
  other: "Other",
};
const ICONS = { Chest: "🏋️", Back: "🦾", Quads: "🦵", Hamstrings: "🦵", Glutes: "🍑", Shoulders: "💪", Biceps: "💪", Triceps: "💪", Calves: "🦵", Core: "🎯", Forearms: "🤝", "Full Body": "🏋️" };
const iconFor = (g) => ICONS[g] || "🏋️";
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const builtinId = (name) => "b:" + slug(name);

const BUILTINS = Object.entries(CATALOG).flatMap(([group, list]) =>
  list.map((entry) => {
    const [name, code] = entry.split("|");
    return { id: builtinId(name), name, group, type: TYPE_CODES[code], icon: iconFor(group), builtin: true };
  })
);
const BUILTIN_BY_NAME = new Map(BUILTINS.map((e) => [e.name.toLowerCase(), e]));

/* ---------- Storage ---------- */
const KEY = "strength-log-v3";
const LEGACY_KEYS = ["strength-log-v2"];
const SCHEMA = 4;
const KG_PER_LB = 0.45359237;

let data;
let storageBroken = false;
let pendingImport = null;

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
    if ((parsed.schemaVersion || 0) < SCHEMA || fromLegacy) {
      const bk = "strength-log-premigrate-v" + (parsed.schemaVersion || 3);
      if (localStorage.getItem(bk) == null) localStorage.setItem(bk, raw);
    }
    return migrate(parsed);
  } catch (err) {
    // Never destroy data we couldn't read. Keep a copy and stop saving.
    storageBroken = true;
    try { if (raw != null) localStorage.setItem("strength-log-corrupt-" + Date.now(), raw); } catch (_) {}
    return migrate({});
  }
}

function save() {
  if (storageBroken) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    alert("Could not save: " + err.message);
  }
}

const num = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** Normalises any older/foreign data shape into the current schema. Pure: returns a new object. */
function migrate(input) {
  const src = input && typeof input === "object" ? input : {};
  const oldExercises = Array.isArray(src.exercises) ? src.exercises : [];
  const oldSessions = Array.isArray(src.sessions) ? src.sessions : [];

  const idMap = new Map(); // old id -> new id
  const customs = [];
  const seenCustomNames = new Map();

  for (const e of oldExercises) {
    if (!e || typeof e !== "object" || e.id == null || !e.name) continue;
    const oldId = String(e.id);
    // Old builds could produce duplicate ids; the old app's find() resolved to the first one,
    // so that's what sessions were logged against. Ignore later duplicates.
    if (idMap.has(oldId)) continue;
    const name = String(e.name).trim();
    const b = BUILTIN_BY_NAME.get(name.toLowerCase());
    if (b) { idMap.set(oldId, b.id); continue; }
    const key = name.toLowerCase();
    if (seenCustomNames.has(key)) { idMap.set(oldId, seenCustomNames.get(key)); continue; }
    const id = oldId.startsWith("c") ? oldId : "c" + slug(name) + "-" + Math.random().toString(36).slice(2, 7);
    const group = String(e.group || "Other").trim() || "Other";
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
    if (!id || seenSessionIds.has(id)) id = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
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
const fmtW = (kg) => toUnit(kg) + " " + unit();
const e1rm = (z) => (z.reps <= 1 ? z.weight : z.weight * (1 + z.reps / 30));
const bestSet = (sets) => sets.reduce((b, z) => (!b || z.weight > b.weight || (z.weight === b.weight && z.reps > b.reps) ? z : b), null);
const sessionE1rm = (s) => Math.max(0, ...s.sets.map(e1rm));
const fmtSet = (z) => (z.weight ? fmtW(z.weight) + " × " : "") + z.reps + (z.weight ? "" : " reps");
const byNewest = (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
const byOldest = (a, b) => -byNewest(a, b);

const findExercise = (id) => data.exercises.find((e) => e.id === id);
const sessionsFor = (id) => data.sessions.filter((s) => s.exerciseId === id);
const lastFor = (id) => sessionsFor(id).sort(byNewest)[0];

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
  const banner = storageBroken
    ? '<div class="banner"><b>Saved data could not be read.</b> A copy was kept in this browser (key <code>strength-log-corrupt-*</code>). Changes are <b>not being saved</b>. Import a backup, or <button class="btn small" data-action="unlock-storage">start fresh</button>.</div>'
    : "";
  app.innerHTML = banner + fn(view);
  if (view.name === "library") renderLibraryList();
}

function exerciseRow(e, sub) {
  return '<button class="exercise" data-action="open" data-id="' + esc(e.id) + '"><div class="thumb">' + esc(e.icon) +
    '</div><div class="info"><b>' + esc(e.name) + "</b><small>" + esc(sub) + "</small></div><span>›</span></button>";
}

const VIEWS = {
  home() {
    const used = new Map();
    for (const s of data.sessions) used.set(s.exerciseId, true);
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
        html += exerciseRow(e, fmtDate(s.date) + " · " + fmtSet(bestSet(s.sets)));
      }
      html += "</div>";

      const groups = new Map();
      for (const e of exercises) {
        if (!groups.has(e.group)) groups.set(e.group, []);
        groups.get(e.group).push(e);
      }
      for (const [g, list] of groups) {
        html += '<div class="section"><h3>' + esc(g) + "</h3>";
        for (const e of list) html += exerciseRow(e, fmtSet(bestSet(lastFor(e.id).sets)));
        html += "</div>";
      }
    }

    html += '<div class="section"><div class="card"><b>Settings</b>' +
      '<label>Units</label><div class="seg"><button data-action="unit" data-id="kg" class="' + (unit() === "kg" ? "active" : "") + '">kg</button><button data-action="unit" data-id="lb" class="' + (unit() === "lb" ? "active" : "") + '">lb</button></div>' +
      '<label>Data</label><div class="muted" style="margin-bottom:10px">Your workouts stay on this device. Export a backup regularly.</div>' +
      '<div class="row"><button class="btn" data-action="export">Export backup</button><button class="btn" data-action="import">Import backup</button><button class="btn danger" data-action="reset">Reset app</button></div>' +
      "</div></div>";
    return html;
  },

  library() {
    const groups = Object.keys(CATALOG);
    const customGroups = [...new Set(data.exercises.filter((e) => !e.builtin).map((e) => e.group))].filter((g) => !groups.includes(g));
    const all = ["All", ...groups, ...customGroups];
    const chips = all.map((g) => '<button class="chip' + (g === libFilter ? " active" : "") + '" data-action="filter" data-id="' + esc(g) + '">' + esc(g) + "</button>").join("");
    return '<button class="btn back" data-action="home">← Back</button>' +
      '<div class="top"><div><h2>Exercise library</h2><div class="muted">' + data.exercises.length + " exercises · " + (all.length - 1) + ' muscle groups</div></div><button class="btn" data-action="custom">+ Custom</button></div>' +
      '<div class="search"><input id="q" type="search" placeholder="Search exercises..." value="' + esc(libQuery) + '"></div>' +
      '<div class="chips">' + chips + '</div><div id="lib"></div>';
  },

  custom({ id }) {
    const e = id ? findExercise(id) : null;
    if (id && (!e || e.builtin)) return notFound();
    const opts = Object.entries(TYPES).map(([k, v]) => '<option value="' + k + '"' + (e && e.type === k ? " selected" : "") + ">" + esc(v) + "</option>").join("");
    const groupOpts = [...new Set(data.exercises.map((x) => x.group))].map((g) => '<option value="' + esc(g) + '">').join("");
    return '<button class="btn back" data-action="' + (e ? "open" : "library") + '" data-id="' + esc(e ? e.id : "") + '">← ' + (e ? esc(e.name) : "Library") + "</button>" +
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
    const conv = e.type === "barbell" ? "Record total weight including the bar."
      : e.type === "dumbbell" ? "Record the weight of one dumbbell."
      : e.type === "bodyweight" ? "Record added weight only (0 for bodyweight)."
      : e.type === "other" ? "Record the weight used."
      : "Record the selected machine/cable weight.";

    const history = sessions.length ? sessions.map((s) =>
      '<div class="session"><div class="session-head"><b>' + esc(fmtDate(s.date)) + (prs.has(s.id) ? '<span class="pr">PR</span>' : "") + "</b>" +
      '<div class="row"><button class="btn small" data-action="edit-session" data-id="' + esc(s.id) + '">Edit</button>' +
      '<button class="btn small danger" data-action="delete-session" data-id="' + esc(s.id) + '">Delete</button></div></div>' +
      '<table class="history"><tr><th>Set</th><th>Weight</th><th>Reps</th></tr>' +
      s.sets.map((z, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(fmtW(z.weight)) + "</td><td>" + esc(z.reps) + "</td></tr>").join("") +
      "</table>" + (s.note ? '<div class="session-note">' + esc(s.note) + "</div>" : "") + "</div>"
    ).join("") : '<div class="empty">No workouts logged yet.</div>';

    return '<button class="btn back" data-action="home">← Exercises</button>' +
      '<div class="top"><div><h2>' + esc(e.name) + '</h2><div class="muted">' + esc(e.group) + " · " + esc(e.type) +
      (e.builtin ? "" : ' · <a href="#" data-action="custom" data-id="' + esc(e.id) + '" style="color:#aaa">edit</a>') +
      '</div></div><button class="btn primary" data-action="log" data-id="' + esc(id) + '">+ Log</button></div>' +
      '<div class="note">' + esc(conv) + "</div>" +
      '<div class="stats">' +
      stat(top ? fmtW(top) : "—", "Best weight") +
      stat(best1rm ? fmtW(round1(best1rm)) : "—", "Est. 1RM") +
      stat(volume ? Math.round(toUnit(volume)).toLocaleString() + " " + unit() : "—", "Total volume") +
      stat(sessions.length, "Workouts") + "</div>" +
      (sessions.length > 1 ? '<div class="card"><b>Progress</b><div class="muted">' + (best1rm ? "Best est. 1RM per workout" : "Best reps per workout") + "</div>" + chart(sessions) + "</div>" : "") +
      '<div class="card"><b>History</b>' + history + "</div>";
  },

  log({ id, sessionId }) {
    const e = findExercise(id);
    if (!e) return notFound();
    const editing = sessionId ? data.sessions.find((s) => s.id === sessionId) : null;
    if (sessionId && !editing) return notFound();
    const last = lastFor(id);
    const base = editing ? editing.sets : last ? last.sets : [{ weight: "", reps: "" }];
    const sets = base.map((z) => ({ weight: z.weight === "" ? "" : toUnit(z.weight), reps: z.reps }));
    return '<button class="btn back" data-action="open" data-id="' + esc(id) + '">← ' + esc(e.name) + "</button>" +
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
    return '<button class="btn back" data-action="home">← Cancel</button><h2>Import backup</h2>' +
      '<div class="card">Backup contains <b>' + p.sessions.length + "</b> workouts and <b>" + p.exercises.filter((e) => !e.builtin).length + "</b> custom exercises.<br>" +
      'This device has <b>' + data.sessions.length + "</b> workouts.</div>" +
      '<div class="note">Merge keeps everything here and adds what is new from the backup. Replace discards current data. A copy of current data is saved in this browser either way.</div>' +
      '<div class="row" style="margin-top:15px"><button class="btn primary" data-action="import-merge">Merge</button><button class="btn danger" data-action="import-replace">Replace</button></div>';
  },
};

function stat(v, label) { return '<div class="stat"><b>' + esc(v) + "</b><span>" + esc(label) + "</span></div>"; }
function notFound() { return '<button class="btn back" data-action="home">← Home</button><div class="card empty">Not found.</div>'; }

function setRow(z, i) {
  return '<div class="set"><span>' + (i + 1) + '</span><input class="wt" type="number" inputmode="decimal" step="any" min="0" value="' + esc(z.weight) +
    '" placeholder="' + unit() + '"><input class="rp" type="number" inputmode="numeric" min="0" step="1" value="' + esc(z.reps) +
    '" placeholder="reps"><button class="del" data-action="remove-set" aria-label="Remove set">×</button></div>';
}
function renumberSets() {
  document.querySelectorAll("#sets .set > span").forEach((el, i) => { el.textContent = i + 1; });
}

function chart(sessions) {
  const pts = sessions.slice().sort(byOldest).map((s) => ({
    date: s.date,
    v: sessionE1rm(s) || Math.max(...s.sets.map((z) => z.reps)),
    isWeight: sessionE1rm(s) > 0,
  }));
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
    return exerciseRow(e, l ? fmtSet(bestSet(l.sets)) + " · " + fmtDate(l.date) : e.group + (e.builtin ? "" : " · custom"));
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
  unit: (u) => { data.settings.unit = u; save(); render(); },

  "edit-session": (sid) => {
    const s = data.sessions.find((x) => x.id === sid);
    if (s) go("log", { id: s.exerciseId, sessionId: sid });
  },
  "delete-session": (sid) => {
    const s = data.sessions.find((x) => x.id === sid);
    if (!s || !confirm("Delete the workout from " + fmtDate(s.date) + "?")) return;
    data.sessions = data.sessions.filter((x) => x.id !== sid);
    save();
    render();
  },
  "add-set": () => {
    const n = document.querySelectorAll("#sets .set").length;
    const lastRow = document.querySelector("#sets .set:last-child");
    const prev = lastRow ? { weight: lastRow.querySelector(".wt").value, reps: lastRow.querySelector(".rp").value } : { weight: "", reps: "" };
    document.getElementById("sets").insertAdjacentHTML("beforeend", setRow(prev, n));
  },
  "remove-set": (_, el) => { el.closest(".set").remove(); renumberSets(); },
  "save-session": (id, el) => {
    const sets = [...document.querySelectorAll("#sets .set")]
      .map((r) => ({ weight: fromUnit(num(r.querySelector(".wt").value)), reps: Math.round(num(r.querySelector(".rp").value)) }))
      .filter((z) => z.reps > 0);
    if (!sets.length) return alert("Enter at least one set with reps.");
    const date = document.getElementById("wdate").value;
    if (!isDate(date)) return alert("Pick a valid date.");
    const note = document.getElementById("wnote").value.trim();
    const sid = el.dataset.session;
    if (sid) {
      const s = data.sessions.find((x) => x.id === sid);
      if (s) Object.assign(s, { date, sets, note });
    } else {
      data.sessions.push({ id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), exerciseId: id, date, createdAt: Date.now(), sets, note });
    }
    save();
    go("exercise", { id });
  },

  "save-custom": (id) => {
    const name = document.getElementById("ename").value.trim();
    if (!name) return alert("Enter a name.");
    const clash = data.exercises.find((e) => e.name.toLowerCase() === name.toLowerCase() && e.id !== id);
    if (clash) return alert('"' + clash.name + '" already exists.');
    const group = document.getElementById("egroup").value.trim() || "Other";
    const type = document.getElementById("etype").value;
    let e = id && findExercise(id);
    if (e) Object.assign(e, { name, group, type, icon: iconFor(group) });
    else {
      e = { id: "c" + Date.now().toString(36), name, group, type, icon: iconFor(group), builtin: false };
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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "strength-log-backup-" + localDate() + ".json";
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
    if (!pendingImport) return;
    autoBackup();
    const ids = new Set(data.exercises.map((e) => e.id));
    const names = new Map(data.exercises.map((e) => [e.name.toLowerCase(), e.id]));
    const remap = new Map();
    for (const e of pendingImport.exercises) {
      if (ids.has(e.id)) continue;
      const same = names.get(e.name.toLowerCase());
      if (same) { remap.set(e.id, same); continue; }
      data.exercises.push(e);
    }
    const sids = new Set(data.sessions.map((s) => s.id));
    for (const s of pendingImport.sessions) {
      if (sids.has(s.id)) continue;
      data.sessions.push({ ...s, exerciseId: remap.get(s.exerciseId) || s.exerciseId });
    }
    finishImport();
  },
  "import-replace": () => {
    if (!pendingImport || !confirm("Replace all workouts on this device with the backup?")) return;
    autoBackup();
    data = pendingImport;
    finishImport();
  },
  reset: () => {
    if (!confirm("Delete ALL workouts and custom exercises from this device?")) return;
    if (!confirm("Are you sure? Export a backup first if unsure.")) return;
    autoBackup();
    data = migrate({});
    save();
    go("home");
  },
  "unlock-storage": () => {
    if (!confirm("Start with empty data? The unreadable copy stays in browser storage.")) return;
    storageBroken = false;
    save();
    render();
  },
};

function autoBackup() {
  try { localStorage.setItem("strength-log-autobackup", JSON.stringify({ at: Date.now(), data })); } catch (_) {}
}
function finishImport() {
  pendingImport = null;
  storageBroken = false;
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

/* ---------- Boot ---------- */
data = load();
save();
render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
