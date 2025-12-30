"use client";

import { forgotPassword } from "@/app/services/auth.service";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/app/validation/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register: forgot,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data.email);
      toast.success(res.message || "OTP Sent successful!");
      router.push(`/otp?email=${encodeURIComponent(data?.email)}`);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("OTP Sending failed!");
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
            Forgot Password
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your email and we will send you a verification code to get
            back into your account
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
              {...forgot("email")}
              placeholder="Enter your email"
              className="w-full text-[#717680] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
             
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              className={`flex-1 bg-[#6F8375] flex items-center justify-center hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                </>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
