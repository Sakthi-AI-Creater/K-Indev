/**
 * K-INDEV Logistics — User Configuration (Single Self-Contained Component)
 * All styles are internal. No external CSS needed.
 * Usage: import KIndevUserConfig from './KIndevUserConfig'; then <KIndevUserConfig />
 */

import React, { useState, useRef } from "react";
import SignInButton from "../components/SigninButton";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
  @keyframes uc-fadein { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
`;

/* ─── Icons ─────────────────────────────────────────────────── */
const UserIcon = ({ color = "currentColor", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ChevronDown = ({ color = "currentColor" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8d2e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
    <ellipse cx="20" cy="20" rx="7" ry="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none"/>
    <line x1="6" y1="20" x2="34" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
  </svg>
);

/* ─── Sidebar ────────────────────────────────────────────────── */
// function Sidebar({ activeNav, setActiveNav }) {
//   const s = {
//     sidebar: { width: 196, flexShrink: 0, background: "#0d2044", display: "flex", flexDirection: "column" },
//     logoRow: { display: "flex", alignItems: "center", gap: 9, padding: "18px 16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
//     globeWrap: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1e5eb8,#0d3d8f)", border: "2px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
//     brandName: { fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", lineHeight: 1 },
//     kLetter: { color: "#f4a223" },
//     brandSub: { fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" },
//     nav: { padding: "12px 0" },
//     groupRow: { padding: "10px 16px 4px", fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between" },
//     navItem: (active) => ({
//       display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
//       fontSize: 12.5, cursor: "pointer",
//       color: active ? "#fff" : "rgba(255,255,255,0.55)",
//       borderLeft: `3px solid ${active ? "#1a6fc4" : "transparent"}`,
//       background: active ? "rgba(255,255,255,0.1)" : "transparent",
//       transition: "all .15s",
//     }),
//   };
//   const items = [
//     { label: "User Configuration", icon: <UserIcon /> },
//     { label: "Data Upload", icon: <UploadIcon /> },
//     { label: "Dashboards", icon: <GridIcon /> },
//   ];
//   return (
//     <aside style={s.sidebar}>
//       <div style={s.logoRow}>
//         <div style={s.globeWrap}><GlobeIcon /></div>
//         <div>
//           <div style={s.brandName}><span style={s.kLetter}>K</span>-INDEV</div>
//           <div style={s.brandSub}>Logistics</div>
//         </div>
//       </div>
//       <nav style={s.nav}>
//         <div style={s.groupRow}>
//           Configurations <ChevronDown color="rgba(255,255,255,0.35)" />
//         </div>
//         {items.map(({ label, icon }) => (
//           <div key={label} style={s.navItem(activeNav === label)} onClick={() => setActiveNav(label)}>
//             {icon} {label}
//           </div>
//         ))}
//       </nav>
//     </aside>
//   );
// }

/* ─── Topbar ─────────────────────────────────────────────────── */
// function Topbar() {
//   const s = {
//     bar: { background: "#fff", borderBottom: "1px solid #e4e9f0", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
//     title: { fontSize: 17, fontWeight: 600, color: "#0d1b2e" },
//     right: { display: "flex", alignItems: "center", gap: 10 },
//     avatar: { width: 34, height: 34, borderRadius: "50%", background: "#e8f0f9", display: "flex", alignItems: "center", justifyContent: "center" },
//     name: { fontSize: 13, fontWeight: 600, color: "#0d1b2e", margin: 0, lineHeight: 1.3, textAlign: "right" },
//     signout: { fontSize: 11.5, color: "#f4803a", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 },
//   };
//   return (
//     <header style={s.bar}>
//       <span style={s.title}>User Configuration</span>
//       <div style={s.right}>
//         <div style={s.avatar}><UserIcon color="#1a6fc4" size={18} /></div>
//         <div>
//           <p style={s.name}>Super Admin</p>
//           <button style={s.signout}>Sign Out</button>
//         </div>
//       </div>
//     </header>
//   );
// }

/* ─── TabBar ─────────────────────────────────────────────────── */
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", marginBottom: 20 }}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: "8px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer",
            border: "1px solid #d4dbe6",
            borderLeft: i > 0 ? "none" : "1px solid #d4dbe6",
            borderRadius: i === 0 ? "7px 0 0 7px" : i === tabs.length - 1 ? "0 7px 7px 0" : 0,
            background: tab === active ? "#1a6fc4" : "#fff",
            color: tab === active ? "#fff" : "#4a5568",
            fontWeight: 500, transition: "all .15s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ─── Field helpers ──────────────────────────────────────────── */
const inputStyle = (extraPad = 0) => ({
  width: "100%", height: 38, border: "1px solid #d8e0eb", borderRadius: 7,
  padding: `0 ${12 + extraPad}px 0 12px`, fontSize: 13.5, fontFamily: "inherit",
  color: "#0d1b2e", background: "#fafbfc", outline: "none",
});

function Field({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", marginBottom: 14, gap: 12 }}>
      <label style={{ fontSize: 13, color: "#4a5568", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

function SelectField({ label, options }) {
  return (
    <Field label={label}>
      <div style={{ position: "relative" }}>
        <select style={{ ...inputStyle(22), appearance: "none", cursor: "pointer" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#8a97a8" }}>
          <ChevronDown />
        </span>
      </div>
    </Field>
  );
}

/* ─── UserForm ───────────────────────────────────────────────── */
function UserForm() {
  const [loading, setLoading] = useState(false);
  const s = {
    card: { flex: 1, background: "#fff", borderRadius: 10, border: "1px solid #e4e9f0", padding: "24px 28px" },
    sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#1a6fc4", textTransform: "uppercase", marginBottom: 18 },
    divider: { border: "none", borderTop: "1px solid #edf0f5", margin: "20px 0" },
    createBtn: {
      height: 40, padding: "0 32px", borderRadius: 8, border: "none",
      background: loading ? "linear-gradient(135deg,#7faad4,#5e8abf)" : "linear-gradient(135deg,#1a6fc4,#1250ad)",
      color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "inherit",
      cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.03em", transition: "opacity .15s",
    },
  };

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div style={s.card}>
      <div style={s.sectionLabel}>Basic Credentials</div>
      <Field label="Name"><input style={inputStyle()} type="text" /></Field>
      <Field label="Email ID"><input style={inputStyle()} type="email" /></Field>
      <Field label="Password"><input style={inputStyle()} type="password" /></Field>
      <Field label="Confirm Password"><input style={inputStyle()} type="password" /></Field>
      <Field label="Date of Birth">
        <div style={{ position: "relative" }}>
          <input style={inputStyle(26)} type="text" defaultValue="10 - 04 - 2026" />
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#8a97a8" }}>
            <CalendarIcon />
          </span>
        </div>
      </Field>
      <Field label="Address"><input style={inputStyle()} type="text" /></Field>

      <hr style={s.divider} />
      <div style={s.sectionLabel}>Data Access</div>

      <SelectField label="Location" options={[ "Chennai", "Mumbai", "Kolkata", "Delhi"]} />
      <SelectField label="Product" options={["Product 1, Product 2", "Product 1", "Product 2", "Product 3"]} />
      <SelectField label="Trade" options={["Trade 1, Trade 2", "Trade 1", "Trade 2", "Trade 3"]} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <SignInButton style={s.createBtn} onClick={handleCreate} disabled={loading}>
          {loading ? "Creating…" : "Create"}
        </SignInButton>
      </div>
    </div>
  );
}

/* ─── PhotoUpload ────────────────────────────────────────────── */
function PhotoUpload() {
  const [preview, setPreview] = useState(null);
  const ref = useRef();
  const s = {
    card: { width: 116, flexShrink: 0, background: "#fff", borderRadius: 10, border: "1px solid #e4e9f0", padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
    box: {
      width: 90, height: 90, borderRadius: 8,
      border: "1.5px dashed #c8d2e0",
      background: preview ? `url(${preview}) center/cover no-repeat` : "#f7f9fc",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: "pointer", gap: 6,
    },
    label: { fontSize: 10.5, color: "#8a97a8", textAlign: "center", lineHeight: 1.4 },
  };
  return (
    <div style={s.card}>
      <div style={s.box} onClick={() => ref.current.click()}>
        {!preview && <><ImageIcon /><span style={s.label}>Click to upload photo</span></>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))} />
    </div>
  );
}

/* ─── Root Export ────────────────────────────────────────────── */
export default function KIndevUserConfig() {
  const [activeNav, setActiveNav] = useState("User Configuration");
  const [activeTab, setActiveTab] = useState("Create User");

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora','Segoe UI',sans-serif", background: "#f0f3f8" }}>
        {/* <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} /> */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* <Topbar /> */}
          <div style={{ padding: "22px 28px", flex: 1 }}>
            <TabBar
              tabs={["Create User", "Modify User", "Delete User"]}
              active={activeTab}
              onChange={setActiveTab}
            />
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <UserForm />
              <PhotoUpload />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}