import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function Layout() {

  // ✅ ADD HERE
  const [collapsed, setCollapsed] = useState(false);

  const styles = {
    shell: {
      display: "flex",
      minHeight: "100vh",
      background: "#f0f3f8",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      padding: "80px 28px 22px", // for fixed topbar
      flex: 1,
    },
  };

  return (
    <div style={styles.shell}>

      {/* ✅ PASS STATE TO SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={styles.main}>

        {/* ✅ PASS TO TOPBAR */}
        <Topbar collapsed={collapsed} />

        <div style={styles.content}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}