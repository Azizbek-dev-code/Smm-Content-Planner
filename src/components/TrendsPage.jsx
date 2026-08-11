import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Empty } from "./ui";
import { LIB_CATS } from "../constants";
import { uid } from "../helpers";

export default function TrendsPage({ db, update, search }) {
  const q = (search || "").toLowerCase();
  let list = db.trends;
  if (q) list = list.filter(t => (t.creator + t.hook + t.category + t.tag).toLowerCase().includes(q));

  const addTrend = () => update(n => {
    n.trends.unshift({ id: uid(), creator: "", link: "", hook: "", idea: "", category: "Trend", status: "unused", tag: "", saved: new Date().toISOString().slice(0, 10), platform: "Instagram" });
    return n;
  });
  const patchTrend = (id, field, val) => update(n => {
    n.trends = n.trends.map(t => t.id === id ? { ...t, [field]: val } : t);
    return n;
  });
  const delTrend = (id) => update(n => { n.trends = n.trends.filter(t => t.id !== id); return n; });

  return (
    <div className="fadein space-y-4">
      <button className="btn-primary px-4 py-2 text-[13px] flex items-center gap-1.5" onClick={addTrend}>
        <Plus size={14} /> Trend video qo'shish
      </button>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.length ? list.map(t => (
          <div key={t.id} className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] pill px-2 py-0.5">{t.platform}</span>
              <button onClick={() => delTrend(t.id)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button>
            </div>
            <input className="field font-medium" value={t.creator} placeholder="Creator" onChange={e => patchTrend(t.id, "creator", e.target.value)} />
            <input className="field" value={t.link} placeholder="Link" onChange={e => patchTrend(t.id, "link", e.target.value)} />
            <input className="field" value={t.hook} placeholder="Hook" onChange={e => patchTrend(t.id, "hook", e.target.value)} />
            <textarea className="field" rows={2} value={t.idea} placeholder="Idea" onChange={e => patchTrend(t.id, "idea", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <select className="field" value={t.category} onChange={e => patchTrend(t.id, "category", e.target.value)}>
                {LIB_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="field" value={t.status} onChange={e => patchTrend(t.id, "status", e.target.value)}>
                <option value="unused">unused</option><option value="used">used</option>
              </select>
            </div>
            <input className="field" value={t.tag} placeholder="Tag" onChange={e => patchTrend(t.id, "tag", e.target.value)} />
            <div className="text-[10.5px]" style={{ color: "var(--sub)" }}>Saved: {t.saved}</div>
          </div>
        )) : <Empty text="Trend library bo'sh" />}
      </div>
    </div>
  );
}
