import React from "react";

const styles = {
  panel: {
    width: "300px",
    flexShrink: 0,
    background: "linear-gradient(160deg, #0d2654 0%, #0a3878 60%, #1155aa 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
    position: "relative",
    overflow: "hidden",
  },
  patternOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100,180,255,0.07) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  gridLines: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    position: "relative",
    zIndex: 1,
  },
  globe: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e5eb8 0%, #0d3d8f 100%)",
    border: "3px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  brandText: {
    textAlign: "center",
  },
  brandMain: {
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    color: "#fff",
    lineHeight: 1,
  },
  brandK: {
    color: "#f4a223",
  },
  brandSub: {
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.55)",
    marginTop: "5px",
    textTransform: "uppercase",
  },
  memberBadge: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.05em",
  },
  klnBadge: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    padding: "1px 7px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    letterSpacing: "0.08em",
  },
  tagline: {
    marginTop: "36px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
    lineHeight: "1.7",
    maxWidth: "180px",
    position: "relative",
    zIndex: 1,
  },
};

export default function BackgroundPanel() {
  return (
    <div style={styles.panel}>
      <div style={styles.patternOverlay} />
      <div style={styles.gridLines} />
      <div style={styles.logoWrap}>
        <div style={styles.globe}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
            <ellipse cx="20" cy="20" rx="8" ry="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none"/>
            <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
            <line x1="5" y1="13" x2="35" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="5" y1="27" x2="35" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          </svg>
        </div>
        <div style={styles.brandText}>
          <div style={styles.brandMain}>
            <span style={styles.brandK}>K</span>-INDEV
          </div>
          <div style={styles.brandSub}>Logistics</div>
          <div style={styles.memberBadge}>
            A Member of <span style={styles.klnBadge}>KLN</span>
          </div>
        </div>
      </div>
      <p style={styles.tagline}>
        Connecting supply chains across the globe
      </p>
    </div>
  );
}