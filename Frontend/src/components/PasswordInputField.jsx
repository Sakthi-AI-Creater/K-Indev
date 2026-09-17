import React, { useState } from "react";

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function InputField({ type, label, placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const styles = {
    wrapper: { display: "flex", flexDirection: "column", gap: "7px" },
    label: {
      fontSize: "12.5px",
      fontWeight: "600",
      color: "#3d4f63",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    inputWrap: {
      display: "flex",
      alignItems: "center",
      border: focused ? "1.5px solid #1a6fc4" : "1.5px solid #dde3eb",
      borderRadius: "10px",
      padding: "0 14px",
      height: "48px",
      background: focused ? "#f5f9ff" : "#fafbfc",
      transition: "border-color 0.18s, background 0.18s",
      gap: "10px",
    },
    iconWrap: {
      color: focused ? "#1a6fc4" : "#9baab8",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      transition: "color 0.18s",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "14.5px",
      color: "#0d1b2e",
      fontFamily: "inherit",
      letterSpacing: isPassword ? "0.1em" : "normal",
    },
    eyeBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0",
      display: "flex",
      alignItems: "center",
      color: "#9baab8",
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <span style={styles.iconWrap}>
          {icon === "email" ? <EmailIcon /> : <LockIcon />}
        </span>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {isPassword && (
          <button
            style={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            type="button"
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>
    </div>
  );
}