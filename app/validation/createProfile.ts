import { z } from "zod";

export const setPaymentSchema = z.object({
  brokerageName: z.string().min(1, "Brokerage name is required"),
  licenseNumber: z.string().min(1, "MLS License Number is required"),
  customBrokerage: z.string().optional(),
  mlsAssociation: z.string().min(1, "MLS Association is required"),
  // cardNumber: z
  //   .string()
  //   .min(13, "Card number must be at least 13 digits")
  //   .max(19, "Card number must be at most 19 digits")
  //   .regex(/^\d+$/, "Card number must contain only digits"),

  // expiryDate: z
  //   .string()
  //   .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  // cvv: z
  //   .string()
  //   .min(3, "CVV must be 3 or 4 digits")
  //   .max(4, "CVV must be 3 or 4 digits")
  //   .regex(/^\d+$/, "CVV must contain only digits"),

  billing: z.string().min(1, "Billing address is required"),
  cardHolderName: z.string().min(1, "Card holder name is required"),
});

export type SetupPaymentFormValues = z.infer<typeof setPaymentSchema>;

export const createProfileSchema = z.object({
  linkedin: z.string().url("Enter a valid LinkedIn URL").optional(),
  instagram: z.string().optional(),
  areasServed: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "ZIP code is required")
          .regex(/^\d+$/, "ZIP code must be a number"),
      })
    )
    .min(1, "At least one ZIP code is required"),
  specializations: z
    .array(z.string())
    .min(1, "Please select at least one specialization"),
  profileImage: z.instanceof(File).optional().or(z.string().url().optional()),
});

export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;
