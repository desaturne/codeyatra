import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Mascot from "../components/Mascot";

function Register() {
  const navigate = useNavigate();

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
