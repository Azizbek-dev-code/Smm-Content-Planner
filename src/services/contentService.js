/**
 * Central data-access layer. Every page (Dashboard, Analytics, Content
 * Library, Archive, Calendar) reads through these functions instead of
 * re-implementing its own filtering/aggregation — so every page always
 * agrees on the same numbers.
 *
 * All functions are pure: they take `db` and return derived data. They
 * never mutate `db` and never touch localStorage directly.
 */
import { daysInMonth, dayKey, hoursSince, hoursUntilUnlock, isAnalyticsUnlocked } from "../helpers";
import { ANALYTICS_HOLD_HOURS } from "../constants";

export function getAllContent(db) {
  return Object.values(db.days || {}).filter(d => d.title && d.title.trim());
}
export function getContentByStatus(db, status) {
  return getAllContent(db).filter(d => d.status === status);
}
export function getPostedContent(db) {
  return getAllContent(db).filter(d => d.status === "posted" || d.status === "analyzed" || d.status === "archived");
}
export function getAnalyzedContent(db) {
  return getAllContent(db).filter(d => d.status === "analyzed" || d.status === "archived");
}
export function getArchivedContent(db) {
  return getAllContent(db).filter(d => d.status === "archived");
}

/** Posted, but still inside the 48h analytics hold window. */
export function getPendingAnalyticsQueue(db) {
  return getAllContent(db).filter(d => d.status === "posted" && d.postedAt && !isAnalyticsUnlocked(d));
}
/** Posted, past the 48h hold, analytics not entered yet. */
export function getReadyForAnalytics(db) {
  return getAllContent(db).filter(d => d.status === "posted" && d.postedAt && isAnalyticsUnlocked(d));
}

/* ---------------- period filtering ---------------- */

export function periodRange(period, custom) {
  const now = new Date();
  const end = now;
  let start;
  switch (period) {
    case "today": {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "7d": start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
    case "30d": start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
    case "month": start = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case "custom": return custom || { start: null, end: null };
    case "all":
    default: return { start: null, end: null };
  }
  return { start, end };
}

/** Filters a content list to those whose postedAt falls inside the period. */
export function filterByPeriod(list, period, custom) {
  const { start, end } = periodRange(period, custom);
  if (!start) return list;
  const startT = start.getTime();
  const endT = (end || new Date()).getTime();
  return list.filter(d => {
    if (!d.postedAt) return false;
    const t = new Date(d.postedAt).getTime();
    return t >= startT && t <= endT;
  });
}

export function getAnalyticsForPeriod(db, period = "all", custom) {
  return filterByPeriod(getPostedContent(db), period, custom);
}

/* ---------------- aggregate sums ---------------- */

const NUM = (v) => (Number.isFinite(+v) ? +v : 0);

export function sumField(list, field) {
  return list.reduce((acc, d) => acc + NUM(d.analytics?.[field]), 0);
}
export function getTotals(list) {
  const fields = ["views","reach","likes","comments","shares","saves","profileVisits","dm","clicks","leads","sales","adSpend","revenue","otherCosts"];
  const t = {};
  for (const f of fields) t[f] = sumField(list, f);
  return t;
}
export function getTotalEngagement(list) {
  return sumField(list, "likes") + sumField(list, "comments") + sumField(list, "shares") + sumField(list, "saves");
}
export function calculateEngagementRate(list) {
  const reach = sumField(list, "reach");
  if (!reach) return 0;
  return (getTotalEngagement(list) / reach) * 100;
}
export function calculateProfit(list) {
  const revenue = sumField(list, "revenue");
  const adSpend = sumField(list, "adSpend");
  const otherCosts = sumField(list, "otherCosts");
  return revenue - adSpend - otherCosts;
}
export function calculateROI(list) {
  const adSpend = sumField(list, "adSpend");
  if (!adSpend) return 0;
  return (calculateProfit(list) / adSpend) * 100;
}
export function calculateCostPerLead(list) {
  const leads = sumField(list, "leads");
  if (!leads) return 0;
  return sumField(list, "adSpend") / leads;
}
export function calculateRevenuePerLead(list) {
  const leads = sumField(list, "leads");
  if (!leads) return 0;
  return sumField(list, "revenue") / leads;
}

/** Per-item derived numbers, used on cards and in the entry modal. */
export function itemEngagement(day) {
  const a = day.analytics || {};
  return NUM(a.likes) + NUM(a.comments) + NUM(a.shares) + NUM(a.saves);
}
export function itemEngagementRate(day) {
  const a = day.analytics || {};
  if (!NUM(a.reach)) return 0;
  return (itemEngagement(day) / NUM(a.reach)) * 100;
}
export function itemProfit(day) {
  const a = day.analytics || {};
  return NUM(a.revenue) - NUM(a.adSpend) - NUM(a.otherCosts);
}

export function getTopContent(db, { period = "all", custom, limit = 8 } = {}) {
  const list = filterByPeriod(getAnalyzedContent(db), period, custom);
  return [...list].sort((a, b) => NUM(b.analytics?.views) - NUM(a.analytics?.views)).slice(0, limit);
}

/* ---------------- dashboard-facing helpers ---------------- */

export function getMonthContent(db, year, month) {
  const n = daysInMonth(year, month);
  const out = [];
  for (let d = 1; d <= n; d++) {
    const rec = db.days[dayKey(year, month, d)];
    if (rec && rec.title && rec.title.trim()) out.push(rec);
  }
  return out;
}
export function getCompletion(list) {
  const total = list.length;
  const published = list.filter(d => ["posted", "analyzed", "archived"].includes(d.status)).length;
  const pct = total ? Math.round((published / total) * 100) : 0;
  return { total, published, remaining: Math.max(total - published, 0), pct };
}
export function getUpcomingContent(db, limit = 5) {
  const now = new Date();
  return getAllContent(db)
    .filter(d => ["planned", "processed", "uploaded"].includes(d.status))
    .map(d => ({ d, ts: new Date(d.year, d.month - 1, d.date).getTime() }))
    .filter(x => x.ts >= new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())
    .sort((a, b) => a.ts - b.ts)
    .slice(0, limit)
    .map(x => x.d);
}
/** Content scheduled for today that still has unfinished checklist items. */
export function getTodayTasks(db) {
  const now = new Date();
  return getAllContent(db).filter(d => {
    if (d.year !== now.getFullYear() || d.month !== now.getMonth() + 1 || d.date !== now.getDate()) return false;
    const items = Object.values(d.checklist || {});
    const hasUnchecked = items.length === 0 || items.some(v => !v);
    return hasUnchecked || ["planned", "processed", "uploaded"].includes(d.status);
  });
}

export { hoursSince, hoursUntilUnlock, isAnalyticsUnlocked, ANALYTICS_HOLD_HOURS };
