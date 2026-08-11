import React from "react";
import {
  LayoutGrid, CalendarDays, LibraryBig, Sparkles, BarChart3, PenLine,
  Archive as ArchiveIcon, Settings as SettingsIcon
} from "lucide-react";
import { Toggle } from "./ui";

export const NAV = [
  ["dashboard", "Dashboard", LayoutGrid],
  ["calendar", "Calendar", CalendarDays],
  ["library", "Content Library", LibraryBig],
  ["trends", "Trend Library", Sparkles],
  ["analytics", "Analytics", BarChart3],
  ["planning", "Planning", PenLine],
  ["archive", "Archive", ArchiveIcon],
  ["settings", "Settings", SettingsIcon],
];

export default function Sidebar({ page, setPage, db, update }) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col px-4 py-6 gap-6 border-r" style={{ background: "var(--panel-2)", borderColor: "var(--sep)" }}>
      <div className="flex items-center gap-2.5 px-2">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center font-bold serif text-white text-[15px]" style={{ background: "var(--accent)" }}>S</div>
        <div>
          <div className="font-semibold serif text-[14.5px] leading-none">{db.settings.brand.name}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--sub)" }}>Content OS · 2026</div>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setPage(id)} className={`navitem flex items-center gap-3 px-3 py-2 text-[14px] font-medium ${page === id ? "active" : ""}`}>
            <Icon size={17} strokeWidth={page === id ? 2.3 : 2} /> {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto card p-3.5 text-[12px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold" style={{ color: "var(--ink)" }}>Client View</span>
          <Toggle on={db.settings.clientView} onClick={() => update(n => { n.settings.clientView = !n.settings.clientView; return n; })} />
        </div>
        <span style={{ color: "var(--sub)" }}>Client faqat calendar, posted content va analytics ko'radi.</span>
      </div>
    </aside>
  );
}
