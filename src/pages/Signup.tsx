// src/pages/Signup.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useEffect } from "react";

import img from "../assets/Auth/signup.svg";
import business from "../assets/Auth/business.svg";
import name from "../assets/Auth/name.svg";
import address from "../assets/Auth/address.svg";
import phone from "../assets/Auth/telephone.svg";
import mail from "../assets/Auth/gmail.svg";
import password from "../assets/Auth/password.svg";
import CommonButton from "@/components/Reuseable/CommonButton";
import CommonHeading from "@/components/Reuseable/CommonHeading";
import CommonWrapper from "@/common/CommonWrapper";

const signupSchema = z
  .object({
    name: z.string().min(2, "Full Name is required"),
    businessName: z.string().min(1, "Business name is required"),
    address_Pickup_Location: z.string().min(1, "Address is required"),
    phone: z
      .string()
      .regex(/^\d+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({ resolver: zodResolver(signupSchema) });

  const navigate = useNavigate();
  const [registerUser, { isLoading, isSuccess }] = useRegisterMutation();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      await registerUser({
        name: data.name,
        businessName: data.businessName,
        address_Pickup_Location: data.address_Pickup_Location,
        phone: data.phone,
        email: data.email,
        password: data.password,
      }).unwrap();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const styles = {
    inputWrapper: "relative flex items-center",
    input:
      "w-full py-2 md:py-3 pl-12 pr-4 rounded-[8px] border border-primary-border bg-white focus:outline-none focus:border-blue-400 focus:shadow-2xl placeholder:text-sm placeholder:text-gray-400",
    icon: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 contrast-125",
    errorWrapper: "h-5 mt-1",
    error: "text-sm text-red-500",
    checkbox:
      "mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer",
    termsLabel: "text-sm text-gray-600",
  };

  return (
    <CommonWrapper>
      <div>
        <div className="w-full mx-auto bg-white rounded-[32px] shadow-[0_4px_24px_0_rgba(0,0,0,0.1)] px-6 md:px-[50px] lg:px-[100px] py-10">
          <div className="text-center mb-12 md:mb-[67px]">
            <CommonHeading
              title="Sign Up"
              description="We guarantee reliable delivery of your products to your customers, at the right location in the right time through our efficient distribution channel."
            />
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            {/* Left Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:space-y-2"
            >
              {/* Business Name */}
              <div>
                <div className={styles.inputWrapper}>
                  <img
                    src={business}
                    className={styles.icon}
                    alt="Business Icon"
                  />
                  <input
                    type="text"
                    placeholder="Your business name"
                    {...register("businessName")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.errorWrapper}>
                  {errors.businessName && (
                    <p className={styles.error}>
                      {errors.businessName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <div className={styles.inputWrapper}>
                  <img src={name} className={styles.icon} alt="Name Icon" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    {...register("name")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.errorWrapper}>
                  {errors.name && (
                    <p className={styles.error}>{errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <div className={styles.inputWrapper}>
                  <img
                    src={address}
                    className={styles.icon}
                    alt="Address Icon"
                  />
                  <input
                    type="text"
                    placeholder="Address of your pickup location"
                    {...register("address_Pickup_Location")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.errorWrapper}>
                  {errors.address_Pickup_Location && (
                    <p className={styles.error}>
                      {errors.address_Pickup_Location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className={styles.inputWrapper}>
                  <img src={phone} className={styles.icon} alt="Phone Icon" />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    {...register("phone")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.errorWrapper}>
                  {errors.phone && (
                    <p className={styles.error}>{errors.phone.message}</p>
                  )}
                </div>
              </div>

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

              {/* Confirm Password */}
              <div>
                <div className={styles.inputWrapper}>
                  <img
                    src={password}
                    className={styles.icon}
                    alt="Confirm Password Icon"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.errorWrapper}>
                  {errors.confirmPassword && (
                    <p className={styles.error}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className={styles.checkbox}
                />
                <label className={styles.termsLabel}>
                  By clicking Sign up you are agreeing with our{" "}
                  <span className="font-semibold">Terms & Condition</span>
                </label>
              </div>
              <div className={styles.errorWrapper}>
                {errors.terms && (
                  <p className={styles.error}>{errors.terms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <CommonButton
                btnTitle={isLoading ? "Registering..." : "Sign up"}
                type="submit"
                disabled={isLoading}
              />

              <p className="text-center text-sm text-paragraph-gray mt-3">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="text-primary-orange cursor-pointer font-semibold">
                    Login here
                  </span>
                </Link>
              </p>
            </form>

            {/* Right Image */}
            <div className="hidden md:block">
              <img src={img} alt="Signup Illustration" className="w-[282px] " />
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Signup;
