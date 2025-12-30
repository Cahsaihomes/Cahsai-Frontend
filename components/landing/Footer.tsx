"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Home } from "lucide-react";
import TikTokIcon from "../TikTokIcon";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pl-8 pr-3 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12 pb-12 border-b border-gray-800">
          {/* Left Section - Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Image 
                src="/images/logo.svg" 
                alt="Cahsai Logo" 
                width={250} 
                height={250}
              />
             
            </div>
            <div className="text-sm text-gray-400 space-y-3 mb-6">
              <div>
                <p className="font-semibold text-gray-300 mb-1">Address:</p>
                <p>1281 Win Hentschel Blvd West Lafayette, IN 47906</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300 mb-1">Contact:</p>
                <p>hello@cahsai.com</p>
                <p>765-701-3623</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61583246883561"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/cahsaihomes/"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/@cahsaihomes?is_from_webapp=1&sender_device=pc"
                aria-label="TikTok"
                className="hover:text-white transition-colors"
              >
                <TikTokIcon size={20} />
              </Link>
            </div>
          </div>

          {/* Platform Section */}
          <div className="pl-20">
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/buyers" className="text-gray-400 hover:text-white block">
                For Buyers
              </Link>
              <Link href="/agents" className="text-gray-400 hover:text-white block">
                For Agents
              </Link>
              <Link href="/creators" className="text-gray-400 hover:text-white block">
                For Creators
              </Link>
              <Link href="/hosts" className="text-gray-400 hover:text-white block">
                For Hosts
              </Link>
            </nav>
          </div>

          {/* Company Section */}
          <div className="pl-20">
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white block">
                About
              </Link>
              <Link href="/careers" className="text-gray-400 hover:text-white block">
                Careers
              </Link>
              <Link href="/press" className="text-gray-400 hover:text-white block">
                Press
              </Link>
              <Link href="/blogs" className="text-gray-400 hover:text-white block">
                Blogs
              </Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="pl-20">
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white block">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white block">
                Terms
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white block">
                Accessibility
              </Link>
              <Link href="/licenses" className="text-gray-400 hover:text-white block">
                Licenses
              </Link>
            </nav>
          </div>
        </div>

        {/* Equal Housing Opportunity Section */}
        <div className="mb-12 pb-12 border-b border-gray-800">
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <Home className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="text-white font-semibold mb-2">Equal Housing Opportunity</p>
                <p className="text-gray-400 mb-2">
                  Cahsai, Inc. — Broker of Record: Jared Ramsey
                </p>
                <p className="text-gray-400 mb-2">
                  Licensed Real Estate Brokerage — Indiana | Indiana Managing Broker License # REBTOD953
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold">Accessibility:</span> Cahsai is committed to ensuring digital accessibility for all users. To request an accommodation, email{" "}
                  <Link href="mailto:accessibility@cahsai.com" className="text-blue-400 hover:text-blue-300">
                    accessibility@cahsai.com
                  </Link>
                  .
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Consumer Notice:</span> For licensing verification or consumer inquiries, visit the Indiana Real Estate Commission website.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Cahsai, Inc. All rights reserved.</p>

          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gray-300">
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
