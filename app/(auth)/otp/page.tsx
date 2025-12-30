"use client";

import type React from "react";

import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  forgotPassword,
  forgotPasswordOtpVerify,
  verifyOtp,
} from "@/app/services/auth.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const id = searchParams.get("id") || "";
  const [countdown, setCountdown] = useState(58);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!otp || otp.some((digit) => !digit)) {
        toast.error("Please enter the OTP");
        return;
      }

      if (id) {
        const res = await verifyOtp(email, String(otp.join("")));
        toast.success(res.message || "Email Verified successful!");
        router.push(`/login`);
      } else {
        const res = await forgotPasswordOtpVerify(email, String(otp.join("")));
        toast.success(res.message || "OTP Verified successful!");
        router.push(`/new-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("OTP Verification failed!");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async () => {
    try {
      const res = await forgotPassword(email);
      toast.success(res.message || "OTP Resend successful!");

      if (res && canResend) {
        setCountdown(58);
        setCanResend(false);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("OTP Resend failed!");
      }
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
            OTP Verification
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the verification code we have sent to your email address.
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent"
              maxLength={1}
            />
          ))}
        </div>

        {/* Resend Code */}
        <div className="text-center mb-8">
          {canResend ? (
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-[#6F8375] hover:underline"
            >
              Resent code
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Resent code in: {formatTime(countdown)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full cursor-pointer flex items-center justify-center bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={otp.some((digit) => !digit) || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}
