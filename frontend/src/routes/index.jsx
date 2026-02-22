import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AuthLayout from "../components/AuthLayout";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Tracker from "../pages/Tracker";
import Register from "../pages/Register";
import MaternalRegister from "../pages/MaternalRegister";
import ChildRegister from "../pages/ChildRegister";
import ProtectedRoute from "./ProtectedRoute";
import useAuthStore from "../store/useAuthStore";

function AppRoutes() {
  const { token } = useAuthStore();

  return [
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/welcome",
          element: token ? <Navigate to="/" replace /> : <Welcome />,
        },
        {
          path: "/signin",
          element: token ? <Navigate to="/" replace /> : <Login />,
        },
        {
          path: "/signup",
          element: token ? <Navigate to="/" replace /> : <Signup />,
        },
      ],
    },
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/tracker",
          element: (
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          ),
        },
        {
          path: "/register/maternal",
          element: (
            <ProtectedRoute>
              <MaternalRegister />
            </ProtectedRoute>
          ),
        },
        {
          path: "/register/child",
          element: (
            <ProtectedRoute>
              <ChildRegister />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ];
}

export default AppRoutes;
