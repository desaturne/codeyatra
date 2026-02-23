import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppRoutes from "./routes";
import useAuthStore from "./store/useAuthStore";
import { flushSyncQueue } from "./lib/sync";
import "./i18n";

function RoutesRenderer() {
  const routes = AppRoutes();
  return useRoutes(routes);
}

function App() {
  const { setOnline, token } = useAuthStore();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      if (token) {
        flushSyncQueue().catch(() => {});
      }
    };
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline, token]);

  return (
    <BrowserRouter>
      <RoutesRenderer />
    </BrowserRouter>
  );
}

export default App;
