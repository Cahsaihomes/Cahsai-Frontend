"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignUpFormValues, signUpSchema } from "@/app/validation/signupSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { signupSuccess } from "@/app/redux/slices/authSlice";
import { signup } from "@/app/services/auth.service";

const inter = Inter({ subsets: ["latin"] });

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  if (!roleParam || !["buyer", "agent", "creator"].includes(roleParam)) {
    router.replace("/");
    return null;
  }
  const role = roleParam as "buyer" | "agent" | "creator";
  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true);
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        user_name: data.userName,
        email: data.email,
        role: role as "buyer" | "agent" | "creator",
        contact: data.number,
        password: data.password,
        acceptedTerms: data.acceptTerms,
      };

      const res = await signup(payload);

      dispatch(signupSuccess({ user: res.data }));

      Cookies.set("role", role, { path: "/" });
      Cookies.set("user", JSON.stringify(res.data), { path: "/" });

      toast.success(res.message || "Sign up successful!");
      if (role === "agent") {
        router.push("/setup-payment");
      } else {
        router.push("/success");
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Sign up failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4 ${inter.className}`}
    >
      <div
  className="bg-white rounded-xl w-full max-w-[458px] p-4 sm:p-6"
  style={{
    boxShadow: `
      8px 11px 30px 0px #00000008,
      30px 45px 54px 0px #00000008,
      68px 102px 73px 0px #00000005,
      120px 181px 87px 0px #00000000,
      188px 283px 95px 0px #00000000
    `,
  }}
>

        <div className="text-center mb-8">
          <h1 className="text-[30px] font-[500] text-gray-900 mb-2">
            Sign Up to <span className="font-[600]">Cahsia</span>
          </h1>
          <p className="text-[#535862] text-[16px] font-[500]">
            Create account with easy and fast method.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              First Name
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="Enter your First Name"
              // className="border w-full p-2 rounded text-[#717680]"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Last Name
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="Enter your Last Name"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="userName"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              User Name
            </label>
            <input
              id="userName"
              {...register("userName")}
              placeholder="Enter your User Name"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.userName && (
              <span className="text-sm text-red-500">
                {errors.userName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="number"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Contact
            </label>
            <input
              id="number"
              {...register("number")}
              type="tel"
              placeholder="Enter your Number"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.number && (
              <span className="text-sm text-red-500">
                {errors.number.message}
              </span>
            )}
          </div>
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password ? (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            ) : (
              <span className="text-sm text-[#535862]">
                Must be at least 8 characters.
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmed-password"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmed-password"
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className={`h-4 w-4 rounded border 
      ${errors.acceptTerms ? "focus:ring-red-500" : "border-[#7E7E7E]"} 
      focus:ring-2 focus:ring-offset-0 `}
            />
            <span
              className={`${inter.className} font-medium text-[16px] leading-6 text-[#7E7E7E]`}
            >
              I accept the terms & privacy policy.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            // className="w-full cursor-pointer bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
            className={`w-full flex items-center justify-center gap-2 bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-[#6F8375] hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
