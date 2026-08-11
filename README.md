# SMM Studio OS — Content Strategy Dashboard (React + localStorage)

Professional SMM content-strategy dashboard: calendar, script/shot-list editor,
reference-video tracker, 48h analytics reminders, trend library, monthly
planning and strategy days — all persisted locally in the browser via
`localStorage`, no backend required.

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda `http://localhost:5173` oching.

## Production build

```bash
npm run build
npm run preview
```

`dist/` papkasini istalgan static hosting'ga (Vercel, Netlify, Cloudflare Pages,
oddiy nginx) joylashtirsangiz bo'ladi.

## Ma'lumotlar qayerda saqlanadi?

Hamma narsa `localStorage` kalitida (`smm_os_db_v1`) JSON sifatida saqlanadi —
100% brauzeringizda, hech qayerga yuborilmaydi. Settings sahifasidan:

- **Backup yuklab olish** — JSON fayl sifatida eksport
- **Backup'dan tiklash** — avval eksport qilingan JSON'ni import qilish
- **Barcha ma'lumotni tozalash** — localStorage'ni to'liq tozalash

Eslatma: localStorage brauzerga bog'liq (cache tozalansa yoki boshqa
brauzer/qurilmadan kirilsa ma'lumot ko'rinmaydi) — muhim ma'lumotlarni
muntazam backup qiling.

## Struktura

```
src/
├── App.jsx                  — root komponent, sahifalarni bog'laydi
├── constants.js              — status/tur/maqsad ro'yxatlari
├── helpers.js                 — sana va data-model funksiyalari
├── hooks/useDB.js             — localStorage persistence hook
├── styles/GlobalStyle.jsx     — dizayn tokenlari (CSS variables)
└── components/
    ├── ui.jsx                 — umumiy UI qismlar
    ├── Sidebar / Topbar / MobileNav
    ├── Dashboard / CalendarPage / LibraryPage / TrendsPage
    ├── AnalyticsPage / PlanningPage / SettingsPage
    └── DayEditorModal + editor/*Tab.jsx — kun tahrirlash oynasi
```

## Texnologiyalar

React 18, Vite, Tailwind CSS, lucide-react.
