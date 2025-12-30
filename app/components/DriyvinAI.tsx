"use client";
import Image from "next/image";
import check from "./../../public/icons/check-circle.png";
import check_white from "./../../public/icons/check-circle-white.png";
import cross from "./../../public/icons/cross-circle.png";
import { useState } from "react";
import SubscriptionModal from "./Modal/SubscriptionModal";

const DriyvinAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="border border-[#D5D7DA] bg-white rounded-[12px] w-full px-4 py-6 sm:px-6 lg:px-10">
        {/* heading */}
        <div className="flex flex-col gap-1 w-full">
          <span className="font-inter font-semibold text-2xl lg:text-[24px] lg:leading-[38px] text-[#434342] px-2 py-1 rounded">
            Dryvin AI
          </span>
          <span className="font-inter text-base lg:text-[16px] lg:leading-[24px] text-[#434342] rounded px-2">
            Dryvin AI Price Plan
          </span>
        </div>

        {/* Plan Wrapper */}
        <div className="mt-8 flex flex-col md:flex-row md:justify-center md:items-stretch gap-6 lg:gap-[32px] max-w-[756px] mx-auto">
          {/* Plan Card 1 */}
          <div className="w-full md:w-1/2 lg:w-[362px] lg:h-[700px] rounded-[16px] bg-white shadow-[0px_8px_80px_0px_#A7A7A73D] p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
            {/* Plan Title */}
            <span className="font-inter font-medium text-base lg:text-[16px] text-[#6F8375]">
              Basic Access
            </span>

            {/* Price Section */}
            <div className="flex items-end gap-2">
              <span className="font-inter font-semibold text-4xl lg:text-[60px] text-[#282828]">
                $0
              </span>
              <span className="font-inter font-semibold text-sm lg:text-[16px] text-[#8593A3]">
                Per month
              </span>
            </div>

            {/* Description */}
            <p className="font-inter text-sm lg:text-[16px] text-[#8593A3]">
              Get started with Cahsai AI essentials. Perfect for exploring before scaling up.
            </p>

            <div className="w-full h-px bg-[#8593A329]" />

            {/* Features */}
            <div className="flex flex-col gap-3 lg:gap-4">
              {[
                "Buyer Inquiries via AI Concierge",
                "Tour Booking Assistance",
                "Calendar Sync (Basic)",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Image src={check} alt="check" width={24} height={24} />
                  <span className="font-inter text-sm lg:text-[16px] text-[#8593A3]">
                    {item}
                  </span>
                </div>
              ))}
              {[
                "Advanced Analytics Dashboard",
                "Smart Lead Distribution",
                "MLS/CRM Integrations",
                "Automated Follow-Ups",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Image src={cross} alt="cross" width={24} height={24} />
                  <span className="font-inter text-sm lg:text-[16px] text-[#8593A3]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="w-full h-12 lg:h-[60px] p-3 rounded-full border border-[#8593A352] font-inter font-semibold text-base lg:text-[18px] text-[#8593A3] hover:bg-[#f5f5f5] transition"
            >
              Join for free
            </button>

            {isOpen && <SubscriptionModal onClose={() => setIsOpen(false)} />}
          </div>

          {/* Plan Card 2 */}
          <div className="w-full md:w-1/2 lg:w-[362px] lg:h-[751px] rounded-[16px] bg-[#6F8375] shadow-[0px_8px_80px_0px_#05796B52] p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
            <span className="font-inter font-medium text-base lg:text-[16px] text-white">
              DRYVIN PRO
            </span>

            <div className="flex items-end gap-2">
              <span className="font-inter font-semibold text-4xl lg:text-[60px] text-white">
                $495
              </span>
              <span className="font-inter font-semibold text-sm lg:text-[16px] text-white">
                Per month
              </span>
            </div>

            <p className="font-inter text-sm lg:text-[16px] text-white">
              Get started with Cahsai AI essentials. Perfect for exploring before scaling up.
            </p>

            <div className="w-full h-px bg-[#FFFFFF52]" />

            <div className="flex flex-col gap-3 lg:gap-4">
              {[
                "AI Concierge with Human-Like Tone",
                "Smart Lead Prioritization & Distribution",
                "Automated SMS/Email Follow-Ups",
                "Multiple Devices & CRM Sync",
                "Compliance (MLS + Twilio Integration)",
                "Auto-Lock Budget Controls",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Image src={check_white} alt="check" width={24} height={24} />
                  <span className="font-inter text-sm lg:text-[16px] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full h-12 lg:h-[60px] rounded-full border border-[#FFFFFF52] shadow-[0px_24px_40px_0px_#00000040] font-inter font-semibold text-base lg:text-[18px] text-[#434342] bg-white hover:bg-[#f5f5f5] transition">
              Get Pro Access
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriyvinAI;
