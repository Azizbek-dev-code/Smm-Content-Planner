import React, { useState } from "react";
import { Eye, Bookmark, Heart, MessageCircle, Clock3, ArrowRight, Lock, ClipboardCheck, Archive as ArchiveIcon, PenLine } from "lucide-react";
import { Empty } from "./ui";
import { LIB_CATS, STATUS_COLOR, STATUS_LABELS, NEXT_STATUS } from "../constants";
import { fmtDate, timeAgoLabel, isAnalyticsUnlocked, hoursUntilUnlock } from "../helpers";
import { getAllContent, getArchivedContent } from "../services/contentService";

export default function LibraryPage({ db, onOpen, onEnterAnalytics, patchDayImmediate, search, onlyArchived }) {
  const [activeCat, setActiveCat] = useState(null);

  let list = onlyArchived ? getArchivedContent(db) : getAllContent(db);
  if (!onlyArchived) list = list.filter(d => d.status !== "archived");
  if (activeCat) list = list.filter(d => d.goal === activeCat || d.type === activeCat);

  const q = (search || "").toLowerCase();
  if (q) list = list.filter(d => (d.title + d.script.hook + d.status + d.type + (d.lessons || []).join(" ")).toLowerCase().includes(q));
  list.sort((a, b) => new Date(b.year, b.month - 1, b.date) - new Date(a.year, a.month - 1, a.date));

  const advance = (day) => {
    const step = NEXT_STATUS[day.status];
    if (!step) return;
    patchDayImmediate(day.key, d => {
      d.status = step.next;
      d[step.tsField] = new Date().toISOString();
      if (step.next === "posted") {
        const now = new Date();
        d.posted = { date: now.toISOString().slice(0, 10), time: now.toTimeString().slice(0, 5) };
      }
      return d;
    });
  };

  return (
    <div className="fadein space-y-4">
      {!onlyArchived && (
        <div className="flex flex-wrap gap-2">
          <button className={`tabchip ${activeCat === null ? "active" : ""}`} onClick={() => setActiveCat(null)}>Hammasi</button>
          {LIB_CATS.map(c => (
            <button key={c} className={`tabchip ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(activeCat === c ? null : c)}>{c}</button>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.length ? list.map(d => {
          const ago = timeAgoLabel(d);
          return (
            <div key={d.key} className="card p-4">
              <div className="cursor-pointer" onClick={() => onOpen(d.key)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] pill px-2 py-0.5" style={{ color: "var(--sub)" }}>{d.type}</span>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_COLOR[d.status] + "22", color: STATUS_COLOR[d.status] }}>
                    {STATUS_LABELS[d.status] || d.status}
                  </span>
                </div>
                <div className="font-medium text-[14px] mb-1 truncate">{d.title}</div>
                <div className="text-[11.5px]" style={{ color: "var(--sub)" }}>{fmtDate(d.year, d.month, d.date)} · {d.goal}</div>

                {ago && (
                  <div className="flex items-center gap-1 text-[11px] mt-2 font-medium" style={{ color: "var(--accent)" }}>
                    <Clock3 size={12} /> {ago}
                  </div>
                )}
                {(d.analytics.views > 0 || d.analytics.likes > 0) ? (
                  <div className="text-[11.5px] mt-2 flex items-center gap-3 flex-wrap" style={{ color: "var(--sub)" }}>
                    {d.analytics.views > 0 && <span className="flex items-center gap-1"><Eye size={12} />{d.analytics.views}</span>}
                    {d.analytics.likes > 0 && <span className="flex items-center gap-1"><Heart size={12} />{d.analytics.likes}</span>}
                    {d.analytics.comments > 0 && <span className="flex items-center gap-1"><MessageCircle size={12} />{d.analytics.comments}</span>}
                    {d.analytics.saves > 0 && <span className="flex items-center gap-1"><Bookmark size={12} />{d.analytics.saves}</span>}
                  </div>
                ) : null}
              </div>

              {/* Lifecycle quick-action — persists immediately, independent of the editor's Save/Cancel draft. */}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--sep)" }}>
                <CardAction day={d} onAdvance={() => advance(d)} onEnterAnalytics={() => onEnterAnalytics(d.key)} onArchive={() => advance(d)} />
              </div>
            </div>
          );
        }) : <div className="col-span-full"><Empty text={onlyArchived ? "Arxiv bo'sh" : "Hali content yo'q"} /></div>}
      </div>
    </div>
  );
}

function CardAction({ day, onAdvance, onEnterAnalytics, onArchive }) {
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  if (["planned", "processed", "uploaded"].includes(day.status)) {
    const step = NEXT_STATUS[day.status];
    return (
      <button className="btn-primary w-full py-2 text-[12.5px] flex items-center justify-center gap-1.5" onClick={stop(onAdvance)}>
        <ArrowRight size={13} /> {step.actionLabel}
      </button>
    );
  }
  if (day.status === "posted") {
    if (!isAnalyticsUnlocked(day)) {
      const h = hoursUntilUnlock(day) || 0;
      const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
      return (
        <div className="flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 rounded-[10px]" style={{ background: "var(--panel-2)", color: "var(--sub)" }}>
          <Lock size={13} /> {hh}h {mm}m qoldi
        </div>
      );
    }
    return (
      <button className="btn-primary w-full py-2 text-[12.5px] flex items-center justify-center gap-1.5" onClick={stop(onEnterAnalytics)}>
        <ClipboardCheck size={13} /> Enter Analytics
      </button>
    );
  }
  if (day.status === "analyzed") {
    return (
      <div className="flex gap-2">
        <button className="btn-ghost flex-1 py-2 text-[12px] flex items-center justify-center gap-1.5" onClick={stop(onEnterAnalytics)}>
          <PenLine size={13} /> Edit
        </button>
        <button className="btn-primary flex-1 py-2 text-[12px] flex items-center justify-center gap-1.5" onClick={stop(onArchive)}>
          <ArchiveIcon size={13} /> Arxiv
        </button>
      </div>
    );
  }
  if (day.status === "archived") {
    return <div className="text-center text-[12px] py-1.5" style={{ color: "var(--sub)" }}>Arxivlangan</div>;
  }
  return null;
}
