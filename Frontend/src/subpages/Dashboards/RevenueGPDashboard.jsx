import { useState } from "react";

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

      
      .progress-bar { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; margin-top: 6px; }
      .progress-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

      .section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 6px; }
      .section-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
    `}</style>
  );
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const revenueData = [
  { month:"Jan", revenue:420000, gp:168000 }, { month:"Feb", revenue:385000, gp:157850 },
  { month:"Mar", revenue:510000, gp:214200 }, { month:"Apr", revenue:476000, gp:190400 },
  { month:"May", revenue:532000, gp:223440 }, { month:"Jun", revenue:498000, gp:209160 },
];
const revenueTableData = [
  { region:"North",   product:"Software", revenue:245000, cogs:122500, gp:122500, gp_pct:50, ytd:1420000, status:"Above Target" },
  { region:"South",   product:"Hardware", revenue:183000, cogs:109800, gp:73200,  gp_pct:40, ytd:1050000, status:"On Track"     },
  { region:"East",    product:"Services", revenue:312000, cogs:156000, gp:156000, gp_pct:50, ytd:1800000, status:"Above Target" },
  { region:"West",    product:"Software", revenue:198000, cogs:118800, gp:79200,  gp_pct:40, ytd:1140000, status:"Below Target" },
  { region:"Central", product:"Support",  revenue:134000, cogs:80400,  gp:53600,  gp_pct:40, ytd:760000,  status:"On Track"     },
];



const fmt = (n) => n >= 1e6 ? `₹${(n/1e6).toFixed(2)}M` : `₹${(n/1e3).toFixed(0)}K`;
const statusPill = (s) => {
  const map = { "Above Target":"pill-green", "On Track":"pill-blue", "Below Target":"pill-red" };
  return <span className={`pill ${map[s]||"pill-yellow"}`}>{s}</span>;
};

// ── Donut Chart ───────────────────────────────────────────────────────────────


function MiniBarChart({ data, valueKey, color }) {
  const max = Math.max(...data.map(d=>d[valueKey]));
  return (
    <div className="mini-bars">
      {data.map((d,i)=>(
        <div key={i} className="bar-wrap">
          <div className="bar" style={{height:`${(d[valueKey]/max)*86}px`,background:color}}/>
          <span className="bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Revenue Report ────────────────────────────────────────────────────────────
function RevenueReport() {
  const def = { dateFrom:"2025-01-01", dateTo:"2025-06-30", region:"", product:"", status:"" };
  const [filters, setFilters] = useState(def);
  const [applied, setApplied] = useState(def);
  const filtered = revenueTableData.filter(r=>
    (!applied.region||r.region===applied.region)&&
    (!applied.product||r.product===applied.product)&&
    (!applied.status||r.status===applied.status)
  );
  const totalRev = filtered.reduce((a,b)=>a+b.revenue,0);
  const totalGP  = filtered.reduce((a,b)=>a+b.gp,0);
  const avgGPPct = filtered.length?(filtered.reduce((a,b)=>a+b.gp_pct,0)/filtered.length).toFixed(1):0;
  return (
    <div>
      <div className="section-title">Revenue & GP Report</div>
      <div className="section-sub">Financial performance overview · FY 2025</div>
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Date From</span>
          <input type="date" className="filter-input" value={filters.dateFrom} onChange={e=>setFilters(f=>({...f,dateFrom:e.target.value}))}/>
        </div>
        <div className="filter-group">
          <span className="filter-label">Date To</span>
          <input type="date" className="filter-input" value={filters.dateTo} onChange={e=>setFilters(f=>({...f,dateTo:e.target.value}))}/>
        </div>
        <div className="filter-group">
          <span className="filter-label">Region</span>
          <select className="filter-select" value={filters.region} onChange={e=>setFilters(f=>({...f,region:e.target.value}))}>
            <option value="">All Regions</option>
            {["North","South","East","West","Central"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Product</span>
          <select className="filter-select" value={filters.product} onChange={e=>setFilters(f=>({...f,product:e.target.value}))}>
            <option value="">All Products</option>
            {["Software","Hardware","Services","Support"].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Status</span>
          <select className="filter-select" value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))}>
            <option value="">All Statuses</option>
            {["Above Target","On Track","Below Target"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-actions">
          <button className="btn btn-primary" onClick={()=>setApplied(filters)}>Apply</button>
          <button className="btn btn-ghost" onClick={()=>{setFilters(def);setApplied(def);}}>Reset</button>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card blue"><div className="kpi-label">Total Revenue</div><div className="kpi-value">{fmt(totalRev)}</div><div className="kpi-change up">▲ 9.3% vs last period</div></div>
        <div className="kpi-card green"><div className="kpi-label">Gross Profit</div><div className="kpi-value">{fmt(totalGP)}</div><div className="kpi-change up">▲ 11.2% vs last period</div></div>
        <div className="kpi-card yellow"><div className="kpi-label">GP Margin</div><div className="kpi-value">{avgGPPct}%</div><div className="kpi-change up">▲ 1.4pp vs last period</div></div>
        <div className="kpi-card red"><div className="kpi-label">COGS</div><div className="kpi-value">{fmt(totalRev-totalGP)}</div><div className="kpi-change down">▼ 2.1% efficiency gain</div></div>
      </div>
      <div className="chart-row">
        <div className="chart-card"><div className="chart-card-title">Monthly Revenue</div><MiniBarChart data={revenueData} valueKey="revenue" color="var(--accent)"/></div>
        <div className="chart-card"><div className="chart-card-title">Monthly Gross Profit</div><MiniBarChart data={revenueData} valueKey="gp" color="var(--accent2)"/></div>
      </div>
      <div className="table-card">
        <div className="table-header"><span className="table-title">Revenue Breakdown by Region</span><span style={{fontSize:12,color:"var(--muted)"}}>{filtered.length} records</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Region</th><th>Product</th><th>Revenue</th><th>COGS</th><th>Gross Profit</th><th>GP%</th><th>YTD</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((r,i)=>(
                <tr key={i}>
                  <td>{r.region}</td><td>{r.product}</td>
                  <td style={{fontFamily:"Syne,sans-serif",fontWeight:600}}>{fmt(r.revenue)}</td>
                  <td style={{color:"var(--muted)"}}>{fmt(r.cogs)}</td>
                  <td style={{color:"var(--accent2)",fontWeight:600}}>{fmt(r.gp)}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span>{r.gp_pct}%</span>
                      <div className="progress-bar" style={{width:60,display:"inline-block"}}>
                        <div className="progress-fill" style={{width:`${r.gp_pct}%`,background:"var(--accent2)"}}/>
                      </div>
                    </div>
                  </td>
                  <td style={{color:"var(--muted)"}}>{fmt(r.ytd)}</td>
                  <td>{statusPill(r.status)}</td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--muted)",padding:32}}>No records match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




// ── Nav ───────────────────────────────────────────────────────────────────────
const navItems = [
  { id:"revenue",   label:"Revenue & GP",      icon:"📈" },
];


// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  return (
    <div className="theme-toggle" onClick={onToggle} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
      <div className={`toggle-opt${theme==="dark"?" active":""}`}>🌙</div>
      <div className={`toggle-opt${theme==="light"?" active":""}`}>☀️</div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function RevenueGPDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive]       = useState("revenue");
  const [theme, setTheme]         = useState("dark");

  return (
    <>
      <GlobalStyle theme={theme} />
      <div className="layout">
        <aside className={`sidebar${collapsed?" collapsed":""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            {!collapsed && <span className="logo-text">AnalyticsOS</span>}
          </div>
          {!collapsed && <div className="sidebar-section-label">Reports</div>}
          {navItems.map(n=>(
            <div key={n.id} className={`nav-item${active===n.id?" active":""}`} onClick={()=>setActive(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {!collapsed && <span className="nav-label">{n.label}</span>}
            </div>
          ))}
          
          <div className="sidebar-toggle" onClick={()=>setCollapsed(c=>!c)}>
            <span style={{fontSize:18}}>{collapsed?"→":"←"}</span>
            {!collapsed && <span>Collapse</span>}
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <span className="page-title">{navItems.find(n=>n.id===active)?.label||"Dashboard"}</span>
            <div className="topbar-right">
              <span className="badge">Live</span>
              <span style={{fontSize:13,color:"var(--muted)"}}>FY 2025</span>
              <ThemeToggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")} />
              
            </div>
          </header>
          <main className="content">
            {active==="revenue"   && <RevenueReport/>}
      
          </main>
        </div>
      </div>
    </>
  );
}