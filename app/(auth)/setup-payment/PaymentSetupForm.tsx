"use client";

import { RootState } from "@/app/redux";
import { agentPymentDetails } from "@/app/services/auth.service";
import {
  setPaymentSchema,
  SetupPaymentFormValues,
} from "@/app/validation/createProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const PaymentSetupForm = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const isFormComplete =
    cardNumberComplete && cardExpiryComplete && cardCvcComplete;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetupPaymentFormValues>({
    resolver: zodResolver(setPaymentSchema),
  });

  const brokerageValue = watch("brokerageName");

  const onSubmit = async (data: SetupPaymentFormValues) => {
    let finalData = { ...data };

    if (data.brokerageName === "Not Listed") {
      finalData.brokerageName = data.customBrokerage || "";
    }
    delete (finalData as any).customBrokerage;
    setLoading(true);

    if (!user || !stripe || !elements) return;

    try {
      if (!stripe) throw new Error("Stripe failed to load.");

      const cardNumber = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);
      console.log(isFormComplete);
      if (!cardNumber || !cardExpiry || !cardCvc) {
        toast.error("Please enter complete card details.");
        setLoading(false);
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name: data.cardHolderName,
          address: {
            line1: data.billing,
          },
          email: user?.email,
        },
      });

      if (error || !paymentMethod) {
        console.error("Stripe Token Error:", error);
        toast.error(error?.message || "Failed to generate Stripe token.");
        return;
      }

      const customerRes = await axios.post("/api/add-customer", {
        name: data.cardHolderName,
        email: user?.email,
        paymentMethodId: paymentMethod.id,
      });

      const customerData = await customerRes.data;

      if (customerRes.status !== 200) {
        throw new Error(
          customerData.error || "Failed to create Stripe customer."
        );
      }

      const cardInfo = paymentMethod.card;
      const expMonth = String(cardInfo?.exp_month).padStart(2, "0");
      const expYear = String(cardInfo?.exp_year).slice(-2);

      const payload = {
        userId: user?.id,
        brokerageName: data?.brokerageName,
        mlsLicenseNumber: data?.licenseNumber,
        mlsAssociation: data?.mlsAssociation,
        cardNumber: String(cardInfo?.last4),
        cardExpiryDate: `${expMonth}/${expYear}`,
        cardBrand: cardInfo?.brand || "",
        billingAddress: data?.billing,
        cardHolderName: data?.cardHolderName,
      };

      const res = await agentPymentDetails(payload);
      toast.success(res.message || "Payment Details Added successful!");
      router.push("/create-profile");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Agent Payment Creation failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Brokerage Name */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            Brokerage Name
          </label>

          <select
            {...register("brokerageName")}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
          >
            <option value="">Select your Brokerage</option>
            <option value="Compass">Compass</option>
            <option value="Coldwell Banker">Coldwell Banker</option>
            <option value="Keller Williams">Keller Williams</option>
            <option value="Century 21">Century 21</option>
            <option value="Not Listed">
              {" "}
              Not in the list - enter manually
            </option>
          </select>

          {brokerageValue === "Not Listed" && (
            <input
              type="text"
              placeholder="Enter your Brokerage"
              {...register("customBrokerage", {
                required: "Please enter your brokerage name",
              })}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
          )}

          {errors.brokerageName && (
            <span className="text-sm text-red-500">
              {errors.brokerageName.message}
            </span>
          )}
          {errors.customBrokerage && (
            <span className="text-sm text-red-500">
              {errors.customBrokerage.message}
            </span>
          )}
        </div>

        {/* MLS License Number */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            MLS License Number
          </label>
          <input
            {...register("licenseNumber")}
            placeholder="Enter your MLS license number"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
          />
          {errors.licenseNumber && (
            <span className="text-sm text-red-500">
              {errors.licenseNumber.message}
            </span>
          )}
        </div>

        {/* MLS Association */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            MLS Association
          </label>
          <select
            {...register("mlsAssociation")}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
          >
            <option value="">Select MLS Association</option>
            <option value="CRMLS">CRMLS (California)</option>
            <option value="Bright">Bright MLS (East Coast)</option>
            <option value="HARMLS">HARMLS (Texas)</option>
            <option value="Stellar">Stellar MLS (Florida)</option>
          </select>
          {errors.mlsAssociation && (
            <span className="text-sm text-red-500">
              {errors.mlsAssociation.message}
            </span>
          )}
        </div>

        {/* Payment Setup Title */}
        <span className="font-inter font-medium text-[18px] leading-7 text-[#414651] block">
          Payment Setup
        </span>

        {/* Card Number */}

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            Card Number
          </label>
          <div className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-[#6F8375] text-sm focus-within:border-[#6F8375] transition-all">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1F2937",
                    backgroundColor: "#F9FAFB",
                    "::placeholder": {
                      color: "#6B7280",
                    },
                  },
                  invalid: {
                    color: "#EF4444",
                  },
                },
              }}
              onChange={(e) => setCardNumberComplete(e.complete)}
            />
          </div>

          <span className="text-sm text-[#535862]">
            Your card will only be charged when you claim leads.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px] leading-6 text-[#414651]">
              Expiry Date
            </label>

            <div className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-[#6F8375] text-sm focus-within:border-[#6F8375] transition-all">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1F2937",
                      backgroundColor: "#F9FAFB",
                      "::placeholder": {
                        color: "#6B7280",
                      },
                    },
                    invalid: {
                      color: "#EF4444",
                    },
                  },
                }}
                onChange={(e) => setCardExpiryComplete(e.complete)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px] leading-6 text-[#414651]">
              CVV
            </label>

            <div className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-[#6F8375] text-sm focus-within:border-[#6F8375] transition-all">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1F2937",
                      backgroundColor: "#F9FAFB",
                      "::placeholder": {
                        color: "#6B7280",
                      },
                    },
                    invalid: {
                      color: "#EF4444",
                    },
                  },
                }}
                onChange={(e) => setCardCvcComplete(e.complete)}
              />
            </div>
          </div>
        </div>
        {/* card holder name */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            Card Holder Name
          </label>
          <input
            {...register("cardHolderName")}
            placeholder="e.g., 501 Market Street, San Francisco"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
          />
          {errors.cardHolderName && (
            <span className="text-sm text-red-500">
              {errors.cardHolderName.message}
            </span>
          )}
        </div>
        {/* Billing */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px] leading-6 text-[#414651]">
            Billing Address
          </label>
          <input
            {...register("billing")}
            placeholder="e.g., 501 Market Street, San Francisco"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
          />
          {errors.billing && (
            <span className="text-sm text-red-500">
              {errors.billing.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
            </>
          ) : (
            "Continue"
          )}
        </button>

        {/* Login Link */}
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
    </>
  );
};

export default PaymentSetupForm;
