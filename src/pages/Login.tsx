import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import loginphoto from "@/assets/sas/photo/bacground.jpeg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
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
      SERVER: "/server-dashboard",
      KITCHEN: "/kitchen-dashboard",
      CASHIER: "/cashier-dashboard",
    };
    navigate(roleRoutes[role] || "/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !pin) {
      setError("Please enter both email and password");
      return;
    }

    try {
      // Send login request with email and pin (matching Swagger)
      const result = await login({ email, pin }).unwrap();

      // Dispatch user data based on Swagger response
      dispatch(
        setUser({
          user: {
            id: result.user.sub,
            email: result.user.email,
            name: result.user.email.split("@")[0], // Extract name from email
            role: result.user.role.toUpperCase(),
          },
          token: result.accessToken,
        }),
      );

      // Redirect based on role from response
      redirectBasedOnRole(result.user.role.toUpperCase());
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err?.data?.message ||
          err?.error ||
          "Login failed. Please check your email and password.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#111827]">
      <div className="max-w-5xl w-full flex overflow-hidden rounded-xl shadow-lg">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src={loginphoto}
            alt="login visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-3xl font-bold mb-6">
            <span className="text-[#F54900]">LOG</span> IN
          </h2>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
                  required
                  disabled={isLoading}
                />

                {pin && (
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPin ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-[#F54900] hover:bg-orange-600 transition font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-5 text-center space-y-2">
            <p className="text-sm text-[#F54900] cursor-pointer">
              Forgot Password?
            </p>

            <p className="text-sm text-gray-400">
              Don’t have an account?
              <Link
                to="/signup"
                className="text-[#F54900] hover:text-orange-400 ml-1"
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
