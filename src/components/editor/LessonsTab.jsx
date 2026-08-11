import React, { useState } from "react";
import { Field } from "../ui";
import { LESSON_TAGS } from "../../constants";

export default function LessonsTab({ day, patchDay, set }) {
  const toggle = (t) => patchDay(d => {
    d.lessons = d.lessons.includes(t) ? d.lessons.filter(x => x !== t) : [...d.lessons, t];
    return d;
  });
  const [custom, setCustom] = useState("");
  const addCustom = () => {
    if (!custom.trim()) return;
    patchDay(d => { d.lessons.push(custom.trim()); return d; });
    setCustom("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="lbl">Xatolar (Lessons Learned)</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {LESSON_TAGS.map(t => (
            <button key={t} className={`tabchip ${day.lessons.includes(t) ? "active" : ""}`} onClick={() => toggle(t)}>{t}</button>
          ))}
          {day.lessons.filter(l => !LESSON_TAGS.includes(l)).map(t => (
            <span key={t} className="tabchip active">{t}</span>
          ))}
        </div>
        <input className="field" placeholder="Custom xato yozing va Enter bosing..." value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCustom(); }} />
      </div>
      <Field label="Keyingi video uchun yaxshilash" textarea rows={4} value={day.improvement} onChange={v => set("improvement", v)} />
    </div>
  );
}
