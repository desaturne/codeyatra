import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mockToken = btoa(`${email}:${Date.now()}`);
      setToken(mockToken);
      setUser({ email, name: email.split("@")[0] });
      navigate("/");
    } catch {
      toast.error(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "8px" }}>
        <Mascot size="lg" variant="circle" />
      </div>

      <h2 style={{ marginTop: "16px", fontSize: "20px", fontWeight: "700", color: "#3D3024", letterSpacing: "0.02em", textAlign: "center" }}>
        {t("login.title")}
      </h2>

      <div style={{ width: "100%", marginTop: "20px", backgroundColor: "#5E503C", borderRadius: "16px", padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
              {t("login.email")}
            </label>
            <input
              id="email"
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
              id="password"
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
              {loading ? "..." : t("login.submit")}
            </button>
          </div>
        </form>
      </div>

      <p style={{ marginTop: "20px", fontSize: "13px", color: "#5E503C", textAlign: "center" }}>
        {t("login.noAccount")}{" "}
        <Link to="/signup" style={{ fontWeight: "600", color: "#4A7C6F", textDecoration: "none" }}>
          {t("login.signUpLink")}
        </Link>
      </p>
    </div>
  );
}

export default Login;
