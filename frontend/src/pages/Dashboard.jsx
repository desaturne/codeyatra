import { useNavigate } from "react-router-dom";
import { Eye, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    toast.success("You're logging out. You need to sign back in!");
    logout();
    navigate("/welcome");
  };

  return (
    <div className="h-screen bg-[#D6CDB8] flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-6 max-w-lg mx-auto w-full shrink-0">
        <img
          src="/assets/logo.png"
          alt="AASHA"
          className="h-20 w-20 object-contain"
        />
        <button
          onClick={handleLogout}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6">
        <div className="flex flex-col items-center w-full gap-6">
          <Mascot size="xl" variant="circle" />

          <h1 className="text-2xl font-extrabold text-[#3E3425] tracking-[0.25em] text-center uppercase">
            WELCOME HOME!
          </h1>

          <div className="w-full flex flex-col items-center gap-4 mt-4 px-2">
            <button
              onClick={() => navigate("/register")}
              className="w-60 h-12 py-4 px-20 bg-[#5E503C] text-[#F5F0EB] font-bold rounded-full text-base uppercase tracking-wider hover:bg-[#4a3f30] transition-colors"
            >
              REGISTER
            </button>
            <button
              onClick={() => navigate("/tracker")}
              className="w-60 h-12 py-4 bg-white text-[#3E3425] font-bold rounded-full text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              TRACKER
            </button>
            <button
              onClick={() => navigate("/visualisation")}
              className="w-60 h-12 py-4 bg-white text-[#3E3425] font-bold rounded-full text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              VISUALISATION
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/info")}
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-lg hover:bg-gray-50 transition-colors z-50"
        aria-label="Information"
      >
        <Eye size={24} />
      </button>
    </div>
  );
}

export default Dashboard;
