import React from "react";
import InputField from "./PasswordInputField";
import SignInButton from "./SigninButton";

const styles = {
  form: {
    flex: 1,
    background: "#ffffff",
    padding: "56px 52px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0d1b2e",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: "13.5px",
    color: "#8a97a8",
    marginBottom: "36px",
    lineHeight: "1.5",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "28px",
  },
  forgot: {
    textAlign: "center",
    marginTop: "20px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#1a6fc4",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e8edf3",
  },
  dividerText: {
    fontSize: "12px",
    color: "#b0bbc8",
    whiteSpace: "nowrap",
  },
  footer: {
    marginTop: "32px",
    fontSize: "11.5px",
    color: "#b0bbc8",
    textAlign: "center",
    lineHeight: "1.6",
  },
};

export default function LoginForm({
  email, setEmail, password, setPassword, loading, onSubmit
}) {
  return (
    <div style={styles.form}>
      <h1 style={styles.heading}>Welcome back</h1>
      <p style={styles.subheading}>Sign in to your logistics dashboard</p>

      <div style={styles.fieldGroup}>
        <InputField
          type="email"
          label="User name / Email address"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="email"
        />
        <InputField
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
        />
      </div>

      <SignInButton loading={loading} onClick={onSubmit} />

      <div style={styles.forgot}>
        <button style={styles.forgotLink}>Forgot password?</button>
      </div>

      <div style={styles.divider}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerText}>Secure enterprise login</span>
        <div style={styles.dividerLine} />
      </div>

      <div style={styles.footer}>
        Protected by 256-bit SSL encryption &nbsp;·&nbsp; K-INDEV Logistics © 2026
      </div>
    </div>
  );
}