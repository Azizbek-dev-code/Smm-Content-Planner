import React from "react";
import { Field } from "./ui";
import { Empty } from "./ui";
import { MONTHS, STRATEGY_ITEMS } from "../constants";
import { blankDay, blankPlan, daysInMonth, dayKey } from "../helpers";

export default function PlanningPage({ db, update, getDay, year, month, setMonth }) {
  const key = `${year}-${month}`;
  const plan = db.planning[key] || blankPlan();
  const patchPlan = (field, val) => update(n => {
    if (!n.planning[key]) n.planning[key] = blankPlan();
    n.planning[key][field] = val;
    return n;
  });

  const StrategyCard = ({ d }) => {
    if (d > daysInMonth(year, month)) return <div className="card p-5"><Empty text="Bu oyda kun yo'q" /></div>;
    const day = getDay(year, month, d);
    const strategy = day.strategy || Object.fromEntries(STRATEGY_ITEMS.map(i => [i, false]));
    const toggle = (item) => update(n => {
      const k = dayKey(year, month, d);
      if (!n.days[k]) n.days[k] = blankDay(year, month, d);
      if (!n.days[k].strategy) n.days[k].strategy = Object.fromEntries(STRATEGY_ITEMS.map(i => [i, false]));
      n.days[k].strategy[item] = !n.days[k].strategy[item];
      return n;
    });
    return (
      <div className="card p-5">
        <div className="text-[13px] font-bold mb-1" style={{ color: "var(--ember)" }}>STRATEGY DAY — {d}-{MONTHS[month - 1]}</div>
        <div className="space-y-1.5 mt-3">
          {STRATEGY_ITEMS.map(i => (
            <label key={i} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="checkbox" checked={!!strategy[i]} onChange={() => toggle(i)} /> {i}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fadein space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {MONTHS.map((mn, i) => <button key={mn} onClick={() => setMonth(i + 1)} className={`tabchip ${month === i + 1 ? "active" : ""}`}>{mn}</button>)}
      </div>
      <div className="card p-5 space-y-3">
        <div className="text-[16px] font-semibold serif">{MONTHS[month - 1]} {year} — Oylik maqsad</div>
        <Field label="Oylik maqsad" textarea rows={2} value={plan.goal} onChange={v => patchPlan("goal", v)} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Reels" value={plan.reels} onChange={v => patchPlan("reels", v)} />
          <Field label="Post" value={plan.post} onChange={v => patchPlan("post", v)} />
          <Field label="Story" value={plan.story} onChange={v => patchPlan("story", v)} />
          <Field label="Sales video" value={plan.sales} onChange={v => patchPlan("sales", v)} />
          <Field label="Trend video" value={plan.trend} onChange={v => patchPlan("trend", v)} />
          <Field label="Trust video" value={plan.trust} onChange={v => patchPlan("trust", v)} />
          <Field label="Social proof" value={plan.proof} onChange={v => patchPlan("proof", v)} />
          <Field label="Showroom video" value={plan.showroom} onChange={v => patchPlan("showroom", v)} />
          <Field label="Target lead" value={plan.leadTarget} onChange={v => patchPlan("leadTarget", v)} />
          <Field label="Target sales" value={plan.salesTarget} onChange={v => patchPlan("salesTarget", v)} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <StrategyCard d={1} />
        <StrategyCard d={16} />
      </div>
    </div>
  );
}
