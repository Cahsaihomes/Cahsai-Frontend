"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export default function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bg-black/70 backdrop-blur-sm inset-0 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center mx-4 sm:mx-0">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/checkmark-2.png"
            alt="Success"
            width={64}
            height={64}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Lead Secured, AI Engaged
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Congrats! This buyer is now yours exclusively. Dryvin AI is reaching
          out to the buyer and will update you in Active Leads.
        </p>

        {/* Features */}
        <div className="mt-6 space-y-2 text-left">
          <p className="text-md font-semibold text-gray-800 mt-6">Price Plan</p>
          <p className="text-sm text-gray-500 mt-3">Per Month</p>
          <p className="text-sm text-gray-500 mt-3">
            Get started with Cahsai AI essentials. Perfect for exploring before
            scaling up.
          </p>
          <h3 className="text-md font-semibold">Features</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2 text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Buyer Inquiries via AI Concierge
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Tour Booking Assistance
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Calendar Sync (Basic)
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <XCircle className="w-4 h-4 text-red-500" />
              Smart Lead Distribution
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <XCircle className="w-4 h-4 text-red-500" />
              Automated Follow-Ups
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <XCircle className="w-4 h-4 text-red-500" />
              MLS/CRM Integrations
            </li>
          </ul>
        </div>

        <p className="text-left text-xl font-bold mt-6 bg-[#ECFDF5] text-[#064E3B] rounded-md px-3 py-1 w-fit">
          $0.00
        </p>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#6F8375] text-white py-2 rounded-md hover:bg-[#6F8375] transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
