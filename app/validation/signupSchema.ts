import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    userName: z.string().min(5, "Username must be at least 5 characters"),
    email: z.string().email("Email address is required"),
    number: z
      .string()
      .min(1, "Contact number is required")
      .refine((val) => /^\d{11}$/.test(val), {
        message: "Contact number must be 11 digits",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms & privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().email("Email address is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email address is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required!"),
    password: z
      .string()
      .min(8, "New Password must be at least 8 characters")
      .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
      .regex(/\d/, "New Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "New Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type SignUpFormValues = z.infer<typeof signUpSchema>;
