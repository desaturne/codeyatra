import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserPlus, Pill, RefreshCw } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import useAuthStore from "../store/useAuthStore";
import db from "../lib/db";

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOnline } = useAuthStore();
  const pendingSync = useLiveQuery(() => db.syncQueue.count()) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {t("dashboard.welcome")}
        </h2>
        <p className="text-slate-500 text-sm mt-1">FCHV Health Portal</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => navigate("/register")}
          className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 active:bg-slate-50 transition-all text-left min-h-[44px]"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <UserPlus size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">
              {t("dashboard.registerPatient")}
            </h3>
            <p className="text-slate-500 text-sm mt-0.5">
              {t("dashboard.registerPatientDesc")}
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate("/tracker")}
          className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 active:bg-slate-50 transition-all text-left min-h-[44px]"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Pill size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">
              {t("dashboard.medicineTracker")}
            </h3>
            <p className="text-slate-500 text-sm mt-0.5">
              {t("dashboard.medicineTrackerDesc")}
            </p>
          </div>
        </button>
      </div>

      {pendingSync > 0 && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-amber-600" />
            <span className="text-sm text-amber-800 font-medium">
              {pendingSync} {t("sync.pending")}
            </span>
          </div>
          {isOnline && (
            <button className="text-sm font-semibold text-amber-700 hover:text-amber-900 min-w-[44px] min-h-[44px] flex items-center justify-center">
              {t("sync.syncNow")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
