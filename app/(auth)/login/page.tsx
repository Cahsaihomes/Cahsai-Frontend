"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/app/validation/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { loginSuccess } from "@/app/redux/slices/authSlice";
import { loginApi } from "@/app/services/auth.service";
const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const res = await loginApi(payload);

      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));

      Cookies.set("token", res.data.token, { path: "/" });
      Cookies.set("role", res.data.user.role, { path: "/" });

      toast.success(res.message || "Login successful!");

      if (res.data.user?.emailVerified) {
        if (res.data.user.role === "agent") {
          router.push("/agentdashboard/home");
        }
        if (res.data.user.role === "buyer") {
          router.push("/buyerdashboard/home-screen");
        }
        if (res.data.user.role === "creator") {
          router.push("/creatordashboard/home");
        }
        if (res.data.user.role === "admin") {
          router.push("/admin/dashboard");
        }
      } else {
        router.push(`/otp?id=true&email=${encodeURIComponent(data?.email)}`);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        const msg = err.response.data.message;

        if (msg.includes("not verified")) {
          toast.error(msg);
          router.push(`/otp?id=true&email=${encodeURIComponent(data?.email)}`);
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Login failed!");
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
        className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full"
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Login with Email
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the required credentials to login to your account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...login("email")}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...login("password")}
                placeholder="Enter password"
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
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <span
                onClick={() => router.push("/forgot-password")}
                className="text-sm cursor-pointer text-gray-700 hover:text-[#6F8375] hover:underline"
              >
                Forgot password
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            // className="w-full bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 mt-8"
            className={`w-full flex items-center justify-center gap-2 bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/")}
              className="text-[#6F8375] hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
