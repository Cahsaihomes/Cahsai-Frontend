import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TwoWays from "@/components/landing/TwoWays";
import WhatIsCahsai from "@/components/landing/WhatIsCahsai";
import Features from "@/components/landing/Features";
import WhyCahsai from "@/components/landing/WhyCahsai";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <TwoWays />
      <WhatIsCahsai />
      <Features />
      <WhyCahsai />
      <CTASection />
      <Footer />
    </main>
  );
}
