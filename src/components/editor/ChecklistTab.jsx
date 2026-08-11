import React from "react";
import { ArrowRight, Lock, ClipboardCheck, Archive as ArchiveIcon, PenLine } from "lucide-react";
import { Field } from "../ui";
import { CHECK_DEFAULT, STATUS_LABELS, NEXT_STATUS } from "../../constants";
import { hoursUntilUnlock, isAnalyticsUnlocked, timeAgoLabel } from "../../helpers";

export default function ChecklistTab({ day, patchDay, set, lifecycleAction, onOpenAnalytics }) {
  const toggle = (c) => patchDay(d => { d.checklist[c] = !d.checklist[c]; return d; });

  const advance = () => {
    const step = NEXT_STATUS[day.status];
    if (!step) return;
    lifecycleAction(d => {
      d.status = step.next;
      d[step.tsField] = new Date().toISOString();
      // keep legacy posted.{date,time} in sync for older UI bits / PDF export
      if (step.next === "posted") {
        const now = new Date();
        d.posted = { date: now.toISOString().slice(0, 10), time: now.toTimeString().slice(0, 5) };
      }
      return d;
    });
  };

  const renderLifecycleCard = () => {
    if (day.status === "planned" || day.status === "processed" || day.status === "uploaded") {
      const step = NEXT_STATUS[day.status];
      return (
        <button className="btn-primary px-4 py-2.5 text-[13.5px] flex items-center gap-1.5" onClick={advance}>
          <ArrowRight size={14} /> {step.actionLabel}
        </button>
      );
    }
    if (day.status === "posted") {
      const unlocked = isAnalyticsUnlocked(day);
      if (!unlocked) {
        const h = hoursUntilUnlock(day) || 0;
        const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
        return (
          <div className="flex items-center gap-2 text-[13px] font-medium pill px-3.5 py-2.5 w-fit" style={{ color: "var(--sub)" }}>
            <Lock size={14} /> Analytics locked — {hh}h {mm}m qoldi
          </div>
        );
      }
      return (
        <button className="btn-primary px-4 py-2.5 text-[13.5px] flex items-center gap-1.5" onClick={onOpenAnalytics}>
          <ClipboardCheck size={14} /> Enter Analytics
        </button>
      );
    }
    if (day.status === "analyzed") {
      return (
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost px-4 py-2.5 text-[13.5px] flex items-center gap-1.5" onClick={onOpenAnalytics}>
            <PenLine size={14} /> Edit Analytics
          </button>
          <button className="btn-primary px-4 py-2.5 text-[13.5px] flex items-center gap-1.5" onClick={advance}>
            <ArchiveIcon size={14} /> Arxivga o'tkazish
          </button>
        </div>
      );
    }
    if (day.status === "archived") {
      return <div className="text-[13px]" style={{ color: "var(--sub)" }}>Bu content arxivlangan.</div>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {CHECK_DEFAULT.map(c => (
          <label key={c} className="flex items-center gap-2.5 pill px-3 py-2.5 text-[13.5px] cursor-pointer">
            <input type="checkbox" className="checkbox" checked={!!day.checklist[c]} onChange={() => toggle(c)} /> {c}
          </label>
        ))}
      </div>
      <hr style={{ borderColor: "var(--sep)" }} />
      <div className="card p-4 space-y-2" style={{ background: "var(--accent-soft)" }}>
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold">Publish tracking</div>
          <span className="text-[11px] pill px-2 py-0.5 font-semibold">{STATUS_LABELS[day.status] || day.status}</span>
        </div>
        {renderLifecycleCard()}
        {day.postedAt && (
          <div className="text-[12px] mt-1" style={{ color: "var(--sub)" }}>
            Posted: {new Date(day.postedAt).toLocaleString("uz-UZ")} · {timeAgoLabel(day)}
          </div>
        )}
        <div className="text-[11px]" style={{ color: "var(--sub)" }}>
          Bu tugma bosilganda natija darhol saqlanadi — "Saqlash"ni kutmaydi.
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Izoh (Client)" textarea rows={2} value={day.notes.client} onChange={v => set("notes.client", v)} />
        <Field label="Izoh (Operator)" textarea rows={2} value={day.notes.operator} onChange={v => set("notes.operator", v)} />
        <Field label="Izoh (Montajchi)" textarea rows={2} value={day.notes.editor} onChange={v => set("notes.editor", v)} />
      </div>
    </div>
  );
}
