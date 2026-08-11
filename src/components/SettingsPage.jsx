import React, { useRef, useState } from "react";
import { Download, Upload, Trash2, HardDrive, CheckCircle2 } from "lucide-react";
import { Field, Toggle } from "./ui";

export default function SettingsPage({ db, update, dbActions }) {
  const fileRef = useRef(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const dayCount = Object.keys(db.days || {}).filter(k => db.days[k].title).length;
  const trendCount = (db.trends || []).length;

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) dbActions.importJSON(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 4000); return; }
    dbActions.resetDB();
    setConfirmReset(false);
  };

  return (
    <div className="fadein space-y-5 max-w-xl">
      <div className="card p-5 space-y-3">
        <div className="text-[16px] font-semibold serif">Brand</div>
        <Field label="Kompaniya nomi" value={db.settings.brand.name} onChange={v => update(n => { n.settings.brand.name = v; return n; })} />
        <Field label="Aloqa ma'lumotlari" value={db.settings.brand.contact} onChange={v => update(n => { n.settings.brand.contact = v; return n; })} />
      </div>

      <div className="card p-5 space-y-3">
        <div className="text-[16px] font-semibold serif">Ko'rinish</div>
        <label className="flex items-center justify-between text-[13.5px]">Dark mode
          <Toggle on={db.settings.dark} onClick={() => update(n => { n.settings.dark = !n.settings.dark; return n; })} />
        </label>
        <label className="flex items-center justify-between text-[13.5px]">Client View
          <Toggle on={db.settings.clientView} onClick={() => update(n => { n.settings.clientView = !n.settings.clientView; return n; })} />
        </label>
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 text-[16px] font-semibold serif">
          <HardDrive size={17} style={{ color: "var(--accent)" }} /> Ma'lumotlar (localStorage)
        </div>
        <div className="flex items-center gap-2 text-[12.5px] pill px-3 py-2 w-fit" style={{ color: "var(--green)", borderColor: "var(--green)" }}>
          <CheckCircle2 size={14} /> Barcha ma'lumot brauzeringizda avtomatik saqlanadi
        </div>
        <div className="text-[12.5px]" style={{ color: "var(--sub)" }}>
          {dayCount} ta content · {trendCount} ta trend saqlangan
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button className="btn-primary px-4 py-2 text-[13px] flex items-center gap-1.5" onClick={dbActions.exportJSON}>
            <Download size={14} /> Backup yuklab olish
          </button>
          <button className="btn-ghost px-4 py-2 text-[13px] flex items-center gap-1.5" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Backup'dan tiklash
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      <div className="card p-5 space-y-2">
        <div className="text-[16px] font-semibold serif" style={{ color: "var(--red)" }}>Xavfli zona</div>
        <div className="text-[12.5px]" style={{ color: "var(--sub)" }}>Barcha content, trend va planning ma'lumotlari butunlay o'chadi.</div>
        <button
          className="px-4 py-2 text-[13px] rounded-full font-semibold flex items-center gap-1.5"
          style={{ background: confirmReset ? "var(--red)" : "transparent", color: confirmReset ? "#fff" : "var(--red)", border: "1px solid var(--red)" }}
          onClick={handleReset}
        >
          <Trash2 size={14} /> {confirmReset ? "Tasdiqlash uchun yana bosing" : "Barcha ma'lumotni tozalash"}
        </button>
      </div>
    </div>
  );
}
