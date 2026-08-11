import React from "react";
import { NAV } from "./Sidebar";

export default function MobileNav({ page, setPage }) {
  const items = NAV.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 frosted border-t z-40 px-1 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))] flex justify-around" style={{ borderColor: "var(--sep)" }}>
      {items.map(([id, label, Icon]) => (
        <button key={id} onClick={() => setPage(id)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-transform active:scale-90" style={{ color: page === id ? "var(--accent)" : "var(--sub)" }}>
          <Icon size={22} strokeWidth={page === id ? 2.4 : 2} /> {label.split(" ")[0]}
        </button>
      ))}
    </nav>
  );
}
