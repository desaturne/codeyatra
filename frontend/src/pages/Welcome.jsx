import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Mascot from "../components/Mascot";

function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
      <div className="flex flex-col items-center w-full max-w-lg -mt-16 gap-6">
        <Mascot size="xl" variant="circle" />

        <h2 className="text-2xl font-extrabold text-[#3D3024] tracking-[0.25em] text-center uppercase">
          {t("welcome.title")}
        </h2>

        <button
          onClick={() => navigate("/signin")}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label={t("welcome.proceed")}
        >
          <ArrowRight size={20} className="text-[#5E503C]" />
        </button>
      </div>
    </div>
  );
}

export default Welcome;
