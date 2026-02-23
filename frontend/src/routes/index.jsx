import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AuthLayout from "../components/AuthLayout";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tracker from "../pages/Tracker";
import AddMedicine from "../pages/AddMedicine";
import Register from "../pages/Register";
import MaternalRegister from "../pages/MaternalRegister";
import ChildRegister from "../pages/ChildRegister";
import Info from "../pages/Info";
import Visualisation from "../pages/Visualisation";
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
          element: <Navigate to="/signin" replace />,
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
          path: "/add",
          element: (
            <ProtectedRoute>
              <AddMedicine />
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
          path: "/info",
          element: (
            <ProtectedRoute>
              <Info />
            </ProtectedRoute>
          ),
        },
        {
          path: "/visualisation",
          element: (
            <ProtectedRoute>
              <Visualisation />
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
