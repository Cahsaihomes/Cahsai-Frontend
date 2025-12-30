"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-12 sm:py-16 lg:pb-32 bg-white relative overflow-hidden">
      {/* Background Map Image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/map-background.png"
          alt="Map Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mt-8 sm:mt-12 lg:mt-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ready to Experience Real Estate
          <br />
          Differently?
        </h2>
        
        <p className="text-sm sm:text-base lg:text-[14px] text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
         Join Cahsai and discover homes in a way that feels emotional, engaging, and entirely new.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            onClick={() => window.open('https://calendar.app.google/6MKxgCzHDVYW2hzE7', '_blank')}
            size="lg"
            className="bg-[#6B8E6F] hover:bg-[#5a7a5e] cursor-pointer text-white px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
          >
            Book a Demo
          </Button>
          <Button
            onClick={() => router.push('/landing-page')}
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 hover:bg-gray-50"
          >
            Join Cahsai
          </Button>
        </div>
        
      </div>

      <div className="px-4 sm:px-8 lg:px-32 mt-8 sm:mt-12 lg:mt-20 flex justify-center opacity-20 relative z-10">
        <Image
          src="/images/marquee.png"
          height={1000}
          width={1000}
          alt="Marquee Background"
          className="object-cover w-full h-auto max-w-full"
        />
      </div>
    
      {/* Decorative elements */}
      <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#6B8E6F]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-20 sm:w-32 h-20 sm:h-32 bg-[#6B8E6F]/10 rounded-full blur-2xl" />
    </section>
  );
}
