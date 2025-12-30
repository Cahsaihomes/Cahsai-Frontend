"use client";

import React from "react";

import { Inter } from "next/font/google";

import PaymentSetupForm from "./PaymentSetupForm";
import StripeProviderWrapper from "@/app/components/StripeWrapper";

const inter = Inter({ subsets: ["latin"] });
export default function CreateProfilePage() {
  return (
    <div
      className={`min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4 ${inter.className}`}
    >
      <div
        className="bg-white rounded-xl w-[560px] lg:p-6 p-0"
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
          <h1 className="text-[30px] font-[500] text-gray-900 mb-2">
            Get Started with <span className="font-[600]">Cahsia</span>
          </h1>
          <p className="text-[#535862] text-[16px] font-[500]">
            Enter your MLS details to access qualified leads—no charges until
            you claim them.
          </p>
        </div>

        {/* Form */}
        <StripeProviderWrapper>
          <PaymentSetupForm />
        </StripeProviderWrapper>
      </div>
    </div>
  );
}
