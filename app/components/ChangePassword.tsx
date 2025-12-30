"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import ConfirmModal from "./Modal/ConfirmModal";
import { changePassword, forgotPassword } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { RootState } from "../redux";
import { useForm } from "react-hook-form";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "../validation/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  const dispatch = useDispatch();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const {
    register: reset,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      // await logoutApi();
      // Clear cookies
      if (!user?.email) {
        toast.error("User email not found!");
        return;
      }
      document.cookie =
        "token=; Max-Age=0; path=/; domain=" + window.location.hostname;
      document.cookie =
        "role=; Max-Age=0; path=/; domain=" + window.location.hostname;

      dispatch(logout());

      // Send OTP
      const res = await forgotPassword(user?.email);
      toast.success(
        res.message || "OTP Sent successfully! Redirecting to OTP screen..."
      );
      router.push(`/otp?email=${encodeURIComponent(user?.email)}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Forgot password Failed!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      const res = await changePassword({
        currentPassword: data?.currentPassword,
        newPassword: data?.password,
      });
      toast.success(res.message || "Password changed successful!");
      resetForm();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Change Password failed!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="h-full py-8 lg:py-6 lg:px-6 px-4 bg-white border border-[#D5D7DA] rounded-[12px]">
        <div className="w-full mx-auto">
          {/* Security Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter current password"
                  {...reset("currentPassword")}
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md placeholder:text-gray-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {errors.currentPassword && (
                  <span className="text-sm text-red-500">
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setOpen(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 p-0 h-auto"
                >
                  Forgot password
                </Button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter new password"
                  {...reset("password")}
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md placeholder:text-gray-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
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
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Passwords
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...reset("confirmPassword")}
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md placeholder:text-gray-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {errors.confirmPassword && (
                  <span className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 bg-[#6F8375] hover:bg-[#6F8375] text-white font-medium rounded-md
                    ${isLoading ? "cursor-not-allowed opacity-70" : ""}
                
                  `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                  </>
                ) : (
                  " Save Profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Forgot Password?"
        description="If you continue, you will be logged out and need to log in again after resetting your password. Do you want to proceed?"
        cancelLabel="Cancel"
        confirmLabel="Yes, Continue"
        onCancel={() => console.log("Cancel from parent")}
        onConfirm={handleForgotPassword}
        loading={loading}
        // disableCloseOnOutsideClick // uncomment if you want strict modal
      />
    </>
  );
};

export default ChangePassword;
