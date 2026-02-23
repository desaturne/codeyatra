import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CloudUpload } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import toast from "react-hot-toast";
import Mascot from "../components/Mascot";
import db from "../lib/db";
import api from "../lib/axios";

function Register() {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const pendingItems = useLiveQuery(() => db.syncQueue.toArray()) || [];
  const pendingCount = pendingItems.length;

  const handleSync = async () => {
    if (syncing || pendingCount === 0) return;
    setSyncing(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of pendingItems) {
      try {
        if (item.operation === "POST") {
          await api.post(`/${item.table}`, item.payload);
        } else if (item.operation === "PUT") {
          await api.put(`/${item.table}/${item.recordId}`, item.payload);
        } else if (item.operation === "DELETE") {
          await api.delete(`/${item.table}/${item.recordId}`);
        }
        await db.syncQueue.delete(item.id);
        successCount++;
      } catch {
        failCount++;
      }
    }

    setSyncing(false);
    if (successCount > 0 && failCount === 0) {
      toast.success(
        `Synced ${successCount} record${successCount > 1 ? "s" : ""}`,
      );
    } else if (successCount > 0 && failCount > 0) {
      toast.success(`Synced ${successCount}, failed ${failCount}`);
    } else {
      toast.error("Sync failed. Check your connection.");
    }
  };

  return (
    <div className="h-screen bg-[#D6CDB8] flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-6 max-w-lg mx-auto w-full shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 mt-10 ml-2 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <img
          src="/assets/logo.png"
          alt="AASHA"
          className="h-20 w-20 mt-6 mr-2 object-contain"
        />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6">
        <div className="flex flex-col items-center w-full gap-6">
          <Mascot size="xl" variant="circle" />

          <h1 className="text-2xl font-extrabold text-[#3E3425] tracking-[0.25em] text-center uppercase">
            REGISTER
          </h1>

          <div className="w-full flex flex-col items-center gap-4 mt-4 px-2">
            <button
              onClick={() => navigate("/register/maternal")}
              className="w-60 h-12 py-4 bg-[#5E503C] text-[#F5F0EB] font-bold rounded-full text-base uppercase tracking-wider hover:bg-[#4a3f30] transition-colors"
            >
              MATERNAL
            </button>
            <button
              onClick={() => navigate("/register/child")}
              className="w-60 h-12 py-4 bg-white text-[#3E3425] font-bold rounded-full text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              CHILD
            </button>

            <button
              onClick={handleSync}
              disabled={syncing || pendingCount === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all mt-1 ${
                pendingCount > 0 && !syncing
                  ? "bg-[#5E503C]/10 text-[#5E503C] hover:bg-[#5E503C]/20"
                  : "text-[#5E503C]/40 cursor-default"
              }`}
            >
              <CloudUpload
                size={16}
                className={syncing ? "animate-pulse" : ""}
              />
              {syncing
                ? "Syncing..."
                : pendingCount > 0
                  ? `Sync ${pendingCount} pending`
                  : "All synced"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
