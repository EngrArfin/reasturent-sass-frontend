import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import mail from "../assets/Auth/telephone.svg";
import password from "../assets/Auth/password.svg";
import loginImg from "../assets/Auth/login.svg";
import CommonButton from "@/components/Reuseable/CommonButton";
import CommonHeading from "@/components/Reuseable/CommonHeading";
import CommonWrapper from "@/common/CommonWrapper";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Define your JWT payload interface
interface CustomJwtPayload extends JwtPayload {
  role: string;
  // Add other custom properties from your JWT if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });
  const [user, setUser] = useState<CustomJwtPayload | null>(null);
  console.log(user);

  const navigate = useNavigate();
  const [login, { isLoading, isSuccess, data }] = useLoginMutation();
  const token = useAppSelector((state) => state?.auth?.token);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setUser(decoded);

        // Redirect based on role from decoded token
        if (decoded.role === "admin") {
          navigate("/admin-dashboard");
        } else if (decoded.role === "marchant") {
          navigate("/merchant-dashboard");
        } else {
          navigate("/"); // Default redirect for other roles
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Store token and user data when login is successful
  useEffect(() => {
    if (isSuccess && data?.data?.accessToken) {
      const { accessToken, user } = data.data;
      Cookies.set("token", accessToken, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [isSuccess, data]);

  const styles = {
    inputWrapper: "relative flex items-center",
    input:
      "w-full py-2 md:py-3 pl-12 pr-4 rounded-[8px] border border-primary-border bg-white focus:outline-none focus:border-blue-400 focus:shadow-2xl placeholder:text-sm placeholder:text-gray-400",
    icon: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 contrast-125",
    errorWrapper: "h-5 mt-1",
    error: "text-sm text-red-500",
  };

  return (
    <CommonWrapper>
      <div className="relative">
        <div className="w-full mx-auto bg-white rounded-[32px] shadow-[0_4px_24px_0_rgba(0,0,0,0.1)] px-6 md:px-[50px] lg:px-[100px] py-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-[67px]">
            <CommonHeading
              title="Login"
              description="We guarantee reliable delivery of your products to your customers, at the right location in the right time through our efficient distribution channel."
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:w-3/4 mx-auto lg:space-y-2"
          >
            {/* Email */}
            <div>
              <div className={styles.inputWrapper}>
                <img src={mail} className={styles.icon} alt="Email Icon" />
                <input
                  type="email"
                  placeholder="Email address"
                  {...register("email")}
                  className={styles.input}
                />
              </div>
              <div className={styles.errorWrapper}>
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className={styles.inputWrapper}>
                <img
                  src={password}
                  className={styles.icon}
                  alt="Password Icon"
                />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={styles.input}
                />
              </div>
              <div className={styles.errorWrapper}>
                {errors.password && (
                  <p className={styles.error}>{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <CommonButton
              btnTitle={isLoading ? "Logging in..." : "Login"}
              type="submit"
              disabled={isLoading}
            />

            {/* Signup Link */}
            <p className="text-center text-sm text-paragraph-gray mt-3">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-primary-orange cursor-pointer font-semibold">
                  SignUp here
                </span>
              </Link>
            </p>
          </form>

          {/* Illustration */}
          <img
            src={loginImg}
            alt="Login Illustration"
            className="absolute bottom-4 left-1 pr-6 w-[160px] md:w-[180px] lg:w-[220px] hidden lg:block"
          />
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Login;
