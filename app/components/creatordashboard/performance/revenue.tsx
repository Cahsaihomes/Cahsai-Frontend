"use client";

const revenueSources = [
  {
    name: "Lead Claim Commissions",
    amount: "$12,845",
    percentage: "58.5%",
    color: "bg-blue-600",
  },
  {
    name: "Brand Sponsorships",
    amount: "$12,845",
    percentage: "58.5%",
    color: "bg-purple-600",
  },
  {
    name: "Featured Listing Bonus",
    amount: "$12,845",
    percentage: "58.5%",
    color: "bg-yellow-500",
  },
  {
    name: "Creator Pool Rewards",
    amount: "$12,845",
    percentage: "58.5%",
    color: "bg-cyan-500",
  },
];

export default function RevenueSources() {
  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] lg:text-[20px] text-[#414651] font-inter font-[500]">
          Revenue Sources
        </h2>
        <p className="text-[12px] lg:text-[14px] text-[#717680] font-inter font-[500]">
          This section outlines the various methods and channels through which
          the company generates its income.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        {revenueSources.map((source, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 border border-[#E9EAEB] rounded-lg px-0 lg:px-4 py-3"
          >
            {/* Left side with dot and label */}
            <div className="flex items-center space-x-2">
              <span
                className={`lg:w-[16px] lg:h-[16px] w-[12px] h-[12px] rounded-full ${source.color}`}
              />
              <span className="text-[16px] lg:text-[20px] font-[600] font-inter text-[#414651]">
                {source.name}
              </span>
            </div>

            {/* Right side with amount and percentage */}
            <div className="text-right">
              <div className="text-[14px] lg:text-[16px] font-semibold text-[#414651]">
                {source.amount}
              </div>
              <div className="text-[12px] lg:text-[14px] text-[#414651]">
                {source.percentage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
