import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Modal } from "antd";

import {
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import axios from "axios";

export default function Topbar({ collapsed }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const baseURL = "http://127.0.0.1:8000/userconfig";

  /* PAGE TITLE */
  const getTitle = () => {
    switch (location.pathname) {
      case "/user-config":
        return "User Configuration";

      case "/dashboard":
        return "Dashboard";

      case "/upload":
        return "Data Upload";

      default:
        return "Dashboard";
    }
  };

  /* FETCH CURRENT USER */
  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          `${baseURL}/users/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);

      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();

  }, []);

  /* LOGOUT */
  const handleLogout = () => {

    Modal.confirm({
      title: "Confirm Logout",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to sign out?",
      okText: "Logout",
      cancelText: "Cancel",

      okButtonProps: {
        danger: true,
      },

      onOk() {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/");
      },
    });
  };

  const s = {

    bar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,

      height: 56,

      background: "rgba(255,255,255,0.72)",

      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",

      borderBottom: "1px solid rgba(0,0,0,0.08)",

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      padding: collapsed
        ? "0 28px 0 98px"
        : "0 28px 0 228px",

      transition: "0.3s",

      zIndex: 10,
    },

    title: {
      fontSize: 18,
      fontWeight: 600,
      color: "#0d1b2e",
    },

    userWrap: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },

    avatar: {
      width: 38,
      height: 38,
      borderRadius: "50%",

      background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "1px solid rgba(59,130,246,0.18)",
    },

    avatarIcon: {
      fontSize: 18,
      color: "#2563eb",
    },

    nameWrap: {
      textAlign: "right",
      lineHeight: 1.2,
    },

    name: {
      fontSize: 13,
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },

    role: {
      fontSize: 11,
      color: "#6b7280",
      margin: "2px 0 0",
    },

    signout: {
      marginTop: 2,
      fontSize: 11.5,
      color: "#f4803a",

      background: "none",
      border: "none",

      cursor: "pointer",

      display: "flex",
      alignItems: "center",
      gap: 4,

      marginLeft: "auto",
    },
  };

  return (

    <header style={s.bar}>

      {/* TITLE */}
      <span style={s.title}>
        {getTitle()}
      </span>

      {/* USER */}
      <div style={s.userWrap}>

        {/* AVATAR */}
        <div style={s.avatar}>
          <UserOutlined style={s.avatarIcon} />
        </div>

        {/* USER INFO */}
        <div style={s.nameWrap}>

          <p style={s.name}>
            {user?.username || "Super Admin"}
          </p>

          <p style={s.role}>
            {user?.role || "Administrator"}
          </p>

          <button
            style={s.signout}
            onClick={handleLogout}
          >
            <LogoutOutlined />
            Sign Out
          </button>

        </div>
      </div>

    </header>
  );
}