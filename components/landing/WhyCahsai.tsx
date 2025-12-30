"use client";

import { X, Check } from "lucide-react";

export default function WhyCahsai() {
  const oldRealEstate = [
    "Static listings on generic places",
    "Cold outreach and unqualified leads",
    "No creator economy or influencer marketing",
    "Transactional, emotionless browsing",
  ];

  const cahsai = [
    "Emotional video tours that tell a story",
    "Pre-qualified buyers reach out first",
    "Creators earn by showcasing spaces",
    "Discovery that feels inspiring and personal",
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4">
            Why Cahsai Is Different
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto mt-4 sm:mt-6 lg:mt-8">
            Traditional real estate, reimagined for the modern world
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto border-2 border-gray-200 rounded-[20px] p-4 sm:p-6 lg:p-8 bg-white">
          {/* Old Real Estate */}
          <div className="bg-[#A6A6A61A] rounded-lg p-4 sm:p-6 lg:p-8 shadow-md">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-900 mb-4 sm:mb-6">
              Old Real Estate
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {oldRealEstate.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cahsai */}
          <div className="bg-[#6BC5861A] rounded-lg p-4 sm:p-6 lg:p-8 shadow-md">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-black mb-4 sm:mb-6">Cahsai</h3>
            <ul className="space-y-3 sm:space-y-4">
              {cahsai.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
