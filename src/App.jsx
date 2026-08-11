import React, { useState } from "react";

import GlobalStyle from "./styles/GlobalStyle";
import { useDB } from "./hooks/useDB";
import { YEAR } from "./constants";
import { blankDay, dayKey } from "./helpers";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import Dashboard from "./components/Dashboard";
import CalendarPage from "./components/CalendarPage";
import LibraryPage from "./components/LibraryPage";
import TrendsPage from "./components/TrendsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import PlanningPage from "./components/PlanningPage";
import SettingsPage from "./components/SettingsPage";
import DayEditorModal from "./components/DayEditorModal";
import AnalyticsEntryModal from "./components/AnalyticsEntryModal";

export default function App() {
  const [db, setDbPersist, dbActions] = useDB();
  const [page, setPage] = useState("dashboard");
  const [calYear] = useState(YEAR);
  const [calMonth, setCalMonth] = useState(new Date().getFullYear() === YEAR ? new Date().getMonth() + 1 : 1);
  const [openKey, setOpenKey] = useState(null);        // full Day Editor
  const [analyticsKey, setAnalyticsKey] = useState(null); // quick Analytics Entry modal
  const [editorTab, setEditorTab] = useState("script");
  const [search, setSearch] = useState("");

  const update = (fn) => setDbPersist(fn(structuredClone(db)));

  // Read-only lookup — never mutates or persists. Used everywhere content is displayed.
  const getDay = (y, m, d) => {
    const k = dayKey(y, m, d);
    return db.days[k] || blankDay(y, m, d);
  };

  // Opening a day just shows the editor with a draft — nothing is written
  // to storage until the person explicitly presses "Saqlash".
  const openDay = (key) => { setOpenKey(key); setEditorTab("script"); };

  // Called only when the editor's Save button is pressed — commits the
  // whole edited day object back into the database in one write.
  const saveDay = (key, dayObj) => {
    update(next => { next.days[key] = dayObj; return next; });
    setOpenKey(null);
  };

  // Lifecycle transitions (planned→processed→uploaded→posted, archive) and
  // analytics entry are single, well-defined actions — they persist to
  // localStorage immediately, independent of the full-editor draft/save flow,
  // so status changes never get lost or accidentally reverted by a stale draft.
  const patchDayImmediate = (key, fn) => {
    update(next => {
      if (!next.days[key]) { const [y, m, d] = key.split("-").map(Number); next.days[key] = blankDay(y, m, d); }
      next.days[key] = fn(structuredClone(next.days[key]));
      return next;
    });
  };

  const openedDay = openKey ? getDay(...openKey.split("-").map(Number)) : null;
  const analyticsDay = analyticsKey ? getDay(...analyticsKey.split("-").map(Number)) : null;

  return (
    <div className="smmroot">
      <GlobalStyle />
      <div className="flex w-full" style={{ minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} db={db} update={update} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar page={page} db={db} update={update} search={search} setSearch={setSearch} setPage={setPage} />
          <main className="p-4 md:p-8 flex-1 pb-24 md:pb-10 overflow-y-auto">
            {page === "dashboard" && (
              <Dashboard db={db} onOpen={openDay} onEnterAnalytics={setAnalyticsKey} year={calYear} month={calMonth} />
            )}
            {page === "calendar" && (
              <CalendarPage db={db} getDay={getDay} year={calYear} month={calMonth} setMonth={setCalMonth} onOpen={openDay} />
            )}
            {page === "library" && (
              <LibraryPage db={db} onOpen={openDay} onEnterAnalytics={setAnalyticsKey} patchDayImmediate={patchDayImmediate} search={search} />
            )}
            {page === "trends" && <TrendsPage db={db} update={update} search={search} />}
            {page === "analytics" && <AnalyticsPage db={db} onOpen={openDay} />}
            {page === "planning" && (
              <PlanningPage db={db} update={update} getDay={getDay} year={calYear} month={calMonth} setMonth={setCalMonth} />
            )}
            {page === "archive" && (
              <LibraryPage db={db} onOpen={openDay} onEnterAnalytics={setAnalyticsKey} patchDayImmediate={patchDayImmediate} search={search} onlyArchived />
            )}
            {page === "settings" && <SettingsPage db={db} update={update} dbActions={dbActions} />}
          </main>
        </div>
      </div>
      <MobileNav page={page} setPage={setPage} />

      {openedDay && (
        <DayEditorModal
          key={openKey}
          initialDay={openedDay}
          editorTab={editorTab}
          setEditorTab={setEditorTab}
          onCancel={() => setOpenKey(null)}
          onSave={(dayObj) => saveDay(openKey, dayObj)}
          onLifecycleAction={(fn) => patchDayImmediate(openKey, fn)}
          onOpenAnalytics={() => { setAnalyticsKey(openKey); setOpenKey(null); }}
        />
      )}

      {analyticsDay && (
        <AnalyticsEntryModal
          key={"an-" + analyticsKey}
          day={analyticsDay}
          onClose={() => setAnalyticsKey(null)}
          onSave={(analytics) => {
            patchDayImmediate(analyticsKey, d => {
              d.analytics = analytics;
              if (d.status === "posted") { d.status = "analyzed"; d.analyzedAt = new Date().toISOString(); }
              return d;
            });
            setAnalyticsKey(null);
          }}
        />
      )}
    </div>
  );
}
