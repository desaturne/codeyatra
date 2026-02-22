import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWelcome = location.pathname === "/welcome";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#D6CDB8", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
        {!isWelcome ? (
          <button
            onClick={() => navigate(-1)}
            style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "#ffffff", border: "none", cursor: "pointer", color: "#3D3024", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <img src="/assets/logo.png" alt="AASHA" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
        )}
        {!isWelcome && (
          <img src="/assets/logo.png" alt="AASHA" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
        )}
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "480px", margin: "0 auto", width: "100%", padding: "0 20px 24px" }}>
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
