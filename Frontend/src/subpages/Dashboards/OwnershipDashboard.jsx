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

// ── Mock Data ─────────────────────────────────────────────────────────────────

const ownershipData = [
  { name:"Arjun Mehta",  role:"Managing Director", equity:35, revenue:3200000, gp:1380000, deals:42, yoy:"+12%" },
  { name:"Priya Nair",   role:"Regional Director", equity:22, revenue:2100000, gp:882000,  deals:31, yoy:"+8%"  },
  { name:"Vikram Singh", role:"Partner",            equity:18, revenue:1750000, gp:735000,  deals:24, yoy:"+5%"  },
  { name:"Lakshmi Rao",  role:"Associate Partner", equity:15, revenue:1420000, gp:596400,  deals:19, yoy:"+15%" },
  { name:"Dev Krishnan", role:"Senior Associate",  equity:10, revenue:980000,  gp:411600,  deals:14, yoy:"+3%"  },
];
const donutColors = ["#5b8cff","#38e8c5","#f7b731","#ff5e7a","#c084fc"];

const fmt = (n) => n >= 1e6 ? `₹${(n/1e6).toFixed(2)}M` : `₹${(n/1e3).toFixed(0)}K`;


// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((a,b)=>a+b.equity,0);
  let offset = 0;
  const r=54,cx=70,cy=70,stroke=22,circ=2*Math.PI*r;
  const slices = data.map((d,i)=>{
    const dash=(d.equity/total)*circ;
    const s={dash,gap:circ-dash,offset,color:donutColors[i]};
    offset+=dash; return s;
  });
  return (
    <div className="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface3)" strokeWidth={stroke}/>
        {slices.map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset}
            style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%"}}/>
        ))}
        <text x={cx} y={cy-4} textAnchor="middle" fill="var(--text)" fontSize="12" fontFamily="Syne,sans-serif" fontWeight="700">{total}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fill="var(--muted)" fontSize="9">Total Equity</text>
      </svg>
      <div className="donut-legend">
        {data.map((d,i)=>(
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{background:donutColors[i]}}/>
            <span style={{color:"var(--muted)"}}>{d.name}</span>
            <span style={{color:"var(--text)",fontWeight:600,marginLeft:4}}>{d.equity}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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



// ── Ownership Report ──────────────────────────────────────────────────────────
function OwnershipReport() {
  const def = { role:"", minEquity:"", search:"" };
  const [filters, setFilters] = useState(def);
  const [applied, setApplied] = useState(def);
  const filtered = ownershipData.filter(o=>
    (!applied.role||o.role===applied.role)&&
    (!applied.minEquity||o.equity>=Number(applied.minEquity))&&
    (!applied.search||o.name.toLowerCase().includes(applied.search.toLowerCase()))
  );
  const totalEquity=filtered.reduce((a,b)=>a+b.equity,0);
  const totalRev=filtered.reduce((a,b)=>a+b.revenue,0);
  const totalDeals=filtered.reduce((a,b)=>a+b.deals,0);
  return (
    <div>
      <div className="section-title">Business Ownership Report</div>
      <div className="section-sub">Equity distribution & partner performance · FY 2025</div>
      <div className="filter-bar">
        <div className="filter-group" style={{minWidth:200}}>
          <span className="filter-label">Search Owner</span>
          <input type="text" className="filter-input" placeholder="Name..." value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))}/>
        </div>
        <div className="filter-group">
          <span className="filter-label">Role</span>
          <select className="filter-select" value={filters.role} onChange={e=>setFilters(f=>({...f,role:e.target.value}))}>
            <option value="">All Roles</option>
            {["Managing Director","Regional Director","Partner","Associate Partner","Senior Associate"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Min Equity %</span>
          <select className="filter-select" value={filters.minEquity} onChange={e=>setFilters(f=>({...f,minEquity:e.target.value}))}>
            <option value="">Any</option>
            <option value="10">≥ 10%</option><option value="15">≥ 15%</option>
            <option value="20">≥ 20%</option><option value="30">≥ 30%</option>
          </select>
        </div>
        <div className="filter-actions">
          <button className="btn btn-primary" onClick={()=>setApplied(filters)}>Apply</button>
          <button className="btn btn-ghost" onClick={()=>{setFilters(def);setApplied(def);}}>Reset</button>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card blue"><div className="kpi-label">Owners (filtered)</div><div className="kpi-value">{filtered.length}</div><div className="kpi-change" style={{color:"var(--muted)"}}>of {ownershipData.length} total</div></div>
        <div className="kpi-card green"><div className="kpi-label">Combined Equity</div><div className="kpi-value">{totalEquity}%</div><div className="kpi-change up">Weighted stake</div></div>
        <div className="kpi-card yellow"><div className="kpi-label">Total Revenue</div><div className="kpi-value">{fmt(totalRev)}</div><div className="kpi-change up">▲ Avg YoY</div></div>
        <div className="kpi-card red"><div className="kpi-label">Total Deals</div><div className="kpi-value">{totalDeals}</div><div className="kpi-change up">Active pipeline</div></div>
      </div>
      <div className="chart-row">
        <div className="chart-card"><div className="chart-card-title">Equity Distribution</div><DonutChart data={ownershipData}/></div>
        <div className="chart-card">
          <div className="chart-card-title">GP Contribution by Partner</div>
          <div className="mini-bars" style={{height:110}}>
            {ownershipData.map((d,i)=>(
              <div key={i} className="bar-wrap">
                <div className="bar" style={{height:`${(d.gp/Math.max(...ownershipData.map(x=>x.gp)))*95}px`,background:donutColors[i]}}/>
                <span className="bar-label" style={{fontSize:9}}>{d.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ownership-grid">
        {filtered.map((o,i)=>(
          <div key={i} className="ownership-card">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:donutColors[i%donutColors.length],
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15,flexShrink:0,color:"#fff"}}>
                {o.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div><div className="ownership-name">{o.name}</div><div className="ownership-role">{o.role}</div></div>
            </div>
            <div className="ownership-stat"><span style={{color:"var(--muted)"}}>Equity</span><span style={{fontWeight:600}}>{o.equity}%</span></div>
            <div className="progress-bar" style={{marginBottom:10}}><div className="progress-fill" style={{width:`${o.equity*2}%`,background:donutColors[i%donutColors.length]}}/></div>
            <div className="ownership-stat"><span style={{color:"var(--muted)"}}>Revenue</span><span>{fmt(o.revenue)}</span></div>
            <div className="ownership-stat"><span style={{color:"var(--muted)"}}>Gross Profit</span><span style={{color:"var(--accent2)"}}>{fmt(o.gp)}</span></div>
            <div className="ownership-stat"><span style={{color:"var(--muted)"}}>Deals</span><span>{o.deals}</span></div>
            <div className="ownership-stat"><span style={{color:"var(--muted)"}}>YoY</span><span style={{color:o.yoy.startsWith("+")?`var(--accent2)`:`var(--danger)`}}>{o.yoy}</span></div>
          </div>
        ))}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"var(--muted)",padding:40}}>No owners match the selected filters.</div>}
      </div>
      <div className="table-card">
        <div className="table-header"><span className="table-title">Partner Summary Table</span><span style={{fontSize:12,color:"var(--muted)"}}>{filtered.length} partners</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Partner</th><th>Role</th><th>Equity %</th><th>Revenue</th><th>Gross Profit</th><th>GP%</th><th>Deals</th><th>YoY</th></tr></thead>
            <tbody>
              {filtered.map((o,i)=>(
                <tr key={i}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:donutColors[i%donutColors.length],
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,color:"#fff"}}>
                        {o.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                      </div>
                      <span>{o.name}</span>
                    </div>
                  </td>
                  <td><span className="pill pill-blue">{o.role}</span></td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontWeight:600}}>{o.equity}%</span>
                      <div className="progress-bar" style={{width:50,display:"inline-block"}}>
                        <div className="progress-fill" style={{width:`${o.equity*2}%`,background:donutColors[i%donutColors.length]}}/>
                      </div>
                    </div>
                  </td>
                  <td style={{fontFamily:"Syne,sans-serif",fontWeight:600}}>{fmt(o.revenue)}</td>
                  <td style={{color:"var(--accent2)",fontWeight:600}}>{fmt(o.gp)}</td>
                  <td>{((o.gp/o.revenue)*100).toFixed(1)}%</td>
                  <td>{o.deals}</td>
                  <td style={{color:o.yoy.startsWith("+")?`var(--accent2)`:`var(--danger)`,fontWeight:600}}>{o.yoy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const secondaryNav = [
  { id:"analytics", label:"Analytics",   icon:"📊" },
  { id:"forecast",  label:"Forecasting", icon:"🔮" },
  { id:"settings",  label:"Settings",    icon:"⚙️" },
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
export default function OwnershipDashboard() {
  const [collapsed, setCollapsed] = useState(false);

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
          
         
          
          <div className="sidebar-toggle" onClick={()=>setCollapsed(c=>!c)}>
            <span style={{fontSize:18}}>{collapsed?"→":"←"}</span>
            {!collapsed && <span>Collapse</span>}
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            
            <div className="topbar-right">
              <span className="badge">Live</span>
              <span style={{fontSize:13,color:"var(--muted)"}}>FY 2025</span>
              <ThemeToggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")} />
              
            </div>
          </header>
          
        </div>
      </div>
    </>
  );
}