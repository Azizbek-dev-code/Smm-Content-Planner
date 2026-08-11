import React from "react";

export default function GlobalStyle() {
  return (
    <style>{`
      :root{
        --bg-a:#EEF0F5; --bg-b:#E6E9F2; --bg-c:#EDEFF6;
        --panel:#FFFFFF; --panel-2:#F5F6F8; --ink:#0D0D12; --sub:#8A8A92; --line:#E4E4E9;
        --accent:#0A84FF; --accent-soft:#E8F2FF;
        --ember:#FF9500; --ember-soft:#FFF2E0;
        --green:#34C759; --green-soft:#E6F9EB;
        --red:#FF3B30; --red-soft:#FFEBEA;
        --purple:#AF52DE;
        --shadow: 0 1px 1px rgba(20,20,30,.03), 0 10px 24px -14px rgba(20,20,30,.16);
        --shadow-lg: 0 8px 16px -8px rgba(20,20,30,.12), 0 30px 60px -30px rgba(20,20,30,.28);
        --sep: rgba(60,60,67,.1);
      }
      .dark{
        --bg-a:#0B0B10; --bg-b:#111116; --bg-c:#0D0D12;
        --panel:#1C1C1E; --panel-2:#141416; --ink:#F5F5F7; --sub:#98989F; --line:#2C2C2E;
        --accent:#0A84FF; --accent-soft:#0F2A47;
        --ember:#FF9F0A; --ember-soft:#3A2A0F;
        --green:#30D158; --green-soft:#0F2A18;
        --red:#FF453A; --red-soft:#3A1613;
        --purple:#BF5AF2;
        --shadow: 0 1px 1px rgba(0,0,0,.3), 0 10px 24px -14px rgba(0,0,0,.55);
        --shadow-lg: 0 8px 20px -8px rgba(0,0,0,.5), 0 30px 60px -30px rgba(0,0,0,.75);
        --sep: rgba(84,84,88,.5);
      }

      .smmroot{
        font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter',ui-sans-serif,sans-serif;
        color:var(--ink);
        min-height:100vh;
        letter-spacing:-.01em;
        background:
          radial-gradient(circle at 18% 0%, rgba(10,132,255,.06), transparent 45%),
          radial-gradient(circle at 85% 8%, rgba(255,149,0,.05), transparent 40%),
          linear-gradient(180deg, var(--bg-a), var(--bg-b) 60%, var(--bg-c));
        transition:background .3s ease, color .3s ease;
        -webkit-font-smoothing:antialiased;
      }
      .serif{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter',sans-serif; letter-spacing:-.02em}

      /* ===== surfaces ===== */
      .glass-panel{background:var(--panel);border-radius:28px;box-shadow:var(--shadow-lg)}
      .card{background:var(--panel);border:1px solid var(--sep);border-radius:20px;box-shadow:var(--shadow)}
      .pill{border:1px solid var(--sep);border-radius:999px;background:var(--panel)}

      /* iOS grouped list row */
      .ios-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--panel);border-bottom:1px solid var(--sep)}
      .ios-row:last-child{border-bottom:none}
      .ios-group{border-radius:16px;overflow:hidden;box-shadow:var(--shadow)}

      /* ===== nav ===== */
      .navitem{color:var(--sub);border-radius:12px;transition:background .15s ease, color .15s ease}
      .navitem.active{background:var(--accent-soft);color:var(--accent);font-weight:600}
      .navitem:active{transform:scale(.98)}

      /* ===== buttons ===== */
      .btn-primary{background:var(--accent);color:#fff;border:none;font-weight:600;border-radius:14px;transition:transform .1s ease, filter .1s ease}
      .btn-primary:hover{filter:brightness(1.06)}
      .btn-primary:active{transform:scale(.97)}
      .btn-ghost{border:1px solid var(--sep);border-radius:14px;color:var(--ink);background:var(--panel-2);transition:transform .1s ease}
      .btn-ghost:hover{border-color:var(--accent)}
      .btn-ghost:active{transform:scale(.97)}

      /* ===== inputs ===== */
      .field{background:var(--panel-2);border:1px solid transparent;color:var(--ink);border-radius:12px;padding:9px 12px;font-size:14px;width:100%;transition:border-color .12s ease, background .12s ease}
      .field::placeholder{color:var(--sub)}
      .field:focus{outline:none;border-color:var(--accent);background:var(--panel)}
      .lbl{font-size:11px;letter-spacing:.01em;color:var(--sub);font-weight:600;margin-bottom:5px;display:block}

      /* ===== segmented control (tabs) ===== */
      .segwrap{display:inline-flex;gap:2px;background:var(--panel-2);border-radius:12px;padding:3px}
      .tabchip{border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;white-space:nowrap;cursor:pointer;border:1px solid var(--sep);color:var(--sub);background:var(--panel);transition:all .15s ease}
      .tabchip.active{background:var(--ink);color:var(--panel);border-color:var(--ink)}
      .tabchip:active{transform:scale(.96)}

      .checkbox{width:20px;height:20px;accent-color:var(--accent);border-radius:6px;cursor:pointer}
      .statusdot{width:8px;height:8px;border-radius:50%;box-shadow:0 0 0 3px color-mix(in srgb, currentColor 18%, transparent)}

      .bars{display:flex;align-items:flex-end;gap:6px;height:56px}
      .bar{flex:1;border-radius:8px 8px 3px 3px;background:var(--panel-2);min-height:6px;transition:height .35s cubic-bezier(.2,.8,.3,1)}
      .bar.hi{background:linear-gradient(180deg,var(--accent),#5AC8FA)}

      .donut{border-radius:50%;display:flex;align-items:center;justify-content:center;background:conic-gradient(var(--accent) calc(var(--val)*1%), var(--panel-2) 0);transition:background .5s ease}
      .donut-inner{border-radius:50%;background:var(--panel);display:flex;flex-direction:column;align-items:center;justify-content:center}

      .avatar{width:28px;height:28px;border-radius:50%;border:2px solid var(--panel);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;margin-left:-8px}
      .avatar:first-child{margin-left:0}

      .badge-up{background:var(--green-soft);color:var(--green);font-weight:700;font-size:11px;border-radius:999px;padding:3px 10px}
      .badge-down{background:var(--ember-soft);color:var(--ember);font-weight:700;font-size:11px;border-radius:999px;padding:3px 10px}

      .daycard{transition:transform .15s cubic-bezier(.2,.8,.3,1), box-shadow .15s ease; cursor:pointer}
      .daycard:hover{transform:translateY(-2px)}
      .daycard:active{transform:scale(.97)}

      .fadein{animation:fadein .2s cubic-bezier(.2,.8,.3,1)}
      @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

      /* iOS bottom-sheet modal */
      .modalpop{animation:modalpop .32s cubic-bezier(.2,.9,.25,1.1)}
      @keyframes modalpop{from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:none}}
      .sheet-grabber{width:36px;height:5px;border-radius:999px;background:var(--sep);margin:10px auto 2px}

      .scrollbar-hide::-webkit-scrollbar{display:none}
      .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      ::-webkit-scrollbar{width:8px;height:8px}
      ::-webkit-scrollbar-thumb{background:rgba(120,120,140,.25);border-radius:8px}
      textarea.field{resize:vertical}

      .frosted{background:color-mix(in srgb, var(--panel) 78%, transparent);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px)}

      @media (max-width:768px){ .desktop-only{display:none !important} }
    `}</style>
  );
}
