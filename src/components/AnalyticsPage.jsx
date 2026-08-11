import React from "react";
import { Eye, Target, Heart, MessageCircle, Share2, Bookmark, Send, MousePointerClick, DollarSign, UserPlus, TrendingUp } from "lucide-react";
import { StatCard, Empty } from "./ui";
import { fmtDate } from "../helpers";

export default function AnalyticsPage({ db, onOpen }) {
  const all = Object.values(db.days).filter(d => d.title && d.analytics.views);
  const sum = k => all.reduce((a, d) => a + (+d.analytics[k] || 0), 0);

  const totalViews = sum("views");
  const totalEngagement = sum("likes") + sum("comments") + sum("shares") + sum("saves");
  const engagementRate = totalViews ? ((totalEngagement / totalViews) * 100).toFixed(1) : "0.0";

  const cols = [
    ["views", "Views", Eye], ["reach", "Reach", Target], ["likes", "Likes", Heart],
    ["comments", "Comments", MessageCircle], ["shares", "Shares", Share2], ["saves", "Saves", Bookmark],
    ["dm", "DM", Send], ["clicks", "Clicks", MousePointerClick], ["sales", "Sales", DollarSign], ["lead", "Lead", UserPlus]
  ];
  const top = [...all].sort((a, b) => (+b.analytics.views || 0) - (+a.analytics.views || 0)).slice(0, 8);

  return (
    <div className="fadein space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Jami Views" value={totalViews} Icon={Eye} />
        <StatCard label="Jami Engagement" value={totalEngagement} Icon={Heart} />
        <StatCard label="Engagement Rate" value={engagementRate + "%"} Icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cols.map(([k, l, Icon]) => <StatCard key={k} label={l} value={sum(k)} Icon={Icon} />)}
      </div>

      <div className="card p-5">
        <div className="text-[13px] font-semibold mb-2" style={{ color: "var(--sub)" }}>TOP CONTENT (VIEWS BO'YICHA)</div>
        {top.length ? top.map((d, i) => (
          <div key={d.key} className="flex items-center justify-between py-2.5 border-b last:border-0 cursor-pointer" style={{ borderColor: "var(--sep)" }} onClick={() => onOpen(d.key)}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[13px] font-semibold w-5 shrink-0" style={{ color: "var(--sub)" }}>{i + 1}</span>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium truncate">{d.title}</div>
                <div className="text-[11px]" style={{ color: "var(--sub)" }}>{fmtDate(d.year, d.month, d.date)} · {d.type}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] flex items-center gap-1 hidden sm:flex" style={{ color: "var(--sub)" }}><Heart size={11} />{d.analytics.likes || 0}</span>
              <span className="text-[11px] flex items-center gap-1 hidden sm:flex" style={{ color: "var(--sub)" }}><MessageCircle size={11} />{d.analytics.comments || 0}</span>
              <div className="text-[14px] font-semibold serif">{d.analytics.views}</div>
            </div>
          </div>
        )) : <Empty />}
      </div>
    </div>
  );
}
