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
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full">
        <Mascot size="lg" variant="circle" />
      </div>

      <h2 className="mt-3 text-lg font-bold text-[#3D3024]">
        {t("login.title")}
      </h2>

      <div className="w-full mt-4 bg-[#5E503C] rounded-2xl p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D3024] text-sm text-[#3D3024] placeholder-[#A09585] text-center"
              placeholder={t("login.emailPlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-white mb-1"
            >
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "..." : t("login.submit")}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-sm text-[#6B5B3E]">
        {t("login.noAccount")}{" "}
        <Link
          to="/signup"
          className="font-semibold text-[#5E503C] underline underline-offset-2 hover:text-[#3D3024]"
        >
          {t("login.signUpLink")}
        </Link>
      </p>
    </div>
  );
}

export default Login;
