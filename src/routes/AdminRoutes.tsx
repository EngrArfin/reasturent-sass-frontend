// src/routes/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { AppRootState } from "@/redux/store";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useSelector((state: AppRootState) => state.auth.user);

  const role = user?.role?.toUpperCase().replace("-", "_").trim();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPERADMIN";

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

