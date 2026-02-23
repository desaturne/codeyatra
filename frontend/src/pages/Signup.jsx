import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";
import api from "../lib/axios";
import api from "../lib/axios";

function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      toast.success("Account Verified! You may now sign in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err?.response?.data?.message || t("toast.error"));
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
        {t("signup.title")}
      </h2>

      <div style={{ width: "100%", marginTop: "20px", backgroundColor: "#5E503C", borderRadius: "16px", padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "7px" }}>
              {t("signup.name")}
            </label>
            <input
              id="signup-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
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
              id="signup-dob"
              type="text"
              value={form.dob}
              onChange={handleChange("dob")}
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
              id="signup-email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
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
              id="signup-password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
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
              {loading ? "..." : t("signup.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
