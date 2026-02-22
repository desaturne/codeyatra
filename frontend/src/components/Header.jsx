import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Wifi, WifiOff, LogOut, Globe } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isOnline, token, logout } = useAuthStore();
  const isHome = location.pathname === "/";

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/tracker":
        return t("nav.tracker");
      case "/register":
        return t("nav.register");
      default:
        return "";
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "np" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {!isHome && (
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t("nav.back")}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[#6B5B3E] font-bold text-lg tracking-wide">
              AASHA
            </span>
            {getPageTitle() && <span className="text-slate-400">|</span>}
            {getPageTitle() && (
              <h1 className="text-base font-semibold text-slate-700">
                {getPageTitle()}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isOnline
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? t("app.online") : t("app.offline")}</span>
          </div>

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle language"
          >
            <Globe size={18} />
          </button>

          {token && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500"
              aria-label={t("nav.logout")}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
