import React from "react";
import {
  Film, Image as ImageIcon, Zap, CheckCircle2, Target, BarChart3, Clock3, LayoutGrid,
  Eye, Bookmark, DollarSign
} from "lucide-react";
import { StatCard, Empty, TaskRow } from "./ui";
import { WEEKDAYS } from "../constants";
import { blankDay, dayKey, daysInMonth, fmtDate, isPosted48hAgo } from "../helpers";

export default function Dashboard({ db, onOpen, year, month }) {
  const now = new Date();
  const m = now.getFullYear() === year ? now.getMonth() + 1 : month;
  const n = daysInMonth(year, m);
  const days = Array.from({ length: n }, (_, i) => db.days[dayKey(year, m, i + 1)] || blankDay(year, m, i + 1));
  const withTitle = days.filter(d => d.title);
  const posted = withTitle.filter(d => d.status === "Posted" || d.status === "Analyzed");
  const total = withTitle.length;
  const remaining = total - posted.length;
  const pct = total ? Math.round((posted.length / total) * 100) : 0;
  const countType = t => withTitle.filter(d => d.type === t).length;

  const withViews = withTitle.filter(d => d.analytics.views);
  const topViews = [...withViews].sort((a, b) => (+b.analytics.views || 0) - (+a.analytics.views || 0))[0];
  const topSaves = [...withViews].sort((a, b) => (+b.analytics.saves || 0) - (+a.analytics.saves || 0))[0];
  const topSales = [...withViews].sort((a, b) => (+b.analytics.sales || 0) - (+a.analytics.sales || 0))[0];

  const upcoming = withTitle.filter(d => ["Planned", "Shooting", "Editing", "Scheduled"].includes(d.status)).sort((a, b) => a.date - b.date).slice(0, 5);
  const todayTasks = withTitle.filter(d => d.date === now.getDate() && d.month === now.getMonth() + 1);
  const pendingAnalytics = Object.values(db.days).filter(d => d.status === "Posted" && isPosted48hAgo(d));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(); dt.setDate(dt.getDate() - (6 - i));
    const label = WEEKDAYS[(dt.getDay() + 6) % 7];
    if (dt.getFullYear() !== year) return { label, val: 0 };
    const dd = db.days[dayKey(year, dt.getMonth() + 1, dt.getDate())];
    const val = dd && dd.title ? (dd.status === "Posted" || dd.status === "Analyzed" ? 3 : 1) : 0;
    return { label, val };
  });
  const maxBar = Math.max(1, ...last7.map(b => b.val));
  const avatarColors = ["var(--accent)", "var(--ember)", "#5B8DEF", "var(--green)"];
  const topFour = withTitle.slice(0, 4);

  return (
    <div className="fadein space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[13px] font-semibold" style={{ color: "var(--sub)" }}>Haftalik faollik</div>
            <span className={remaining > 0 ? "badge-down" : "badge-up"}>{pct}%</span>
          </div>
          <div className="text-2xl font-semibold serif mb-3">{posted.length}<span className="text-[13px] font-normal" style={{ color: "var(--sub)" }}> joylangan</span></div>
          <div className="bars">
            {last7.map((b, i) => <div key={i} className={`bar ${b.val === maxBar && maxBar > 0 ? "hi" : ""}`} style={{ height: `${Math.max(8, (b.val / maxBar) * 100)}%` }} title={b.label} />)}
          </div>
          <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "var(--sub)" }}>
            {last7.map((b, i) => <span key={i}>{b.label}</span>)}
          </div>
        </div>

        <div className="card p-5 flex flex-col items-center justify-center text-center">
          <div className="text-[13px] font-semibold mb-3 self-start" style={{ color: "var(--sub)" }}>Completion</div>
          <div className="donut" style={{ "--val": pct, width: 104, height: 104 }}>
            <div className="donut-inner" style={{ width: 76, height: 76 }}>
              <div className="text-xl font-semibold serif">{pct}%</div>
              <div className="text-[9.5px]" style={{ color: "var(--sub)" }}>bajarildi</div>
            </div>
          </div>
          <div className="text-[11.5px] mt-3" style={{ color: "var(--sub)" }}>{posted.length} / {total} content joylandi</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-semibold" style={{ color: "var(--sub)" }}>Bu oy content</div>
            <span className="badge-up">+{total}</span>
          </div>
          <div className="text-2xl font-semibold serif mb-3">{total}<span className="text-[13px] font-normal" style={{ color: "var(--sub)" }}> reja</span></div>
          <div className="flex mb-2">
            {topFour.length ? topFour.map((d, i) => (
              <div key={i} className="avatar" style={{ background: avatarColors[i % 4] }}>{(d.type || "?")[0]}</div>
            )) : <div className="avatar" style={{ background: "var(--line)", color: "var(--sub)" }}>–</div>}
          </div>
          <div className="text-[11.5px]" style={{ color: "var(--sub)" }}>Reels · Post · Story · Carousel</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Reels" value={countType("Reels")} Icon={Film} />
        <StatCard label="Post" value={countType("Post")} Icon={ImageIcon} />
        <StatCard label="Story" value={countType("Story")} Icon={Zap} />
        <StatCard label="Joylandi" value={posted.length} Icon={CheckCircle2} />
        <StatCard label="Qoldi" value={Math.max(remaining, 0)} Icon={Target} />
        <StatCard label="Completion" value={pct + "%"} Icon={BarChart3} />
        <StatCard label="48h kutmoqda" value={pendingAnalytics.length} Icon={Clock3} />
        <StatCard label="Jami reja" value={total} Icon={LayoutGrid} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <TopPerfCard title="TOP VIEWS" d={topViews} metric="views" Icon={Eye} onOpen={onOpen} />
        <TopPerfCard title="TOP SAVES" d={topSaves} metric="saves" Icon={Bookmark} onOpen={onOpen} />
        <TopPerfCard title="TOP SALES" d={topSales} metric="sales" Icon={DollarSign} onOpen={onOpen} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--sub)" }}>BUGUNGI VAZIFALAR</div>
          {todayTasks.length ? todayTasks.map(d => <TaskRow key={d.key} d={d} onOpen={onOpen} />) : <Empty text="Bugun uchun reja yo'q" />}
        </div>
        <div className="card p-5">
          <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--sub)" }}>UPCOMING CONTENT</div>
          {upcoming.length ? upcoming.map(d => <TaskRow key={d.key} d={d} onOpen={onOpen} />) : <Empty text="Reja yo'q" />}
        </div>
      </div>

      {pendingAnalytics.length > 0 && (
        <div className="card p-5 border-l-4" style={{ borderLeftColor: "var(--ember)" }}>
          <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--ember)" }}>48 SOATLIK ANALYTICS KUTAYOTGAN VIDEOLAR</div>
          {pendingAnalytics.map(d => <TaskRow key={d.key} d={d} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

function TopPerfCard({ title, d, metric, Icon, onOpen }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[13px] font-semibold mb-3" style={{ color: "var(--sub)" }}>
        <Icon size={14} /> {title}
      </div>
      {d ? (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => onOpen(d.key)}>
          <div className="min-w-0">
            <div className="text-[13.5px] font-medium truncate">{d.title || "(nomsiz)"}</div>
            <div className="text-[11px]" style={{ color: "var(--sub)" }}>{fmtDate(d.year, d.month, d.date)} · {d.type}</div>
          </div>
          <div className="text-lg font-semibold serif shrink-0">{d.analytics[metric] || 0}</div>
        </div>
      ) : <Empty />}
    </div>
  );
}
