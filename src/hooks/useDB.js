import { useState, useEffect, useRef, useCallback } from "react";
import { migrateDB } from "../helpers";

const STORAGE_KEY = "smm_os_db_v1";

function defaultDB() {
  return {
    settings: {
      dark: false,
      clientView: false,
      brand: { name: "Studio Nova", contact: "@studionova · +998 90 000 00 00" },
    },
    days: {},
    trends: [],
    planning: {},
  };
}

/**
 * Persists the whole app state to the browser's localStorage.
 * Reads synchronously on first render (no loading flicker), runs a
 * non-destructive migration so older records gain the fields the new
 * lifecycle/analytics features need, then debounces writes so rapid
 * typing doesn't hammer localStorage.
 */
export function useDB() {
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const migrated = migrateDB(JSON.parse(raw));
        if (migrated) {
          // Persist the migrated shape immediately so it's stable on next load.
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)); } catch (e) {}
          return migrated;
        }
      }
    } catch (e) {
      console.warn("smm-os: could not read localStorage, starting fresh.", e);
    }
    return defaultDB();
  });

  const saveTimer = useRef(null);

  const persist = useCallback((next) => {
    setDb(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("smm-os: failed to save to localStorage", e);
      }
    }, 250);
  }, []);

  // flush pending save on tab close
  useEffect(() => {
    const flush = () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch (e) {}
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const resetDB = useCallback(() => {
    const fresh = defaultDB();
    setDb(fresh);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch (e) {}
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `smm-os-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [db]);

  const importJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const migrated = migrateDB(parsed) || parsed;
        persist(migrated);
      } catch (e) {
        alert("Fayl noto'g'ri formatda.");
      }
    };
    reader.readAsText(file);
  }, [persist]);

  return [db, persist, { resetDB, exportJSON, importJSON }];
}
