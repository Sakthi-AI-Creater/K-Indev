import React, { useState } from "react";

export default function SignInButton({ loading, onClick }) {
  const [hovered, setHovered] = useState(false);

  const styles = {
    btn: {
      width: "100%",
      height: "50px",
      borderRadius: "10px",
      border: "none",
      background: hovered
        ? "linear-gradient(135deg, #1560c0 0%, #0d45a0 100%)"
        : "linear-gradient(135deg, #1a6fc4 0%, #1250ad 100%)",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "600",
      fontFamily: "inherit",
      cursor: loading ? "not-allowed" : "pointer",
      letterSpacing: "0.04em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      boxShadow: hovered
        ? "0 6px 24px rgba(26,111,196,0.45)"
        : "0 4px 16px rgba(26,111,196,0.3)",
      transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
      transform: hovered ? "translateY(-1px)" : "none",
      opacity: loading ? 0.8 : 1,
    },
    spinner: {
      width: "18px",
      height: "18px",
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    },
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <button
        style={styles.btn}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <>
            <div style={styles.spinner} />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
    </>
  );
}