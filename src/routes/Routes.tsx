import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ServicesPage from "@/pages/ServicesPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import AdminLayout from "@/Layout/AdminLayout";
import SubscriptionPage from "@/pages/Admin/SubscriptionPage";
import AllBusinessPage from "@/pages/Admin/AllBusinessPage";
import SubmitTicketPage from "@/pages/Admin/SubmitTicketPage";
import BusinessCreatePage from "@/pages/Admin/BusinessCreatePage";
import ManagerLayout from "@/Layout/ManagerLayout";
import ManagerDashboardPage from "@/pages/Manager/ManagerDashboardPage";
import InventoryPage from "@/pages/Manager/InventoryPage";
import EmployeesPage from "@/pages/Manager/EmployeesPage";
import ManageFoodPage from "@/pages/Manager/ManageFoodPage";
import ApprovalsPage from "@/pages/Manager/ApprovalsPage";
import QRScannerPage from "@/pages/Manager/QRScannerPage";
import ManagerTicketPage from "@/pages/Manager/ManagerTicketPage";
import SettingsPage from "@/pages/Manager/SettingsPage";
import VoucherPage from "@/pages/Manager/VoucherPage";
import CashierDashboardPage from "@/pages/Cashier/CashierDashboardPage";
import TableMenuPage from "@/pages/Cashier/TableMenuPage";
import CashierLayout from "@/Layout/CashierLayout";
import KitchenDashboardPage from "@/pages/Kitchen/KitchenDashboardPage";
import KitchenLayout from "@/Layout/KitchenLayout";
import ServeLayout from "@/Layout/ServeLayout";
import ServeDashboardPage from "@/pages/Serve/ServeDashboardPage";

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
  /* Manager Dashboard */
  {
    path: "/manager-dashboard",
    element: <ManagerLayout />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      { path: "dashboard", element: <ManagerDashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "manage-food", element: <ManageFoodPage /> },
      { path: "voucher", element: <VoucherPage /> },
      { path: "vouchers", element: <VoucherPage /> },
      { path: "approvals", element: <ApprovalsPage /> },
      { path: "qrscanner", element: <QRScannerPage /> },
      { path: "scan", element: <QRScannerPage /> },
      { path: "manager-ticket", element: <ManagerTicketPage /> },
      { path: "support", element: <ManagerTicketPage /> },
      { path: "managersupport", element: <ManagerTicketPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  /* Cashier Dashboard */
  {
    path: "/cashier-dashboard",
    element: <CashierLayout />,
    children: [
      { index: true, element: <CashierDashboardPage /> },
      { path: "dashboard", element: <CashierDashboardPage /> },
      { path: "table-menu", element: <TableMenuPage /> },
    ],
  },

  /* Kitchen Dashboard */
  {
    path: "/kitchen-dashboard",
    element: <KitchenLayout />,
    children: [
      { index: true, element: <KitchenDashboardPage /> },
      { path: "dashboard", element: <KitchenDashboardPage /> },
    ],
  },

  /* Serve Dashboard */
  {
    path: "/serve-dashboard",
    element: <ServeLayout />,
    children: [
      { index: true, element: <ServeDashboardPage /> },
      { path: "dashboard", element: <ServeDashboardPage /> },
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
