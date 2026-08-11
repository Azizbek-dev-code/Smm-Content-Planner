import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Empty } from "../ui";

export default function ReferenceTab({ day, patchDay }) {
  const add = () => patchDay(d => {
    d.references.push({ creator: "", platform: "Instagram", igLink: "", ytLink: "", ttLink: "", url: "", why: "", hook: "", transition: "", editStyle: "", subtitleStyle: "" });
    return d;
  });
  const patch = (i, field, val) => patchDay(d => { d.references[i][field] = val; return d; });
  const del = (i) => patchDay(d => { d.references.splice(i, 1); return d; });

  return (
    <div className="space-y-3">
      <button className="btn-primary px-3 py-1.5 text-[12.5px] flex items-center gap-1.5" onClick={add}><Plus size={13} /> Reference qo'shish</button>
      <div className="space-y-3">
        {day.references.length ? day.references.map((r, i) => (
          <div key={i} className="card p-3.5 space-y-2" style={{ background: "color-mix(in srgb, var(--panel) 96%, var(--ink) 3%)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold" style={{ color: "var(--sub)" }}>Reference #{i + 1}</span>
              <button onClick={() => del(i)} className="flex items-center gap-1 text-[12px]" style={{ color: "var(--red)" }}><Trash2 size={13} /> o'chirish</button>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <input className="field" placeholder="Creator name" value={r.creator} onChange={e => patch(i, "creator", e.target.value)} />
              <select className="field" value={r.platform} onChange={e => patch(i, "platform", e.target.value)}>
                <option>Instagram</option><option>YouTube</option><option>TikTok</option>
              </select>
              <input className="field" placeholder="Instagram link" value={r.igLink} onChange={e => patch(i, "igLink", e.target.value)} />
              <input className="field" placeholder="YouTube link" value={r.ytLink} onChange={e => patch(i, "ytLink", e.target.value)} />
              <input className="field" placeholder="TikTok link" value={r.ttLink} onChange={e => patch(i, "ttLink", e.target.value)} />
              <input className="field" placeholder="Original video URL" value={r.url} onChange={e => patch(i, "url", e.target.value)} />
            </div>
            <input className="field" placeholder="Nima uchun shu videoga o'xshatilyapti" value={r.why} onChange={e => patch(i, "why", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="field" placeholder="Qaysi hook olinadi" value={r.hook} onChange={e => patch(i, "hook", e.target.value)} />
              <input className="field" placeholder="Qaysi transition olinadi" value={r.transition} onChange={e => patch(i, "transition", e.target.value)} />
              <input className="field" placeholder="Qaysi montaj uslubi" value={r.editStyle} onChange={e => patch(i, "editStyle", e.target.value)} />
              <input className="field" placeholder="Qaysi subtitle uslubi" value={r.subtitleStyle} onChange={e => patch(i, "subtitleStyle", e.target.value)} />
            </div>
          </div>
        )) : <Empty text="Hali reference qo'shilmagan" />}
      </div>
    </div>
  );
}
