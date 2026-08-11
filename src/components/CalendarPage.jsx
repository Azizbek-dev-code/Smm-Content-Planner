import React from "react";
import { MONTHS, WEEKDAYS, STATUS_COLOR } from "../constants";
import { daysInMonth, firstOffset, dayKey } from "../helpers";

export default function CalendarPage({ db, getDay, year, month, setMonth, onOpen }) {
  const offset = firstOffset(year, month);
  const n = daysInMonth(year, month);
  const cells = [...Array(offset).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
  return (
    <div className="fadein space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {MONTHS.map((mn, i) => (
          <button key={mn} onClick={() => setMonth(i + 1)} className={`tabchip ${month === i + 1 ? "active" : ""}`}>{mn}</button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold" style={{ color: "var(--sub)" }}>
        {WEEKDAYS.map(w => <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((d, i) => d === null ? <div key={i} /> : <DayCell key={i} y={year} m={month} d={d} day={getDay(year, month, d)} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function DayCell({ y, m, d, day, onOpen }) {
  const isStrategy = d === 1 || d === 16;
  const isToday = new Date().toDateString() === new Date(y, m - 1, d).toDateString();
  const has = !!day.title;
  return (
    <div
      onClick={() => onOpen(dayKey(y, m, d))}
      className="daycard card p-2 md:p-3 min-h-[76px] md:min-h-[100px] flex flex-col justify-between"
      style={{
        outline: isToday ? "2px solid var(--accent)" : "none",
        background: isStrategy ? "var(--accent-soft)" : "var(--panel)"
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{d}</span>
        {has && <span className="statusdot" style={{ background: STATUS_COLOR[day.status] }} />}
      </div>
      {isStrategy && <div className="text-[9px] font-bold" style={{ color: "var(--accent)" }}>STRATEGY DAY</div>}
      {has ? (
        <>
          <div className="text-[10.5px] md:text-[11.5px] leading-tight truncate font-medium">{day.title}</div>
          <div className="text-[9.5px] pill px-1.5 py-0.5 inline-block w-fit" style={{ color: "var(--sub)" }}>{day.type}</div>
        </>
      ) : <div className="text-[10.5px]" style={{ color: "var(--sub)" }}>+ qo'shish</div>}
    </div>
  );
}
