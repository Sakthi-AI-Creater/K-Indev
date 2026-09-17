import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  UserOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

/* ✅ Globe Icon */
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
    <circle
      cx="20"
      cy="20"
      r="14"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
    />
    <ellipse
      cx="20"
      cy="20"
      rx="7"
      ry="14"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.2"
    />
    <line
      x1="6"
      y1="20"
      x2="34"
      y2="20"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.2"
    />
  </svg>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const s = {
    sidebar: {
      width: collapsed ? 70 : 200,
      transition: "0.3s",
      background: "#0d2044",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minHeight: "100vh",
      zIndex: 999,
    },

    /* TOP BAR */
    topBar: {
  position: "absolute",
  top: 58,
  right: -14,
  zIndex: 1000,
},

    toggleBtn: {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "#1e3a8a",
  border: "2px solid #0d2044",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 13,
  transition: "0.2s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
},

    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "18px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },

    globeWrap: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#1e5eb8,#0d3d8f)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    brand: {
      color: "#fff",
      fontWeight: 700,
      fontSize: 15,
    },

    sub: {
      fontSize: 9,
      color: "rgba(255,255,255,0.5)",
      letterSpacing: "0.2em",
    },

    group: {
      padding: "18px 16px 8px",
      fontSize: 10,
      color: "rgba(255,255,255,0.35)",
      letterSpacing: "0.15em",
    },

    section: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      fontSize: 14,
      color: active ? "#fff" : "rgba(255,255,255,0.72)",
      cursor: "pointer",
      background: active ? "rgba(255,255,255,0.08)" : "transparent",
      borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
      transition: "0.2s",
      marginBottom: 4,
    }),

    icon: {
      fontSize: 16,
    },
  };

  return (
    <aside style={s.sidebar}>

      {/* TOGGLE TOP */}
      <div style={s.topBar}>
        <div
          style={s.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      {/* LOGO */}
      <div style={s.logoRow}>
        <div style={s.globeWrap}>
          <GlobeIcon />
        </div>

        {!collapsed && (
          <div>
            <div style={s.brand}>
              <span style={{ color: "#f4a223" }}>K</span>-INDEV
            </div>
            <div style={s.sub}>LOGISTICS</div>
          </div>
        )}
      </div>

      {/* GROUP */}
      {!collapsed && (
        <div style={s.group}>CONFIGURATIONS</div>
      )}

      {/* USER CONFIG */}
      <div
        style={s.section(isActive("/user-config"))}
        onClick={() => navigate("/user-config")}
      >
        <UserOutlined style={s.icon} />
        {!collapsed && "User Configuration"}
      </div>

      {/* DASHBOARD */}
      <div
        style={s.section(isActive("/dashboard"))}
        onClick={() => navigate("/dashboard")}
      >
        <DashboardOutlined style={s.icon} />
        {!collapsed && "Dashboards"}
      </div>

    </aside>
  );
}