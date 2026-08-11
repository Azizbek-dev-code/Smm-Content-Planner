import React, { useState } from "react";
import { X, Check, Info } from "lucide-react";
import { ANALYTICS_FIELDS } from "../constants";
import { fmtDate, formatUZS } from "../helpers";
import { itemEngagement } from "../services/contentService";

const ALL_NUMERIC_KEYS = [
  ...ANALYTICS_FIELDS.performance,
  ...ANALYTICS_FIELDS.conversion,
  ...ANALYTICS_FIELDS.financial,
].map(([k]) => k);

function clampNonNegative(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return n < 0 ? 0 : n;
}

export default function AnalyticsEntryModal({ day, onClose, onSave }) {
  const isEdit = day.status === "analyzed" || day.status === "archived";
  const [form, setForm] = useState(() => {
    const base = { ...day.analytics };
    for (const k of ALL_NUMERIC_KEYS) if (base[k] === undefined || base[k] === null) base[k] = 0;
    if (base.notes === undefined) base.notes = "";
    return base;
  });

  const setNum = (k, v) => setForm(f => ({ ...f, [k]: v === "" ? "" : clampNonNegative(v) }));

  const engagement = itemEngagement({ analytics: form });
  const reach = Number(form.reach) || 0;
  const engagementRate = reach ? (engagement / reach) * 100 : 0;
  const revenue = Number(form.revenue) || 0;
  const adSpend = Number(form.adSpend) || 0;
  const otherCosts = Number(form.otherCosts) || 0;
  const profit = revenue - adSpend - otherCosts;
  const roi = adSpend ? (profit / adSpend) * 100 : 0;
  const leads = Number(form.leads) || 0;
  const costPerLead = leads ? adSpend / leads : 0;

  const handleSave = () => {
    const cleaned = {};
    for (const k of ALL_NUMERIC_KEYS) cleaned[k] = clampNonNegative(form[k]);
    cleaned.notes = form.notes || "";
    onSave(cleaned);
  };

  const NumField = ({ k, label }) => (
    <div>
      <label className="lbl">{label}</label>
      <input
        className="field" type="number" min="0" inputMode="numeric"
        value={form[k]} onChange={e => setNum(k, e.target.value)}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" style={{ background: "rgba(0,0,0,.42)", backdropFilter: "blur(2px)" }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-panel w-full md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] modalpop">
        <div className="sheet-grabber md:hidden" />
        <div className="sticky top-0 z-10 px-5 py-3.5 flex items-center justify-between frosted border-b" style={{ borderColor: "var(--sep)" }}>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold" style={{ color: "var(--sub)" }}>
              {isEdit ? "Analytics tahrirlash" : "Analytics kiritish"} · {fmtDate(day.year, day.month, day.date)}
            </div>
            <div className="text-[16px] font-semibold serif truncate">{day.title || "(nomsiz)"}</div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--panel-2)" }} onClick={onClose}><X size={15} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="lbl mb-2">Organic metrics</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ANALYTICS_FIELDS.performance.map(([k, label]) => <NumField key={k} k={k} label={label} />)}
            </div>
          </div>
          <div>
            <div className="lbl mb-2">Conversion</div>
            <div className="grid grid-cols-2 gap-3">
              {ANALYTICS_FIELDS.conversion.map(([k, label]) => <NumField key={k} k={k} label={label} />)}
            </div>
          </div>
          <div>
            <div className="lbl mb-2">Financial</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ANALYTICS_FIELDS.financial.map(([k, label]) => <NumField key={k} k={k} label={label} />)}
            </div>
          </div>
          <div>
            <label className="lbl">Notes</label>
            <textarea className="field" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="card p-4 space-y-2" style={{ background: "var(--accent-soft)" }}>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--accent)" }}>
              <Info size={13} /> Avtomatik hisoblanadi
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[12.5px]">
              <Stat label="Engagement" value={engagement} />
              <Stat label="Engagement rate" value={engagementRate.toFixed(1) + "%"} />
              <Stat label="Profit" value={formatUZS(profit, { compact: true })} />
              <Stat label="ROI" value={roi.toFixed(0) + "%"} />
              <Stat label="Cost / Lead" value={formatUZS(costPerLead, { compact: true })} />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button className="btn-ghost px-4 py-2.5 text-[13.5px] flex-1" onClick={onClose}>Bekor qilish</button>
            <button className="btn-primary px-4 py-2.5 text-[13.5px] flex-1 flex items-center justify-center gap-1.5" onClick={handleSave}>
              <Check size={15} /> Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-semibold serif text-[14px]">{value}</div>
      <div style={{ color: "var(--sub)" }}>{label}</div>
    </div>
  );
}
