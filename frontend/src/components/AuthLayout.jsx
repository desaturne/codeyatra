import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWelcome = location.pathname === "/welcome";

  return (
    <div className="min-h-screen bg-[#D6CDB8] flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto w-full">
        {!isWelcome ? (
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#5E503C] text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <img
            src="/assets/logo.png"
            alt="AASHA"
            className="h-19 w-auto object-contain"
          />
        )}
        {!isWelcome && (
          <img
            src="/assets/logo.png"
            alt="AASHA"
            className="h-19 w-auto object-contain"
          />
        )}
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 pb-6">
        <Outlet />
      </main>

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#5E503C",
            color: "#F5F0EB",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "12px 16px",
          },
        }}
      />
    </div>
  );
}

export default AuthLayout;
