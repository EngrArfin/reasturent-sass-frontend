import signupphoto from "@/assets/sas/photo/bacground.jpeg";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup Data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#111827]">
      <div className="max-w-5xl w-full flex overflow-hidden rounded-xl">
        {/* Left Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src={signupphoto}
            alt="signup"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-3xl font-bold mb-2">
            <span className="text-[#F54900]">SIGN</span> UP
          </h2>

          <p className="text-center text-sm text-gray-400 mb-6">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white 
                focus:outline-none focus:ring-2 focus:ring-[#F54900]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Phone</label>
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white 
                focus:outline-none focus:ring-2 focus:ring-[#F54900]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white 
                focus:outline-none focus:ring-2 focus:ring-[#F54900]"
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
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white 
                  focus:outline-none focus:ring-2 focus:ring-[#F54900]"
                />

                {form.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

            {/* Re-type Password */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Re-type Password
              </label>
              <div className="relative">
                <input
                  name="retypePassword"
                  type={showRetypePassword ? "text" : "password"}
                  value={form.retypePassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1F2937] text-white 
                  focus:outline-none focus:ring-2 focus:ring-[#F54900]"
                />

                {form.retypePassword && (
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showRetypePassword ? (
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
              className="w-full py-3 rounded-xl bg-[#F54900] hover:bg-orange-600 
              transition font-semibold mt-2"
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <p className="text-sm text-gray-400 mt-5 text-center">
            Already have an account?
            <a
              href="/login"
              className="text-[#F54900] hover:text-orange-400 ml-1"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
