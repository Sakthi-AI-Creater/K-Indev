import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TabBar from "./TabBar";
import UserForm from "./UserForm";
import PhotoUpload from "./PhotoUpload";

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Sora','Segoe UI',sans-serif",
    background: "#f0f3f8",
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  content: { padding: "22px 28px", flex: 1 },
  body: { display: "flex", gap: 18, alignItems: "flex-start" },
};

export default function UserConfiguration() {
  const [activeTab, setActiveTab] = useState("Create User");

  return (
    <div style={styles.shell}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>
          <TabBar
            tabs={["Create User", "Modify User", "Delete User"]}
            active={activeTab}
            onChange={setActiveTab}
          />
          <div style={styles.body}>
            <UserForm />
            <PhotoUpload />
          </div>
        </div>
      </div>
    </div>
  );
}