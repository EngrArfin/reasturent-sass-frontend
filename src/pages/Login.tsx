import loginphoto from "@/assets/sas/photo/bacground.jpeg";
import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center  text-white">
      <div className="max-w-5xl w-full  flex overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2  items-center justify-center">
          <img
            src={loginphoto}
            alt="artist"
            className="h-full w-full object-cover rounded-l-xl"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-sans mb-2">
            LOG IN
          </h2>

          <form className="space-y-4">
            {/* Email */}
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="text-white font-sans mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-[20px] bg-[#0F2B2E] text-white focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="text-white font-sans mb-2">
                Password
              </label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-[20px] bg-[#0F2B2E] text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                />

                {/* Show eye only if password is not empty */}
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>
            {/* Login Button */}
            <Link to="/admin-dashboard">
              <button
                type="submit"
                className="w-full bg-[#346778] text-white hover:bg-[#114050] font-sans py-3 rounded-[20px] transition cursor-pointer"
              >
                Login
              </button>
            </Link>
          </form>

          <p className="text-sm text-[#01D449] mt-4 text-center">
            Forget Password
          </p>
          <p className="text-sm text-gray-400 mt-4 text-center ">
            Don’t have an account?
            <a href="/signup" className="text-blue-400 hover:text-sky-300 ml-1">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
