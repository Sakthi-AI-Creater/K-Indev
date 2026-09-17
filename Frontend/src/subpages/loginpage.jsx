import React, { useState } from "react";
import BackgroundPanel from "../components/LoginBackgroundPanel";
import LoginForm from "../components/LoginForm";
import axios from "axios";
const styles = {
  wrapper: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #0a1628 0%, #0d2044 40%, #0a3060 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glowOrb1: {
    position: "absolute",
    top: "-80px",
    right: "10%",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(30,100,200,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowOrb2: {
    position: "absolute",
    bottom: "-100px",
    left: "5%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(20,70,180,0.14) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    display: "flex",
    width: "820px",
    maxWidth: "95vw",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)",
    position: "relative",
    zIndex: 1,
  },
};

export default function LoginPage() {
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
    window.location.href = "/user-config";

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

  return (
    <div style={styles.wrapper}>
      <div style={styles.glowOrb1} />
      <div style={styles.glowOrb2} />
      <div style={styles.card}>
        <BackgroundPanel />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}