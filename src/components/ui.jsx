import React from "react";
import { fmtDate } from "../helpers";
import { STATUS_COLOR, STATUS_LABELS } from "../constants";

export function StatCard({ label, value, Icon }) {
  return (
    <div className="card p-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: "var(--accent-soft)" }}>
        <Icon size={15} style={{ color: "var(--accent)" }} />
      </div>
      <div className="text-2xl font-semibold serif">{value}</div>
      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--sub)" }}>{label}</div>
    </div>
  );
}

export function Empty({ text = "Ma'lumot yo'q" }) {
  return <div className="text-[13px] py-3" style={{ color: "var(--sub)" }}>{text}</div>;
}

export function Field({ label, value, onChange, textarea, rows = 2, type = "text", placeholder }) {
  return (
    <div>
      {label && <label className="lbl">{label}</label>}
      {textarea ? (
        <textarea className="field" rows={rows} value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      ) : (
        <input className="field" type={type} value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function Select({ label, value, onChange, options, labels }) {
  return (
    <div>
      {label && <label className="lbl">{label}</label>}
      <select className="field" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{labels ? (labels[o] || o) : o}</option>)}
      </select>
    </div>
  );
}

export function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} className="w-[46px] h-[28px] rounded-full relative shrink-0 transition-colors" style={{ background: on ? "var(--green)" : "var(--line)" }}>
      <span className="absolute top-[2px] w-[24px] h-[24px] rounded-full bg-white transition-all" style={{ left: on ? "20px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </button>
  );
}

export function TaskRow({ d, onOpen }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0 cursor-pointer" style={{ borderColor: "var(--line)" }} onClick={() => onOpen(d.key)}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="statusdot shrink-0" style={{ background: STATUS_COLOR[d.status] }} />
        <div className="min-w-0">
          <div className="text-[13.5px] font-medium truncate">{d.title || "(nomsiz)"}</div>
          <div className="text-[11px]" style={{ color: "var(--sub)" }}>{fmtDate(d.year, d.month, d.date)} · {d.type} · {d.goal}</div>
        </div>
      </div>
      <span className="text-[10.5px] pill px-2 py-0.5 shrink-0">{STATUS_LABELS[d.status] || d.status}</span>
    </div>
  );
}
