import { SHOT_DEFAULT, CHECK_DEFAULT, ANALYTICS_HOLD_HOURS, STATUSES } from "./constants";

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
export const firstOffset = (y, m) => (new Date(y, m - 1, 1).getDay() + 6) % 7;
export const fmtDate = (y, m, d) => `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
export const dayKey = (y, m, d) => `${y}-${m}-${d}`;

export function blankAnalytics() {
  return {
    views: 0, reach: 0, likes: 0, comments: 0, shares: 0, saves: 0,
    profileVisits: 0, dm: 0, clicks: 0,
    leads: 0, sales: 0,
    adSpend: 0, revenue: 0, otherCosts: 0,
    notes: "",
  };
}

export function blankDay(y, m, d) {
  const now = new Date().toISOString();
  return {
    key: dayKey(y, m, d), year: y, month: m, date: d,
    status: "planned", type: "Reels", goal: "Reach", title: "",

    createdAt: now,
    processedAt: null, uploadedAt: null, postedAt: null, analyzedAt: null, archivedAt: null,

    script: { hook: "", problem: "", solution: "", proof: "", cta: "" },
    stories: ["", "", ""],
    post: { carousel: "", caption: "", hashtag: "" },
    shootTime: { date: "", time: "" }, editTime: { date: "", time: "" }, uploadTime: { date: "", time: "" },
    references: [],
    shotList: Object.fromEntries(SHOT_DEFAULT.map(s => [s, false])),
    customShots: [],
    editNotes: { transition: "", audio: "", subtitle: "", overlay: "", duration: "", format: "9:16", grading: "", speedramp: "", effects: "" },
    checklist: Object.fromEntries(CHECK_DEFAULT.map(s => [s, false])),

    // legacy field kept for backward compatibility with older records/UI bits
    posted: { date: "", time: "" },

    analytics: blankAnalytics(),
    lessons: [], improvement: "",
    notes: { client: "", operator: "", editor: "" },
  };
}
export function blankPlan() {
  return { goal: "", reels: "", post: "", story: "", sales: "", trend: "", trust: "", proof: "", showroom: "", leadTarget: "", salesTarget: "" };
}

/* ---------- lifecycle / timestamps ---------- */

export function hoursSince(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, (Date.now() - t) / (1000 * 60 * 60));
}
export function isAnalyticsUnlocked(day) {
  const h = hoursSince(day.postedAt);
  return h !== null && h >= ANALYTICS_HOLD_HOURS;
}
export function hoursUntilUnlock(day) {
  const h = hoursSince(day.postedAt);
  if (h === null) return null;
  return Math.max(0, ANALYTICS_HOLD_HOURS - h);
}
export function timeAgoLabel(day) {
  const h = hoursSince(day.postedAt);
  if (h === null) return null;
  if (h < 1) return "hozirgina joylandi";
  if (h < 24) return `${Math.floor(h)} soat oldin joylandi`;
  return `${Math.floor(h / 24)} kun oldin joylandi`;
}
export function isPosted48hAgo(day) {
  return day.status === "posted" && isAnalyticsUnlocked(day);
}

/* ---------- generic deep setter used by the editor forms ---------- */
export function setDeep(obj, path, val) {
  const parts = path.split(".");
  const clone = structuredClone(obj);
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = /^\d+$/.test(parts[i]) ? +parts[i] : parts[i];
    cur = cur[k];
  }
  const lastKey = /^\d+$/.test(parts.at(-1)) ? +parts.at(-1) : parts.at(-1);
  cur[lastKey] = val;
  return clone;
}

/* ---------- currency ---------- */
export function formatUZS(value, { compact = false } = {}) {
  const n = Number(value) || 0;
  if (compact && Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString("uz-UZ", { maximumFractionDigits: 1 })}M so'm`;
  }
  return `${Math.round(n).toLocaleString("uz-UZ")} so'm`;
}

/* ---------- migration: never destroys existing user data ---------- */
const OLD_STATUS_MAP = {
  Planned: "planned",
  Shooting: "processed",
  Editing: "processed",
  Scheduled: "uploaded",
  Posted: "posted",
  Analyzed: "analyzed",
  planned: "planned", processed: "processed", uploaded: "uploaded",
  posted: "posted", analyzed: "analyzed", archived: "archived",
};

function migrateDayRecord(raw, y, m, d) {
  const blank = blankDay(y, m, d);
  // merge shallowly first so any brand-new top-level fields get defaults...
  const merged = { ...blank, ...raw };

  // ...then merge nested objects so partially-shaped legacy records keep their
  // own values but still get any missing sub-fields (e.g. new analytics keys).
  merged.script = { ...blank.script, ...(raw.script || {}) };
  merged.post = { ...blank.post, ...(raw.post || {}) };
  merged.shootTime = { ...blank.shootTime, ...(raw.shootTime || {}) };
  merged.editTime = { ...blank.editTime, ...(raw.editTime || {}) };
  merged.uploadTime = { ...blank.uploadTime, ...(raw.uploadTime || {}) };
  merged.shotList = { ...blank.shotList, ...(raw.shotList || {}) };
  merged.editNotes = { ...blank.editNotes, ...(raw.editNotes || {}) };
  merged.checklist = { ...blank.checklist, ...(raw.checklist || {}) };
  merged.posted = { ...blank.posted, ...(raw.posted || {}) };
  merged.notes = { ...blank.notes, ...(raw.notes || {}) };
  merged.analytics = { ...blank.analytics, ...(raw.analytics || {}) };
  merged.stories = Array.isArray(raw.stories) && raw.stories.length ? raw.stories : blank.stories;
  merged.references = Array.isArray(raw.references) ? raw.references : [];
  merged.customShots = Array.isArray(raw.customShots) ? raw.customShots : [];
  merged.lessons = Array.isArray(raw.lessons) ? raw.lessons : [];

  // status: map legacy capitalised statuses to the new lowercase lifecycle codes
  const mapped = OLD_STATUS_MAP[raw.status];
  merged.status = STATUSES.includes(mapped) ? mapped : (STATUSES.includes(raw.status) ? raw.status : "planned");

  // legacy records stored the posted timestamp as {date,time} under `posted`,
  // not as a single ISO `postedAt` — backfill postedAt from it if missing.
  if (!merged.postedAt && raw.posted && raw.posted.date) {
    const iso = new Date(`${raw.posted.date}T${raw.posted.time || "00:00"}`).toISOString();
    if (!Number.isNaN(new Date(iso).getTime())) merged.postedAt = iso;
  }
  if (!merged.createdAt) merged.createdAt = blank.createdAt;
  if (merged.status === "analyzed" && !merged.analyzedAt) merged.analyzedAt = merged.postedAt || merged.createdAt;
  if (merged.status === "archived" && !merged.archivedAt) merged.archivedAt = merged.analyzedAt || merged.createdAt;

  return merged;
}

/**
 * Normalizes a raw DB object loaded from localStorage into the current
 * shape. Safe to run on every load: existing fields are preserved, only
 * missing ones get sane defaults. Never drops a record.
 */
export function migrateDB(raw) {
  if (!raw || typeof raw !== "object") return null;
  const db = {
    settings: {
      dark: !!raw?.settings?.dark,
      clientView: !!raw?.settings?.clientView,
      brand: {
        name: raw?.settings?.brand?.name || "Studio Nova",
        contact: raw?.settings?.brand?.contact || "@studionova · +998 90 000 00 00",
      },
    },
    days: {},
    trends: Array.isArray(raw.trends) ? raw.trends : [],
    planning: raw.planning && typeof raw.planning === "object" ? raw.planning : {},
  };

  const days = raw.days && typeof raw.days === "object" ? raw.days : {};
  for (const key of Object.keys(days)) {
    const parts = key.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) continue; // skip corrupt keys, never crash
    const [y, m, d] = parts;
    db.days[key] = migrateDayRecord(days[key] || {}, y, m, d);
  }
  return db;
}
