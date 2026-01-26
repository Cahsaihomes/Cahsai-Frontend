import { z } from "zod";

export const setPaymentSchema = z.object({
  userType: z.enum(["real-estate-agent", "property-partner"], {
    errorMap: () => ({ message: "User type is required" }),
  }),
  brokerageName: z.string().optional(),
  licenseNumber: z.string().optional(),
  customBrokerage: z.string().optional(),
  mlsAssociation: z.string().optional(),
  customMlsAssociation: z.string().optional(),
  licenseState: z.string().optional(),
  // COMMENTED: Payment fields are no longer required
  billing: z.string().optional(), // Was: z.string().min(1, "Billing address is required")
  cardHolderName: z.string().optional(), // Was: z.string().min(1, "Card holder name is required")
}).refine(
  (data) => {
    // If user is real estate agent, require MLS fields
    if (data.userType === "real-estate-agent") {
      return (
        data.brokerageName &&
        data.brokerageName.length > 0 &&
        data.licenseNumber &&
        data.licenseNumber.length > 0 &&
        data.mlsAssociation &&
        data.mlsAssociation.length > 0
      );
    }
    // Property partner doesn't need MLS fields
    return true;
  },
  {
    message: "MLS fields are required for Real Estate Agents",
    path: ["brokerageName"],
  }
);

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
