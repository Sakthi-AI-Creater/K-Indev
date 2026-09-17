import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── Inject Google Fonts ──────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

// ── Theme tokens ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    "--bg":       "#0d0f14",
    "--surface":  "#13161e",
    "--surface2": "#1a1e29",
    "--surface3": "#222635",
    "--border":   "#2a2e3f",
    "--text":     "#e8ecf5",
    "--muted":    "#7b82a0",
    "--shadow":   "rgba(0,0,0,0.4)",
  },
  light: {
    "--bg":       "#f0f2f8",
    "--surface":  "#ffffff",
    "--surface2": "#f5f6fa",
    "--surface3": "#eaecf4",
    "--border":   "#dde0ee",
    "--text":     "#1a1d2e",
    "--muted":    "#8a90aa",
    "--shadow":   "rgba(100,110,160,0.12)",
  },
};

// ── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = ({ theme }) => {
  const tokens = THEMES[theme];
  const vars = Object.entries(tokens).map(([k, v]) => `${k}: ${v};`).join("\n");
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        ${vars}
        --accent:  #5b8cff;
        --accent2: #38e8c5;
        --accent3: #f7b731;
        --danger:  #ff5e7a;
        --sidebar-w: 240px;
        --sidebar-collapsed: 64px;
        --tr: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      }

      body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; transition: var(--tr); }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: var(--surface); }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

      .layout { display: flex; min-height: 100vh; }

      /* Sidebar */
      .sidebar {
        width: var(--sidebar-w);
        background: var(--surface);
        border-right: 1px solid var(--border);
        display: flex; flex-direction: column;
        transition: width 0.3s cubic-bezier(.4,0,.2,1), background 0.25s, border-color 0.25s;
        overflow: hidden; flex-shrink: 0;
        position: sticky; top: 0; height: 100vh;
        box-shadow: 2px 0 12px var(--shadow);
      }
      .sidebar.collapsed { width: var(--sidebar-collapsed); }

      .sidebar-logo {
        display: flex; align-items: center; gap: 12px;
        padding: 20px 16px; border-bottom: 1px solid var(--border); min-height: 64px;
      }
      .logo-icon {
        width: 32px; height: 32px;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        border-radius: 8px; display: flex; align-items: center;
        justify-content: center; font-size: 16px; flex-shrink: 0;
      }
      .logo-text {
        font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px;
        letter-spacing: 0.5px; white-space: nowrap; overflow: hidden;
      }
      .sidebar-section-label {
        font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
        text-transform: uppercase; color: var(--muted);
        padding: 20px 18px 8px; white-space: nowrap; overflow: hidden;
      }
      .nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 16px; cursor: pointer; border-radius: 8px;
        margin: 2px 8px; transition: background 0.15s, color 0.15s;
        color: var(--muted); white-space: nowrap; overflow: hidden;
        font-size: 13.5px; font-weight: 500;
      }
      .nav-item:hover { background: var(--surface2); color: var(--text); }
      .nav-item.active {
        background: linear-gradient(90deg, rgba(91,140,255,0.18) 0%, rgba(91,140,255,0.04) 100%);
        color: var(--accent); border-left: 2px solid var(--accent); margin-left: 6px;
      }
      .nav-icon { font-size: 18px; flex-shrink: 0; width: 22px; text-align: center; }
      .nav-label { overflow: hidden; text-overflow: ellipsis; }
      .sidebar-toggle {
        margin: auto 8px 16px; display: flex; align-items: center; gap: 10px;
        padding: 10px 16px; cursor: pointer; border-radius: 8px;
        color: var(--muted); font-size: 13px; transition: background 0.15s;
      }
      .sidebar-toggle:hover { background: var(--surface2); color: var(--text); }

      /* Main */
      .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
      .topbar {
        height: 64px; background: var(--surface); border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 28px; flex-shrink: 0; box-shadow: 0 2px 8px var(--shadow);
        transition: var(--tr);
      }
      .page-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
      .topbar-right { display: flex; align-items: center; gap: 14px; }

      /* Theme toggle */
      .theme-toggle {
        display: flex; align-items: center;
        background: var(--surface2); border: 1.5px solid var(--border);
        border-radius: 28px; padding: 3px; cursor: pointer; gap: 2px;
        transition: border-color 0.2s; user-select: none;
      }
      .theme-toggle:hover { border-color: var(--accent); }
      .toggle-opt {
        display: flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 22px; font-size: 15px;
        transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
      }
      .toggle-opt.active {
        background: var(--accent);
        box-shadow: 0 2px 10px rgba(91,140,255,0.45);
        transform: scale(1.08);
      }

      .avatar {
        width: 34px; height: 34px;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: 700; color: #fff;
      }
      .badge {
        background: var(--accent); color: #fff; font-size: 11px; font-weight: 600;
        padding: 2px 8px; border-radius: 20px;
      }
      .content { flex: 1; overflow-y: auto; padding: 28px; background: var(--bg); transition: var(--tr); }

      /* Filter bar */
      .filter-bar {
        display: flex; flex-wrap: wrap; gap: 12px;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;
        align-items: flex-end; box-shadow: 0 2px 8px var(--shadow); transition: var(--tr);
      }
      .filter-group { display: flex; flex-direction: column; gap: 5px; min-width: 140px; }
      .filter-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
      .filter-input, .filter-select {
        background: var(--surface2); border: 1px solid var(--border); color: var(--text);
        padding: 8px 12px; border-radius: 8px; font-family: 'DM Sans', sans-serif;
        font-size: 13px; outline: none; transition: border-color 0.15s, background 0.25s, color 0.25s; cursor: pointer;
      }
      .filter-input:focus, .filter-select:focus { border-color: var(--accent); }
      .filter-select option { background: var(--surface2); color: var(--text); }
      .filter-actions { display: flex; gap: 8px; align-items: flex-end; }
      .btn {
        padding: 8px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif;
        font-size: 13px; font-weight: 500; cursor: pointer; border: none;
        transition: opacity 0.15s, transform 0.1s;
      }
      .btn:active { transform: scale(0.97); }
      .btn-primary { background: var(--accent); color: #fff; }
      .btn-primary:hover { opacity: 0.85; }
      .btn-ghost { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
      .btn-ghost:hover { color: var(--text); border-color: var(--accent); }

      /* KPI cards */
      .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .kpi-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
        padding: 20px; position: relative; overflow: hidden;
        box-shadow: 0 2px 8px var(--shadow); transition: var(--tr), transform 0.15s;
      }
      .kpi-card:hover { transform: translateY(-2px); }
      .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
      .kpi-card.blue::before  { background: var(--accent);  }
      .kpi-card.green::before { background: var(--accent2); }
      .kpi-card.yellow::before{ background: var(--accent3); }
      .kpi-card.red::before   { background: var(--danger);  }
      .kpi-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
      .kpi-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; margin-bottom: 6px; }
      .kpi-change { font-size: 12px; }
      .kpi-change.up   { color: var(--accent2); }
      .kpi-change.down { color: var(--danger); }

      /* Tables */
      .table-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
        overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 8px var(--shadow); transition: var(--tr);
      }
      .table-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
      .table-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
      .table-scroll { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th {
        text-align: left; padding: 11px 18px; font-size: 11px; font-weight: 600;
        color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px;
        background: var(--surface2); border-bottom: 1px solid var(--border);
        white-space: nowrap; transition: var(--tr);
      }
      td { padding: 12px 18px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; transition: var(--tr); }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: var(--surface2); }

      .pill { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      .pill-green  { background: rgba(56,232,197,0.15); color: var(--accent2); }
      .pill-blue   { background: rgba(91,140,255,0.15); color: var(--accent); }
      .pill-yellow { background: rgba(247,183,49,0.15); color: var(--accent3); }
      .pill-red    { background: rgba(255,94,122,0.15); color: var(--danger); }

      /* Charts */
      .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
      @media (max-width: 900px) { .chart-row { grid-template-columns: 1fr; } }
      .chart-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
        padding: 20px; box-shadow: 0 2px 8px var(--shadow); transition: var(--tr);
      }
      .chart-card-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 16px; }
      .mini-bars { display: flex; align-items: flex-end; gap: 6px; height: 100px; }
      .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
      .bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.6s cubic-bezier(.4,0,.2,1); }
      .bar-label { font-size: 10px; color: var(--muted); }

      .donut-wrap { display: flex; align-items: center; gap: 20px; }
      .donut-legend { display: flex; flex-direction: column; gap: 8px; font-size: 12px; }
      .legend-item { display: flex; align-items: center; gap: 8px; }
      .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

      /* Ownership */
      .ownership-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .ownership-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
        padding: 18px 20px; box-shadow: 0 2px 8px var(--shadow); transition: var(--tr), transform 0.15s;
      }
      .ownership-card:hover { transform: translateY(-2px); }
      .ownership-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
      .ownership-role { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
      .ownership-stat { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid var(--border); }
      .ownership-stat:last-child { border-bottom: none; }
      .progress-bar { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; margin-top: 6px; }
      .progress-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

      .section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 6px; }
      .section-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
    `}</style>
  );
};



const navItems = [
  {
    id: "revenue-gp",
    label: "Revenue & GP Report",
    icon: "📈",
    path: "/revenue-dashboard",
  },
  {
    id: "ownership",
    label: "Ownership Report",
    icon: "🏢",
    path: "/ownership-dashboard",
  },
];

function ThemeToggle({ theme, onToggle }) {
  return (
    <div
      className="theme-toggle"
      onClick={onToggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className={`toggle-opt${theme === "dark" ? " active" : ""}`}>
        🌙
      </div>

      <div className={`toggle-opt${theme === "light" ? " active" : ""}`}>
        ☀️
      </div>
    </div>
  );
}

export default function KindevDashboard() {

  const [collapsed, setCollapsed] = useState(false);

  const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <>
      <GlobalStyle theme={theme} />

      <div className="layout">

        {/* SIDEBAR */}
        <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>

          {/* LOGO */}
          <div className="sidebar-logo">

            <div className="logo-icon">
              ⚡
            </div>

            

          </div>

          {/* REPORT LABEL */}
          {!collapsed && (
            <div className="sidebar-section-label">
              Reports
            </div>
          )}

          {/* NAVIGATION */}
          {navItems.map((n) => (

            <div
              key={n.id}
              className={`nav-item${
                location.pathname === n.path
                  ? " active"
                  : ""
              }`}
              onClick={() => navigate(n.path)}
            >

              <span className="nav-icon">
                {n.icon}
              </span>

              {!collapsed && (
                <span className="nav-label">
                  {n.label}
                </span>
              )}

            </div>
          ))}

          {/* COLLAPSE BUTTON */}
          <div
            className="sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
          >

            <span style={{ fontSize: 18 }}>
              {collapsed ? "→" : "←"}
            </span>

            {!collapsed && (
              <span>
                Collapse
              </span>
            )}

          </div>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* TOPBAR */}
          <header className="topbar">

            

            <div className="topbar-right">

              

              

              <ThemeToggle
                theme={theme}
                onToggle={() =>
                  setTheme((t) =>
                    t === "dark"
                      ? "light"
                      : "dark"
                  )
                }
              />

            </div>
          </header>

          {/* CONTENT */}
          <main className="content">

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >

              

              {/* CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 20,
                }}
              >

                {/* REVENUE CARD */}
                <div
                  className="kpi-card blue"
                  style={{
                    cursor: "pointer",
                    minHeight: 180,
                  }}
                  onClick={() =>
                    navigate("/revenue-gp-report")
                  }
                >

                  <div
                    style={{
                      fontSize: 42,
                      marginBottom: 16,
                    }}
                  >
                    📈
                  </div>

                  <div className="kpi-value">
                    Revenue & GP
                  </div>

                  <div
                    className="section-sub"
                    style={{
                      marginTop: 10,
                    }}
                  >
                    View revenue analysis,
                    gross profit,
                    KPIs and trends.
                  </div>

                </div>

                {/* OWNERSHIP CARD */}
                <div
                  className="kpi-card green"
                  style={{
                    cursor: "pointer",
                    minHeight: 180,
                  }}
                  onClick={() =>
                    navigate("/ownership-report")
                  }
                >

                  <div
                    style={{
                      fontSize: 42,
                      marginBottom: 16,
                    }}
                  >
                    🏢
                  </div>

                  <div className="kpi-value">
                    Ownership Report
                  </div>

                  <div
                    className="section-sub"
                    style={{
                      marginTop: 10,
                    }}
                  >
                    View partner ownership,
                    equity distribution
                    and performance insights.
                  </div>

                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </>
  );
}