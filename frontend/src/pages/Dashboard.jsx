import { useNavigate } from "react-router-dom";
import Mascot from "../components/Mascot";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#D6CDB8] flex flex-col overflow-hidden">
      <div className="h-1.5"></div>
        <img
          src="/assets/logo.png"
          alt="AASHA"
          className="h-20 w-20 mt-6"
        />

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
