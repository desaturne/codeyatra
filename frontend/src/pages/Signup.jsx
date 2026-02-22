import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";

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
      const mockToken = btoa(`${form.email}:${Date.now()}`);
      setToken(mockToken);
      setUser({ email: form.email, name: form.name });
      navigate("/");
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full">
        <Mascot size="lg" variant="circle" />
      </div>

      <h2 className="mt-3 text-lg font-bold text-[#3D3024]">
        {t("signup.title")}
      </h2>

      <div className="w-full mt-4 bg-[#5E503C] rounded-2xl p-5 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("signup.name")}
            </label>
            <input
              id="signup-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D3024] text-sm text-[#3D3024] placeholder-[#A09585] text-center"
              placeholder={t("signup.namePlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="signup-dob"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("signup.dob")}
            </label>
            <input
              id="signup-dob"
              type="text"
              value={form.dob}
              onChange={handleChange("dob")}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D3024] text-sm text-[#3D3024] placeholder-[#A09585] text-center"
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("login.email")}
            </label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D3024] text-sm text-[#3D3024] placeholder-[#A09585] text-center"
              placeholder={t("login.emailPlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("login.password")}
            </label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              required
              className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D3024] text-sm text-[#3D3024] placeholder-[#A09585] text-center"
              placeholder={t("login.passwordPlaceholder")}
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-[#3D3024] text-white text-sm font-semibold rounded-full hover:bg-[#2C2218] active:bg-[#1E160F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[40px]"
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
