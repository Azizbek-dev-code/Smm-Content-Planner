export const YEAR = 2026;
export const MONTHS = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
export const WEEKDAYS = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
export const CONTENT_TYPES = ["Reels","Post","Carousel","Story","Live"];
export const GOALS = ["Sales","Reach","Engagement","Trust","Brand","Lead"];

// Real content lifecycle. Codes are lowercase (used as data values everywhere);
// labels are what's shown in the UI. Keep these two in sync.
export const STATUSES = ["planned","processed","uploaded","posted","analyzed","archived"];
export const STATUS_LABELS = {
  planned: "Planned",
  processed: "Processed",
  uploaded: "Uploaded",
  posted: "Posted",
  analyzed: "Analyzed",
  archived: "Archived",
};
export const STATUS_COLOR = {
  planned:   "#8E8E93",
  processed: "#FF9500",
  uploaded:  "#5E5CE6",
  posted:    "#0A84FF",
  analyzed:  "#34C759",
  archived:  "#1D1D1F",
};
// What each status becomes after its primary action, and the label for that action.
export const NEXT_STATUS = {
  planned:   { next: "processed", actionLabel: "Processed deb belgilash", tsField: "processedAt" },
  processed: { next: "uploaded",  actionLabel: "Uploaded deb belgilash",  tsField: "uploadedAt" },
  uploaded:  { next: "posted",    actionLabel: "Posted deb belgilash",    tsField: "postedAt" },
  // posted -> analyzed happens via the Analytics Entry modal, not a plain "next" click
  analyzed:  { next: "archived",  actionLabel: "Arxivga o'tkazish",       tsField: "archivedAt" },
};

export const ANALYTICS_HOLD_HOURS = 48;

export const SHOT_DEFAULT = ["Showroom","Mahsulot yaqin plan","Mahsulot uzoq plan","B-roll","Mijoz","Yetkazib berish","Oldin/Keyin","Detallar","Narx kadri","Logo","Close-up","Walking shot"];
export const CHECK_DEFAULT = ["Script tayyor","Reference topildi","Kadr olindi","B-roll olindi","Voice yozildi","Montaj tugadi","Subtitle qo'shildi","Cover tayyor","Upload qilindi","Analytics yozildi"];
export const LESSON_TAGS = ["Hook kuchsiz","Intro uzun","Audio noto'g'ri","Yorug'lik yomon","Subtitle kichik","CTA ishlamadi","Trend kechikdi","Montaj sekin","Reference noto'g'ri"];
export const LIB_CATS = ["Sales","Trend","Trust","Product","Funny","Social proof","Showroom","Educational"];
export const STRATEGY_ITEMS = ["Competitor research","Trend research","Reference video yig'ish","Next month planning","Analytics review","Creative ideas","Content brainstorm"];

export const EDITOR_TABS = [
  ["script","Script"],["story","Story/Post"],["reference","Reference"],["shot","Shot List"],
  ["edit","Montaj"],["checklist","Checklist"],["analytics","Analytics"],["lessons","Lessons"]
];

export const ANALYTICS_FIELDS = {
  performance: [
    ["views","Views"],["reach","Reach"],["likes","Likes"],["comments","Comments"],
    ["shares","Shares"],["saves","Saves"],["profileVisits","Profile visits"],["dm","DM"],["clicks","Clicks"],
  ],
  conversion: [
    ["leads","Leads"],["sales","Sales"],
  ],
  financial: [
    ["adSpend","Ad spend (UZS)"],["revenue","Revenue (UZS)"],["otherCosts","Other costs (UZS)"],
  ],
};

export const PERIODS = [
  ["today","Bugun"],["7d","7 kun"],["30d","30 kun"],["month","Shu oy"],["all","Barchasi"],
];
