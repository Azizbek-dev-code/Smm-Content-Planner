import React from "react";
import { Plus, X } from "lucide-react";
import { SHOT_DEFAULT } from "../../constants";

export default function ShotTab({ day, patchDay }) {
  const toggle = (s) => patchDay(d => { d.shotList[s] = !d.shotList[s]; return d; });
  const addCustom = () => patchDay(d => { d.customShots.push({ label: "Yangi shot", done: false }); return d; });
  const patchCustom = (i, field, val) => patchDay(d => { d.customShots[i][field] = val; return d; });
  const delCustom = (i) => patchDay(d => { d.customShots.splice(i, 1); return d; });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {SHOT_DEFAULT.map(s => (
          <label key={s} className="flex items-center gap-2 pill px-3 py-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="checkbox" checked={!!day.shotList[s]} onChange={() => toggle(s)} /> {s}
          </label>
        ))}
      </div>
      <div>
        <label className="lbl">Custom shots</label>
        <div className="space-y-1.5">
          {day.customShots.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" className="checkbox" checked={s.done} onChange={e => patchCustom(i, "done", e.target.checked)} />
              <input className="field flex-1" value={s.label} onChange={e => patchCustom(i, "label", e.target.value)} />
              <button onClick={() => delCustom(i)} style={{ color: "var(--red)" }}><X size={15} /></button>
            </div>
          ))}
        </div>
        <button className="btn-ghost px-3 py-1.5 text-[12.5px] mt-2 flex items-center gap-1.5" onClick={addCustom}><Plus size={13} /> Custom shot</button>
      </div>
    </div>
  );
}
