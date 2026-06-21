// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import loginphoto from "@/assets/Photo/heroImage.png";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(""); // Changed from password to pin
  const [showPin, setShowPin] = useState(false); // Renamed from showPassword
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
  }, [user]);

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
      setError("Please enter both email and PIN");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err?.data?.message ||
          err?.error ||
          "Login failed. Please check your email and PIN.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="max-w-5xl w-full flex overflow-hidden">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src={loginphoto}
            alt="illustration"
            className="h-full w-full object-cover rounded-l-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-center text-3xl md:text-4xl font-sans font-semibold tracking-wide mb-4 text-gray-800">
            LOGIN
          </h2>

          <p className="text-start text-base md:text-lg mb-6 text-gray-600">
            Access to PRIMEPOS Services
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-[#FFB004] focus:border-transparent outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="pin" className="text-gray-700 mb-2 font-medium">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 pr-12 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FFB004] focus:border-transparent outline-none transition-all"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-center font-semibold text-gray-800 px-7 rounded-xl bg-linear-to-b from-[#FFB004] to-[#F3DA7F] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import loginphoto from "@/assets/sas/photo/bacground.jpeg";
// import { useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Link } from "react-router-dom";

// type FormState = {
//   email: string;
//   password: string;
// };

// const Login = () => {
//   const [form, setForm] = useState<FormState>({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const togglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // TODO: Replace with API call
//     console.log("Login Data:", form);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center text-white bg-[#111827]">
//       <div className="max-w-5xl w-full flex overflow-hidden rounded-xl shadow-lg">
//         {/* Left Side */}
//         <div className="hidden md:flex w-1/2 items-center justify-center">
//           <img
//             src={loginphoto}
//             alt="login visual"
//             className="h-full w-full object-cover"
//           />
//         </div>

//         {/* Right Side */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <h2 className="text-center text-3xl font-bold mb-6">
//             <span className="text-[#F54900]">LOG</span> IN
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label className="text-sm text-gray-300 mb-2 block">
//                 Email
//               </label>

//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-sm text-gray-300 mb-2 block">
//                 Password
//               </label>

//               <div className="relative">
//                 <input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
//                   required
//                 />

//                 {form.password && (
//                   <button
//                     type="button"
//                     onClick={togglePassword}
//                     className="absolute right-3 top-3 text-gray-400 hover:text-white"
//                   >
//                     {showPassword ? (
//                       <AiOutlineEyeInvisible size={22} />
//                     ) : (
//                       <AiOutlineEye size={22} />
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full py-3 rounded-xl bg-[#F54900] hover:bg-orange-600 transition font-semibold"
//             >
//               Login
//             </button>
//           </form>

//           {/* Footer Links */}
//           <div className="mt-5 text-center space-y-2">
//             <p className="text-sm text-[#F54900] cursor-pointer">
//               Forgot Password?
//             </p>

//             <p className="text-sm text-gray-400">
//               Don’t have an account?
//               <Link
//                 to="/signup"
//                 className="text-[#F54900] hover:text-orange-400 ml-1"
//               >
//                 Register
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// // import loginphoto from "@/assets/sas/photo/bacground.jpeg";
// // import { useState } from "react";
// // import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// // import { Link } from "react-router-dom";

// // const Login = () => {
// //   const [form, setForm] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   const [showPassword, setShowPassword] = useState(false);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;

// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     // TODO: API call here
// //     console.log("Login Data:", form);
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center text-white bg-[#111827]">
// //       <div className="max-w-5xl w-full flex overflow-hidden">
// //         {/* Left Side Image */}
// //         <div className="hidden md:flex w-1/2 items-center justify-center">
// //           <img
// //             src={loginphoto}
// //             alt="login visual"
// //             className="h-full w-full object-cover rounded-l-xl"
// //           />
// //         </div>

// //         {/* Right Side Form */}

// //         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center ">
// //           <h2 className="text-center text-3xl font-bold mb-6">
// //             <span className="text-[#F54900]">LOG</span> IN
// //           </h2>

// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             {/* Email */}
// //             <div>
// //               <label className="text-sm text-gray-300 mb-2 block">Email</label>
// //               <input
// //                 name="email"
// //                 type="email"
// //                 value={form.email}
// //                 onChange={handleChange}
// //                 placeholder="Enter your email"
// //                 className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
// //               />
// //             </div>

// //             {/* Password */}
// //             <div>
// //               <label className="text-sm text-gray-300 mb-2 block">
// //                 Password
// //               </label>

// //               <div className="relative">
// //                 <input
// //                   name="password"
// //                   type={showPassword ? "text" : "password"}
// //                   value={form.password}
// //                   onChange={handleChange}
// //                   placeholder="Enter your password"
// //                   className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
// //                 />

// //                 {form.password && (
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword((prev) => !prev)}
// //                     className="absolute right-3 top-3 text-gray-400 hover:text-white"
// //                   >
// //                     {showPassword ? (
// //                       <AiOutlineEyeInvisible size={22} />
// //                     ) : (
// //                       <AiOutlineEye size={22} />
// //                     )}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Button */}
// //             <button
// //               type="submit"
// //               className="w-full py-3 rounded-xl bg-[#F54900] hover:bg-orange-600 transition font-semibold"
// //             >
// //               Login
// //             </button>
// //           </form>

// //           {/* Links */}
// //           <div className="mt-5 text-center space-y-2">
// //             <p className="text-sm text-[#F54900] cursor-pointer">
// //               Forgot Password?
// //             </p>

// //             <p className="text-sm text-gray-400">
// //               Don’t have an account?
// //               <Link
// //                 to="/signup"
// //                 className="text-[#F54900] hover:text-orange-400 ml-1"
// //               >
// //                 Register
// //               </Link>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
