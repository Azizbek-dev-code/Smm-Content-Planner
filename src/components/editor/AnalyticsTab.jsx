import React from "react";
import { Info } from "lucide-react";
import { isAnalyticsUnlocked, hoursUntilUnlock, formatUZS } from "../../helpers";
import { itemEngagement, itemEngagementRate, itemProfit } from "../../services/contentService";

const LABELS = {
  views: "Views", reach: "Reach", likes: "Likes", comments: "Comments", shares: "Shares", saves: "Saves",
  profileVisits: "Profile visits", dm: "DM", clicks: "Clicks", leads: "Leads", sales: "Sales",
  adSpend: "Ad spend", revenue: "Revenue", otherCosts: "Other costs",
};

// Read-only summary. Real data entry happens through the "Enter/Edit Analytics"
// action on the Checklist tab (AnalyticsEntryModal), which saves immediately —
// keeping analytics writes on a single, unambiguous path.
export default function AnalyticsTab({ day }) {
  const hasData = Object.values(day.analytics || {}).some(v => Number(v) > 0);

  if (day.status !== "posted" && day.status !== "analyzed" && day.status !== "archived") {
    return (
      <div className="card p-4 text-[13px] flex items-start gap-2" style={{ background: "var(--accent-soft)", color: "var(--sub)" }}>
        <Info size={15} className="shrink-0 mt-0.5" />
        Bu content hali "Posted" bosqichiga yetmagan. Analytics faqat postdan 48 soat o'tgach kiritiladi.
      </div>
    );
  }
  if (day.status === "posted" && !isAnalyticsUnlocked(day)) {
    const h = hoursUntilUnlock(day) || 0;
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return (
      <div className="card p-4 text-[13px]" style={{ background: "var(--accent-soft)", color: "var(--sub)" }}>
        Analytics locked — {hh}h {mm}m qoldi. "Checklist" bo'limida qachon ochilishini ko'rasiz.
      </div>
    );
  }
  if (!hasData) {
    return (
      <div className="card p-4 text-[13px]" style={{ color: "var(--sub)" }}>
        Hali analytics ma'lumotlari yo'q. "Checklist" bo'limidagi <b>Enter Analytics</b> tugmasi orqali kiriting.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(LABELS).map(k => (
          <div key={k} className="card p-3">
            <div className="text-[10.5px] font-semibold" style={{ color: "var(--sub)" }}>{LABELS[k]}</div>
            <div className="text-[16px] font-semibold serif mt-0.5">
              {["adSpend", "revenue", "otherCosts"].includes(k) ? formatUZS(day.analytics[k], { compact: true }) : (day.analytics[k] || 0)}
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4 grid grid-cols-2 md:grid-cols-3 gap-3" style={{ background: "var(--accent-soft)" }}>
        <Stat label="Engagement" value={itemEngagement(day)} />
        <Stat label="Engagement rate" value={itemEngagementRate(day).toFixed(1) + "%"} />
        <Stat label="Profit" value={formatUZS(itemProfit(day), { compact: true })} />
      </div>
      {day.analytics.notes && (
        <div className="card p-3 text-[13px]"><b>Notes:</b> {day.analytics.notes}</div>
      )}
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div>
      <div className="font-semibold serif text-[15px]">{value}</div>
      <div className="text-[11.5px]" style={{ color: "var(--sub)" }}>{label}</div>
    </div>
  );
}
