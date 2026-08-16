import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
// import AdminRoute from "./AdminRoutes";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ServicesPage from "@/pages/ServicesPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import AdminLayout from "@/Layout/AdminLayout";
import SubscriptionPage from "@/pages/Admin/SubscriptionPage";
import AllBusinessPage from "@/pages/Admin/AllBusinessPage";
import SubmitTicketPage from "@/pages/Admin/SubmitTicketPage";
import BusinessCreatePage from "@/pages/Admin/BusinessCreatePage";

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
        element: <ServicesPage />,
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
  // {
  //   path: "/merchant-dashboard",
  //   element: <MerchantLayout />,
  //   children: [
  //     { index: true, element: <MerchantDashboardPage /> },
  //     { path: "dashboard", element: <MerchantDashboardPage /> },
  //   ],
  // },
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
      { path: "all-business", element: <AllBusinessPage /> },
      { path: "subscription", element: <SubscriptionPage /> },
      { path: "submit-ticket", element: <SubmitTicketPage /> },
      { path: "business-create", element: <BusinessCreatePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
