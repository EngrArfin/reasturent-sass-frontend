import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
// import AdminRoute from "./AdminRoutes";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Services from "@/pages/Services";
import MerchantLayout from "@/Layout/MerchantLayout";
import MerchantDashboardPage from "@/pages/Merchant/MerchantDashboardPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import AdminLayout from "@/Layout/AdminLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  /* Merchant Dashboard */
  {
    path: "/merchant-dashboard",
    element: <MerchantLayout />,
    children: [
      { index: true, element: <MerchantDashboardPage /> },
      { path: "dashboard", element: <MerchantDashboardPage /> },
    ],
  },
  /* Admin Dashboard */
  {
    path: "/admin-dashboard",
    element: (
      // <AdminRoute>
        <AdminLayout />
      // </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
