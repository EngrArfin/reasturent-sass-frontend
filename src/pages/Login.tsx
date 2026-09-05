import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginphoto from "@/assets/sas/photo/bacground.jpeg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("admin@restaurant.com");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
      SUPERVISOR: "/supervisor-dashboard",
      MANAGER: "/manager-dashboard",
      SERVER: "/serve-dashboard",
      KITCHEN: "/kitchen-dashboard",
      CASHIER: "/cashier-dashboard",
    };
    navigate(roleRoutes[role.toUpperCase()] || "/admin-dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default static login directly into corresponding role dashboard based on email
    const normalizedEmail = email.toLowerCase();
    let assignedRole: "ADMIN" | "SUPERVISOR" | "MANAGER" | "CASHIER" | "KITCHEN" | "SERVER" =
      "ADMIN";

    if (normalizedEmail.includes("supervisor") || normalizedEmail.includes("owner"))
      assignedRole = "SUPERVISOR";
    else if (normalizedEmail.includes("manager")) assignedRole = "MANAGER";
    else if (normalizedEmail.includes("cashier")) assignedRole = "CASHIER";
    else if (normalizedEmail.includes("kitchen") || normalizedEmail.includes("chef"))
      assignedRole = "KITCHEN";
    else if (normalizedEmail.includes("server") || normalizedEmail.includes("waiter"))
      assignedRole = "SERVER";

    const userName = email.includes("@")
      ? email.split("@")[0].toUpperCase()
      : "Demo User";

    dispatch(
      setUser({
        user: {
          id: `static-${assignedRole.toLowerCase()}-id`,
          email: email || "admin@restaurant.com",
          name: userName,
          role: assignedRole,
          tenantId: "static-tenant-id",
        },
        token: `static-${assignedRole.toLowerCase()}-token`,
      }),
    );

    redirectBasedOnRole(assignedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19] p-4 sm:p-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl bg-[#131b2e]/95 border border-[#1F2E4D] backdrop-blur-md">
        {/* Left Side Image & Showcase */}
        <div className="hidden md:flex w-1/2 flex-col justify-between relative p-8 overflow-hidden">
          <img
            src={loginphoto}
            alt="restaurant login visual"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#131b2e]/85 to-[#131b2e]/70" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F54900]/20 border border-[#F54900]/30 text-[#F54900] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Restaurant Platform</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              Restaurant POS & Management
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Unified login with Email and 4-digit PIN for Admin, Managers, Cashiers, Kitchen, and Servers.
            </p>
          </div>

          {/* Bottom Highlight */}
          <div className="relative z-10 pt-8">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-black/40 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Email & 4-Digit PIN Access</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome <span className="text-[#F54900]">Back</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in with your Email Address and 4-Digit PIN.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b253d] text-white text-sm placeholder:text-slate-500 border border-[#26375c] focus:outline-none focus:border-[#F54900] focus:ring-1 focus:ring-[#F54900] transition"
                  required
                />
              </div>
            </div>

            {/* 4-Digit PIN Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                4-Digit PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 4-digit PIN (e.g. 1234)"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1b253d] text-white text-sm placeholder:text-slate-500 border border-[#26375c] focus:outline-none focus:border-[#F54900] focus:ring-1 focus:ring-[#F54900] transition font-mono tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPin ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1b253d] border-[#26375c] text-[#F54900] focus:ring-0 cursor-pointer accent-[#F54900]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-[#F54900] hover:text-orange-400 transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#F54900] hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer hover:shadow-orange-500/40 active:scale-[0.99]"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#1F2E4D] flex items-center justify-between text-xs text-slate-400">
            <span>
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#F54900] hover:text-orange-400 font-semibold transition ml-0.5"
              >
                Sign Up
              </Link>
            </span>
            <span className="text-slate-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
