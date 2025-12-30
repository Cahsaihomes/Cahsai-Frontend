"use client";

import { Inter } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { sliderData } from "@/app/Utils/onBoardingData";

const inter = Inter({ subsets: ["latin"] });

export default function OnboardingSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "buyer";

  const slides = sliderData[role as keyof typeof sliderData] || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className={`min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4 ${inter.className}`}
    >
      <div
        className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center"
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
        {/* Logo/Image */}
        {slides[currentSlide].topContent}

        {/* Slider Dots directly under logo/image */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSlide ? "bg-[#6F8375]" : "bg-gray-300"
              }`}
              style={{
                width: index === currentSlide ? "28px" : "4px",
                height: index === currentSlide ? "10px" : "4px",
              }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          {slides[currentSlide].title}
        </h1>

        {/* Description */}
        <p className="text-[#6F8375] text-sm leading-relaxed mb-8 px-2">
          {slides[currentSlide].text}
        </p>

        {/* Get Started Button */}
        <button
          type="button"
          className="w-full bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          onClick={() => {
            if (currentSlide === slides.length - 1) {
              router.push(`/signup?role=${role}`);
            } else {
              nextSlide();
            }
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
