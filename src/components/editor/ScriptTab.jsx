import React from "react";
import { Field } from "../ui";

function TimeField({ label, val, onChange }) {
  return (
    <div>
      <label className="lbl">{label}</label>
      <input type="date" className="field mb-1.5" value={val.date} onChange={e => onChange("date", e.target.value)} />
      <input type="time" className="field" value={val.time} onChange={e => onChange("time", e.target.value)} />
    </div>
  );
}

export default function ScriptTab({ day, set }) {
  return (
    <div className="space-y-3">
      <Field label="Hook" textarea value={day.script.hook} onChange={v => set("script.hook", v)} />
      <Field label="Problem" textarea value={day.script.problem} onChange={v => set("script.problem", v)} />
      <Field label="Solution" textarea value={day.script.solution} onChange={v => set("script.solution", v)} />
      <Field label="Proof" textarea value={day.script.proof} onChange={v => set("script.proof", v)} />
      <Field label="CTA" textarea value={day.script.cta} onChange={v => set("script.cta", v)} />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <TimeField label="Video olish" val={day.shootTime} onChange={(f, v) => set(`shootTime.${f}`, v)} />
        <TimeField label="Montaj" val={day.editTime} onChange={(f, v) => set(`editTime.${f}`, v)} />
        <TimeField label="Upload" val={day.uploadTime} onChange={(f, v) => set(`uploadTime.${f}`, v)} />
      </div>
    </div>
  );
}
