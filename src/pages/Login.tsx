import loginphoto from "@/assets/sas/photo/bacground.jpeg";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API call here
    console.log("Login Data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#111827]">
      <div className="max-w-5xl w-full flex overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src={loginphoto}
            alt="login visual"
            className="h-full w-full object-cover rounded-l-xl"
          />
        </div>

        {/* Right Side Form */}
     
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center ">
          <h2 className="text-center text-3xl font-bold mb-6">
            <span className="text-[#F54900]">LOG</span> IN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
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
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#F54900]"
                />

                {form.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
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

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F54900] hover:bg-orange-600 transition font-semibold"
            >
              Login
            </button>
          </form>

          {/* Links */}
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
