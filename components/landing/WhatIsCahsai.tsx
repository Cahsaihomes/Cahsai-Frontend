"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function WhatIsCahsai() {
  return (
    <section className="py-8 sm:py-14 lg:py-18 bg-white" id="what-is-cahsai">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4">
            What is Cahsai?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-4 sm:mt-6 lg:mt-8">
            A platform that bridges emotion and transaction—where discovery feels
            cinematic, influence is rewarded, and connections lead to real results.
          </p>
        </div>

        {/* For Buyers & Creators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* For Buyers */}
          <div>
            <div className="bg-white rounded-[12px] shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <Image
                  src="/images/for-buyer-img.png"
                  alt="For Buyers"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain rounded-lg mb-6 sm:mb-8 lg:mb-10"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
                  For Buyers
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed transition-colors duration-300 pb-6">
                  Save homes to your Dreamboard. Watch video tours. Connect with agents when you're ready to move forward.
                </p>
              </div>
            </div>
          </div>

          {/* For Creators */}
          <div>
            <div className="bg-white rounded-[12px] shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <Image
                  src="/images/for-creator-img.png"
                  alt="For Creators"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain rounded-lg mb-6 sm:mb-8 lg:mb-10"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
                  For Creators
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed transition-colors duration-300">
                 Show spaces you love. Tag homes, apartments, decor, and products. Earn from affiliate links, brand deals, and lead conversions: all from your content.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Agents */}
        <div>
          <div className="bg-white rounded-[12px] shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer">
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <Image
                src="/images/for-agent-img.png"
                alt="For Agents"
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-lg mb-6 sm:mb-8 lg:mb-10"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
                For Agents
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed transition-colors duration-300">
                Showcase your listings beautifully. Receive pre-qualified leads. Gain visibility to emotionally-invested buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
