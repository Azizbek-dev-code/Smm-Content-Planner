import React, { useState } from "react";
import { X, Printer, Check, AlertCircle } from "lucide-react";
import { Select } from "./ui";
import { MONTHS, STATUS_LABELS, CONTENT_TYPES, GOALS, EDITOR_TABS } from "../constants";
import { fmtDate, setDeep } from "../helpers";

import ScriptTab from "./editor/ScriptTab";
import StoryTab from "./editor/StoryTab";
import ReferenceTab from "./editor/ReferenceTab";
import ShotTab from "./editor/ShotTab";
import EditTab from "./editor/EditTab";
import ChecklistTab from "./editor/ChecklistTab";
import AnalyticsTab from "./editor/AnalyticsTab";
import LessonsTab from "./editor/LessonsTab";

export default function DayEditorModal({ initialDay, editorTab, setEditorTab, onCancel, onSave, onLifecycleAction, onOpenAnalytics }) {
  // Everything the person types lives here, in a local draft, until they
  // explicitly press Save. Cancel (or the X) just closes — nothing is written.
  const [draft, setDraft] = useState(initialDay);
  const [dirty, setDirty] = useState(false);

  const set = (path, val) => { setDraft(d => setDeep(d, path, val)); setDirty(true); };
  const patchDay = (fn) => { setDraft(d => fn(structuredClone(d))); setDirty(true); };

  // Status/lifecycle changes (planned→processed→uploaded→posted, archive)
  // are meaningful on their own — they persist to the database immediately
  // instead of waiting for "Saqlash", and the local draft is kept in sync
  // so the rest of the open editor reflects the new status right away.
  const lifecycleAction = (fn) => {
    setDraft(d => fn(structuredClone(d)));
    onLifecycleAction(fn);
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Saqlanmagan o'zgarishlar bor. Rostdan ham bekor qilasizmi?")) return;
    onCancel();
  };
  const handleSave = () => { onSave(draft); };
  const printPDF = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" style={{ background: "rgba(0,0,0,.42)", backdropFilter: "blur(2px)" }} onClick={e => { if (e.target === e.currentTarget) handleCancel(); }}>
      <div className="glass-panel w-full md:max-w-3xl max-h-[94vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] modalpop">
        <div className="sheet-grabber md:hidden" />
        <div className="sticky top-0 z-10 px-5 py-3.5 flex items-center justify-between frosted border-b" style={{ borderColor: "var(--sep)" }}>
          <div className="min-w-0 flex-1 mr-3">
            <div className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: "var(--sub)" }}>
              {fmtDate(draft.year, draft.month, draft.date)} · {MONTHS[draft.month - 1]}
              {dirty && <span className="flex items-center gap-1" style={{ color: "var(--ember)" }}><AlertCircle size={11} /> saqlanmagan</span>}
            </div>
            <input className="text-[17px] font-semibold serif w-full mt-0.5 outline-none border-none bg-transparent" placeholder="Video nomi..." value={draft.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn-ghost px-3 py-1.5 text-[12.5px]" onClick={handleCancel}>Bekor qilish</button>
            <button className="btn-primary px-3.5 py-1.5 text-[12.5px] flex items-center gap-1.5" onClick={handleSave}>
              <Check size={14} /> Saqlash
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--panel-2)" }} onClick={handleCancel}><X size={15} /></button>
          </div>
        </div>

        <div className="px-5 pt-4 flex items-center justify-between gap-2">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div>
              <label className="lbl">Status</label>
              <div className="field flex items-center gap-2" style={{ cursor: "default" }}>
                <span className="statusdot" style={{ background: "var(--accent)" }} />
                {STATUS_LABELS[draft.status] || draft.status}
              </div>
            </div>
            <Select label="Content type" value={draft.type} onChange={v => set("type", v)} options={CONTENT_TYPES} />
            <Select label="Maqsad" value={draft.goal} onChange={v => set("goal", v)} options={GOALS} />
          </div>
        </div>
        <div className="px-5 pt-1">
          <span className="text-[11.5px]" style={{ color: "var(--sub)" }}>Status faqat "Checklist" bo'limidagi bosqichma-bosqich tugmalar orqali o'zgaradi.</span>
        </div>
        <div className="px-5 pt-2">
          <button className="btn-ghost px-3 py-1.5 text-[12px] flex items-center gap-1.5" onClick={printPDF}><Printer size={13} /> Print / PDF (joriy saqlangan holat)</button>
        </div>

        <div className="px-5 pt-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {EDITOR_TABS.map(([id, label]) => (
            <button key={id} className={`tabchip ${editorTab === id ? "active" : ""}`} onClick={() => setEditorTab(id)}>{label}</button>
          ))}
        </div>

        <div className="p-5">
          {editorTab === "script" && <ScriptTab day={draft} set={set} />}
          {editorTab === "story" && <StoryTab day={draft} set={set} />}
          {editorTab === "reference" && <ReferenceTab day={draft} patchDay={patchDay} />}
          {editorTab === "shot" && <ShotTab day={draft} patchDay={patchDay} />}
          {editorTab === "edit" && <EditTab day={draft} set={set} />}
          {editorTab === "checklist" && <ChecklistTab day={draft} patchDay={patchDay} set={set} lifecycleAction={lifecycleAction} onOpenAnalytics={onOpenAnalytics} />}
          {editorTab === "analytics" && <AnalyticsTab day={draft} />}
          {editorTab === "lessons" && <LessonsTab day={draft} patchDay={patchDay} set={set} />}
        </div>

        <div className="sticky bottom-0 px-5 py-3 frosted border-t flex items-center justify-end gap-2 md:hidden" style={{ borderColor: "var(--sep)" }}>
          <button className="btn-ghost px-4 py-2 text-[13px] flex-1" onClick={handleCancel}>Bekor qilish</button>
          <button className="btn-primary px-4 py-2 text-[13px] flex-1 flex items-center justify-center gap-1.5" onClick={handleSave}>
            <Check size={14} /> Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
