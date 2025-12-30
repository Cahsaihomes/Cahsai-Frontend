"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/cahsai-logo.png"
              alt="Cahsai Logo"
              width={300}
              height={100}
              className="h-28 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/watch-homes"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Watch Homes
            </Link>
            <Link
              href="/watch-homes"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Search Listings
            </Link>
            <Link
              href="#what-is-cahsai"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              What is Cahsai
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
             Who It’s For
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="bg-[#6B8E6F] hover:bg-[#5a7a5e] text-white px-6 rounded-full"
            >
              Join the Waitlist
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 mt-4">
            <div className="space-y-2">
              <Link
                href="/watch-homes"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Watch Homes
              </Link>
              <Link
                href="/watch-homes"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Search Listings
              </Link>
              <Link
                href="#what-is-cahsai"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                What is Cahsai
              </Link>
              <Link
                href="#how-it-works"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Who It's For
              </Link>
              <Link
                href="#how-it-works"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Button
                className="w-full mt-4 bg-[#6B8E6F] hover:bg-[#5a7a5e] text-white rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Join the Waitlist
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
