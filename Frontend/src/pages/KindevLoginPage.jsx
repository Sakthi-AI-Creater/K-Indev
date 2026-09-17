/**
 * K-INDEV Logistics — Single Self-Contained Login Component
 * All styles are internal (JS-in-CSS). No external CSS file needed.
 * Drop this file into any React project and import it directly.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ─── SVG Icons ────────────────────────────────────────────── */



const EmailIcon = ({ color = "#9baab8" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const LockIcon = ({ color = "#9baab8" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    <ellipse cx="20" cy="20" rx="8" ry="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none"/>
    <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
    <line x1="5" y1="13" x2="35" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="5" y1="27" x2="35" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
  </svg>
);

/* ─── Keyframes injected once ───────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
  @keyframes kindev-spin { to { transform: rotate(360deg); } }
  @keyframes kindev-fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
`;

/* ─── Sub-components ─────────────────────────────────────────── */

function InputField({ type, label, placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;
  const iconColor = focused ? "#1a6fc4" : "#9baab8";

  const s = {
    wrapper: { display: "flex", flexDirection: "column", gap: 7 },
    label: {
      fontSize: 12.5, fontWeight: 600, color: "#3d4f63",
      letterSpacing: "0.04em", textTransform: "uppercase",
    },
    inputWrap: {
      display: "flex", alignItems: "center",
      border: `1.5px solid ${focused ? "#1a6fc4" : "#dde3eb"}`,
      borderRadius: 10, padding: "0 14px", height: 48,
      background: focused ? "#f5f9ff" : "#fafbfc",
      transition: "border-color 0.18s, background 0.18s", gap: 10,
    },
    iconWrap: { color: iconColor, display: "flex", alignItems: "center", flexShrink: 0, transition: "color 0.18s" },
    input: {
      flex: 1, border: "none", outline: "none", background: "transparent",
      fontSize: 14.5, color: "#0d1b2e", fontFamily: "inherit",
    },
    eyeBtn: {
      background: "none", border: "none", cursor: "pointer",
      padding: 0, display: "flex", alignItems: "center", color: "#9baab8", flexShrink: 0,
    },
  };

  return (
    <div style={s.wrapper}>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <span style={s.iconWrap}>
          {icon === "email" ? <EmailIcon color={iconColor} /> : <LockIcon color={iconColor} />}
        </span>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={s.input}
        />
        {isPassword && (
          <button style={s.eyeBtn} onClick={() => setShowPass(!showPass)} tabIndex={-1} type="button">
            {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

function SignInButton({ loading, onClick }) {
  const [hovered, setHovered] = useState(false);
  const s = {
    btn: {
      width: "100%", height: 50, borderRadius: 10, border: "none",
      background: hovered
        ? "linear-gradient(135deg,#1560c0 0%,#0d45a0 100%)"
        : "linear-gradient(135deg,#1a6fc4 0%,#1250ad 100%)",
      color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "inherit",
      cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.04em",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      boxShadow: hovered ? "0 6px 24px rgba(26,111,196,0.45)" : "0 4px 16px rgba(26,111,196,0.3)",
      transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
      transform: hovered ? "translateY(-1px)" : "none",
      opacity: loading ? 0.8 : 1,
    },
    spinner: {
      width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "kindev-spin 0.7s linear infinite",
    },
  };
  return (
    <button
      style={s.btn}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      type="button"
    >
      {loading ? (
        <><div style={s.spinner} /> Signing in…</>
      ) : (
        <>Sign in <ArrowRightIcon /></>
      )}
    </button>
  );
}

function BackgroundPanel() {
  const s = {
    panel: {
      width: 300, flexShrink: 0,
      background: "linear-gradient(160deg,#0d2654 0%,#0a3878 60%,#1155aa 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "48px 32px", position: "relative", overflow: "hidden",
    },
    pattern: {
      position: "absolute", inset: 0,
      backgroundImage:
        "radial-gradient(circle at 20% 80%,rgba(255,255,255,0.04) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(100,180,255,0.07) 0%,transparent 50%)",
      pointerEvents: "none",
    },
    grid: {
      position: "absolute", inset: 0,
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
      backgroundSize: "40px 40px", pointerEvents: "none",
    },
    logoWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 1 },
    globe: {
      width: 72, height: 72, borderRadius: "50%",
      background: "linear-gradient(135deg,#1e5eb8 0%,#0d3d8f 100%)",
      border: "3px solid rgba(255,255,255,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    },
    brandText: { textAlign: "center" },
    brandMain: { fontSize: 26, fontWeight: 700, letterSpacing: "0.04em", color: "#fff", lineHeight: 1 },
    brandK: { color: "#f4a223" },
    brandSub: { fontSize: 11, letterSpacing: "0.3em", color: "rgba(255,255,255,0.55)", marginTop: 5, textTransform: "uppercase" },
    memberBadge: { marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" },
    klnBadge: {
      background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 4, padding: "1px 7px", fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "0.08em",
    },
    tagline: { marginTop: 36, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.7, maxWidth: 180, position: "relative", zIndex: 1 },
  };
  return (
    <div style={s.panel}>
      <div style={s.pattern} />
      <div style={s.grid} />
      <div style={s.logoWrap}>
        <div style={s.globe}><GlobeIcon /></div>
        <div style={s.brandText}>
          <div style={s.brandMain}><span style={s.brandK}>K</span>-INDEV</div>
          <div style={s.brandSub}>Logistics</div>
          <div style={s.memberBadge}>A Member of <span style={s.klnBadge}>KLN</span></div>
        </div>
      </div>
      {/* <p style={s.tagline}>Connecting supply chains across the globe</p> */}
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */

export default function KIndevLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const response = await axios.post(
      "http://127.0.0.1:8000/authentication/login/",
      {
        username: email,
        password: password,
      }
    );

    // Store JWT token
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    console.log("Login Success");

    // Redirect after login
    navigate("/user-config");

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.detail ||
      "Invalid username or password"
    );
  } finally {
    setLoading(false);
  }
};

  const s = {
    wrapper: {
      minHeight: "100vh", 
      minWidth: "100vw",
      overflow: "hidden",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg,#0a1628 0%,#0d2044 40%,#0a3060 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Sora','Segoe UI',sans-serif", position: "relative", overflow: "hidden",
    },
    orb1: {
      position: "absolute", top: -80, right: "10%", width: 360, height: 360,
      borderRadius: "50%",
      background: "radial-gradient(circle,rgba(30,100,200,0.18) 0%,transparent 70%)",
      pointerEvents: "none",
    },
    orb2: {
      position: "absolute", bottom: -100, left: "5%", width: 300, height: 300,
      borderRadius: "50%",
      background: "radial-gradient(circle,rgba(20,70,180,0.14) 0%,transparent 70%)",
      pointerEvents: "none",
    },
    card: {
      display: "flex", width: 820, maxWidth: "95vw",
      borderRadius: 22, overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.07)",
      position: "relative", zIndex: 1,
      animation: "kindev-fadein 0.5s ease both",
    },
    form: {
      flex: 1, background: "#ffffff", padding: "40px 40px",
      display: "flex", flexDirection: "column", justifyContent: "center",
    },
    heading: { fontSize: 25, 
        marginTop: -10,
        padding: 30,
       textAlign: "center",fontWeight: 600, color: "#0d1b2e", marginBottom: 8, letterSpacing: "-0.02em" },
    subheading: { fontSize: 13.5, color: "#8a97a8", marginBottom: 36, lineHeight: 1.5 },
    fields: { display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 },
    forgotWrap: { textAlign: "center", marginTop: 20 },
    forgotBtn: { fontSize: 13, color: "#1a6fc4", fontWeight: 500, cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "24px 0" },
    dividerLine: { flex: 1, height: 1, background: "#e8edf3" },
    dividerText: { fontSize: 12, color: "#b0bbc8", whiteSpace: "nowrap" },
    footer: { marginTop: 32, fontSize: 11.5, color: "#b0bbc8", textAlign: "center", lineHeight: 1.6 },
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={s.wrapper}>
        <div style={s.orb1} />
        <div style={s.orb2} />
        <div style={s.card}>
          <BackgroundPanel />
          <div style={s.form}>
            <h1 style={s.heading}>Welcome</h1>
            {/* <p style={s.subheading}>Sign in to your logistics dashboard</p> */}
            <div style={s.fields}>
              <InputField
                type="email" label="User name / Email address"
                placeholder="you@company.com" value={email}
                onChange={(e) => setEmail(e.target.value)} icon="email"
              />
              <InputField
                type="password" label="Password"
                placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} icon="lock"
              />
            </div>
            <SignInButton loading={loading} onClick={handleSubmit} />
            <div style={s.forgotWrap}>
              <button style={s.forgotBtn}>Forgot password?</button>
            </div>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              {/* <span style={s.dividerText}>Secure enterprise login</span> */}
              <div style={s.dividerLine} />
            </div>
            {/* <div style={s.footer}>
              Protected by 256-bit SSL encryption &nbsp;·&nbsp; K-INDEV Logistics © 2026
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}