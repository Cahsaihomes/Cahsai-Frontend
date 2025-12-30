"use client";

import type React from "react";

import { Inter } from "next/font/google";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetPassword } from "@/app/services/auth.service";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/app/validation/signupSchema";

const inter = Inter({ subsets: ["latin"] });

export default function CreateNewPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const {
    register: reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      const res = await resetPassword({ email, newPassword: data?.password });
      toast.success(res.message || "Password reset successful!");
      router.push("/password-updated");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Reset Password failed!");
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
            Create New Password
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your email and we will send you a verification code to get
            back into your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                {...reset("password")}
                placeholder="Enter new password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
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

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...reset("confirmPassword")}
                placeholder="Confirm new password"
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

          {/* Set New Password Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer flex items-center justify-center bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200
                 ${loading ? "cursor-not-allowed opacity-70" : ""}
                `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
              </>
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
