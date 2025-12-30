"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import SuccessModal from "./SuccessModal";

type CardInfo = {
  name: string;
  expiry: string;
  number: string;
  cvv: string;
};

type Props = {
  onClose: () => void;
};

export default function SubscriptionModal({ onClose }: Props) {
  const [card, setCard] = useState<CardInfo>({
    name: "Olivia Rhye",
    expiry: "06 / 2024",
    number: "",
    cvv: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[620px] p-6 relative">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          {/* Header */}
          <h2 className="text-lg font-semibold">Dryvin Ai</h2>
          <p className="text-md font-semibold text-gray-800 mt-6">
            Price Plan <br />
          </p>
          <p className="text-sm text-gray-500 mt-3">Per Month</p>
          <p className="text-sm text-gray-500 mt-3">
            Get started with Cahsai AI essentials. Perfect for exploring before
            scaling up.
          </p>

          {/* Features */}
          <div className="mt-4 space-y-2">
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

          {/* Price */}
          <p className="inline-block text-2xl font-bold mt-4 bg-[#ECFDF5] text-[#064E3B] rounded-md px-2 py-1">
            $0.00
          </p>

          {/* Form */}
          <form
            className="mt-4 space-y-4 border-t border-gray-200 pt-4 pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              setShowSuccess(true);
            }}
          >
            {/* Row 1: Name + Expiry */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium">Name on card</label>
                <input
                  type="text"
                  value={card.name}
                  placeholder="Olivia Rhye"
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                />
              </div>

              <div className="col-span-1">
                <label className="text-sm font-medium">Expiry</label>
                <input
                  type="text"
                  placeholder="06 / 2024"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                />
              </div>
            </div>

            {/* Row 2: Select Card + CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Select a card</label>
                <div className="relative w-full">
                  <Image
                    src="/images/payment-icon.png"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 pl-14 pr-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                  >
                    <option value="">Card number</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-sm font-medium">CVV</label>
                <input
                  type="password"
                  placeholder="***"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full mt-6 gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm 
    font-medium text-gray-600 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 rounded-md bg-[#6F8375] text-white text-sm 
    font-medium hover:bg-[#6F8375]"
              >
                Get Access
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
            onClose(); // also close subscription modal
          }}
        />
      )}
    </>
  );
}
