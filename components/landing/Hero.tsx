"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-background.png')",
        }}
      />
      
      {/* White Low Opacity Overlay */}
      <div className="absolute inset-0 bg-white/80" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 text-center">
        <h1 className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-black text-center pb-5 font-editors-note leading-tight" 
          style={{
            lineHeight: "1.3",
            letterSpacing: "0.02em",
            fontFamily: "'Editor's Note', serif",
            fontWeight: 500,
          }}
        >
          Explore Homes, Apartments, & Hosted
          <br />
          Stays in one Seamless Feed
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg font-medium text-black mb-8 max-w-3xl mx-auto text-center" 
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(14px, 3vw, 18px)",
            lineHeight: "1.6",
            letterSpacing: "0%",
          }}
        >
          Explore shorts from tours, real estates, and highlights across
          <br />
          diverse properties - all curated for your taste!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
          onClick={() => { window.location.href = '/watch-homes'; }}
            size="lg"
            className="bg-[#6F8375] hover:bg-[#5a7a5e] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-xl flex items-center gap-2"
          >
            <Play className="w-4 sm:w-5 h-4 sm:h-5" />
            Watch Homes
          </Button>
          
          <div className="flex items-center gap-2 text-black">
            <span className="text-xs sm:text-sm font-semibold">Join us as Agent or Creator</span>
            <Link href="/landing-page" className="inline-flex items-center justify-center hover:opacity-70 transition-opacity">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.664978 5.33164H9.99831M9.99831 5.33164L5.33164 0.664978M9.99831 5.33164L5.33164 9.99831" stroke="#0A0A0A" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      
    </section>
  );
}
