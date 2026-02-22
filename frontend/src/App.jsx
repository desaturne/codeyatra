import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppRoutes from "./routes";
import useAuthStore from "./store/useAuthStore";
import "./i18n";

function RoutesRenderer() {
  const routes = AppRoutes();
  return useRoutes(routes);
}

function App() {
  const { setOnline } = useAuthStore();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  return (
    <BrowserRouter>
      <RoutesRenderer />
    </BrowserRouter>
  );
}

export default App;
