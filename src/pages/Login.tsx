import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  ChefHat,
  ConciergeBell,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginphoto from "@/assets/sas/photo/bacground.jpeg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { Role } from "@/redux/features/auth/auth.type";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = false;
  const { user } = useAppSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user, navigate]);

  const redirectBasedOnRole = (role: string) => {
    const roleRoutes: Record<string, string> = {
      ADMIN: "/admin-dashboard",
      MANAGER: "/manager-dashboard",
      SERVER: "/serve-dashboard",
      KITCHEN: "/kitchen-dashboard",
      CASHIER: "/cashier-dashboard",
    };
    navigate(roleRoutes[role.toUpperCase()] || "/login");
  };

  const handleStaticRoleLogin = (role: Role, route: string, name: string) => {
    dispatch(
      setUser({
        user: {
          id: `static-${role.toLowerCase()}-id`,
          email: `${role.toLowerCase()}@restaurant.com`,
          name: name,
          role: role,
          tenantId: "static-tenant-id",
        },
        token: `static-${role.toLowerCase()}-token`,
      }),
    );
    navigate(route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !pin) {
      setError("Please enter both email and password");
      return;
    }

    // Statically set user as ADMIN and redirect to admin dashboard
    dispatch(
      setUser({
        user: {
          id: "static-admin-id",
          email: email,
          name: email.split("@")[0], // Extract name from email
          role: "ADMIN",
        },
        token: "static-admin-token",
      }),
    );

    redirectBasedOnRole("ADMIN");
  };

  const staticRoles = [
    {
      label: "Admin",
      role: "ADMIN" as Role,
      route: "/admin-dashboard",
      name: "Admin User",
      icon: ShieldCheck,
      color: "text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10",
    },
    {
      label: "Manager",
      role: "MANAGER" as Role,
      route: "/manager-dashboard",
      name: "Manager User",
      icon: UserCheck,
      color: "text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10",
    },
    {
      label: "Cashier",
      role: "CASHIER" as Role,
      route: "/cashier-dashboard",
      name: "Cashier User",
      icon: CreditCard,
      color: "text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10",
    },
    {
      label: "Kitchen",
      role: "KITCHEN" as Role,
      route: "/kitchen-dashboard",
      name: "Kitchen Chef",
      icon: ChefHat,
      color: "text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10",
    },
    {
      label: "Serve",
      role: "SERVER" as Role,
      route: "/serve-dashboard",
      name: "Server Staff",
      icon: ConciergeBell,
      color: "text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#111827] p-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row overflow-hidden rounded-xl shadow-2xl bg-[#131b2e] border border-gray-800">
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative">
          <img
            src={loginphoto}
            alt="login visual"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
        </div>

        {/* Right Side Form & Role Buttons */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <h2 className="text-center text-3xl font-bold mb-5">
            <span className="text-[#F54900]">LOG</span> IN
          </h2>

          {/* Quick Static Role Buttons */}
          <div className="mb-6 bg-[#1F2937]/70 p-3.5 rounded-xl border border-gray-700/60">
            <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider mb-2.5">
              ⚡ Quick Role Demo Access
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {staticRoles.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      handleStaticRoleLogin(item.role, item.route, item.name)
                    }
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-[#111827] border border-gray-700 text-gray-200 transition-all active:scale-95 ${item.color}`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center my-2 text-gray-500 text-xs">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3">or login with credentials</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {error && (
            <div className="my-3 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Email */}
            <div>
              <label className="text-xs text-gray-300 mb-1.5 block">Email</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1F2937] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F54900] border border-gray-700/50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-[#1F2937] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F54900] border border-gray-700/50"
                  required
                  disabled={isLoading}
                />
                {pin && (
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPin ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-[#F54900] hover:bg-orange-600 transition font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 text-center space-y-1.5">
            <p className="text-xs text-[#F54900] cursor-pointer hover:underline">
              Forgot Password?
            </p>
            <p className="text-xs text-gray-400">
              Don’t have an account?
              <Link
                to="/signup"
                className="text-[#F54900] hover:text-orange-400 ml-1 font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

