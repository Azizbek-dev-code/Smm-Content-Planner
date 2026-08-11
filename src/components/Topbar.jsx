import React from "react";
import { Search, Moon, Sun } from "lucide-react";

const TITLES = {
  dashboard: "Dashboard", calendar: "Calendar", library: "Content Library", trends: "Trend Library",
  analytics: "Analytics", planning: "Monthly Planning", archive: "Archive", settings: "Settings"
};

export default function Topbar({ page, db, update, search, setSearch, setPage }) {
  return (
    <header className="sticky top-0 z-20 frosted px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 border-b" style={{ borderColor: "var(--sep)" }}>
      <div>
        <h1 className="text-[22px] md:text-[26px] font-bold serif tracking-tight">{TITLES[page]}</h1>
        <div className="text-[12px]" style={{ color: "var(--sub)" }}>{new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "var(--panel-2)" }}>
          <Search size={14} style={{ color: "var(--sub)" }} />
          <input
            className="border-none bg-transparent w-44 text-[13.5px] outline-none"
            placeholder="Qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") setPage(page === "trends" ? "trends" : "library"); }}
          />
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--panel-2)" }} onClick={() => update(n => { n.settings.dark = !n.settings.dark; return n; })}>
          {db.settings.dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px]" style={{ background: "var(--accent)" }}>
          {(db.settings.brand.name || "S")[0]}
        </div>
      </div>
    </header>
  );
}
