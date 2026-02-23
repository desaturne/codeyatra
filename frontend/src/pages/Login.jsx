import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";
import api from "../lib/axios";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [loading, setLoading] = useState(false);

  // Sign-in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign-up state
  const [signupForm, setSignupForm] = useState({ name: "", dob: "", email: "", password: "" });
  const handleSignupChange = (field) => (e) =>
    setSignupForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", signupForm);
      toast.success("Account created! Please sign in.");
      setMode("signin");
      setEmail(signupForm.email);
      setPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "9px 0",
    border: "none",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s",
    background: active ? "#3D3024" : "transparent",
    color: active ? "#ffffff" : "#C9B99A",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "8px" }}>
        <Mascot size="lg" variant="circle" />
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "4px", background: "#5E503C", borderRadius: "999px", padding: "4px", marginTop: "20px", width: "100%", maxWidth: "280px" }}>
        <button style={tabStyle(mode === "signin")} onClick={() => setMode("signin")}>Sign In</button>
        <button style={tabStyle(mode === "signup")} onClick={() => setMode("signup")}>Sign Up</button>
      </div>

      <div style={{ width: "100%", marginTop: "16px", backgroundColor: "#5E503C", borderRadius: "16px", padding: "20px" }}>
        {mode === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("login.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("login.emailPlaceholder")}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("login.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("login.passwordPlaceholder")}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "11px 40px", backgroundColor: "#3D3024", color: "#ffffff", fontSize: "14px", fontWeight: "600", border: "none", borderRadius: "999px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, minWidth: "130px" }}
              >
                {loading ? "..." : "Sign In"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("signup.name")}
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={handleSignupChange("name")}
                required
                placeholder={t("signup.namePlaceholder")}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("signup.dob")}
              </label>
              <input
                type="text"
                value={signupForm.dob}
                onChange={handleSignupChange("dob")}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                placeholder="dd/mm/yyyy"
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("login.email")}
              </label>
              <input
                type="email"
                value={signupForm.email}
                onChange={handleSignupChange("email")}
                required
                placeholder="username@gmail.com"
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
                {t("login.password")}
              </label>
              <input
                type="password"
                value={signupForm.password}
                onChange={handleSignupChange("password")}
                required
                placeholder={t("login.passwordPlaceholder")}
                style={{ width: "100%", padding: "10px 16px", backgroundColor: "#ffffff", border: "none", borderRadius: "999px", fontSize: "13px", color: "#3D3024", textAlign: "center", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "11px 40px", backgroundColor: "#3D3024", color: "#ffffff", fontSize: "14px", fontWeight: "600", border: "none", borderRadius: "999px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, minWidth: "130px" }}
              >
                {loading ? "..." : "Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
