"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function AccountSuccessPage() {
  const router = useRouter();
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
        {/* Success Illustration */}
        <div className="w-60 h-60 mx-auto mb-8 flex items-center justify-center">
          <Image
            src="/images/smart.png"
            alt="Account Created Successfully - Person pointing to completed checklist"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Account Created Successfully!
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed px-2">
            You&apos;re all set to start claiming leads and closing deals.
            Let&apos;s get started!
          </p>
        </div>

        {/* Continue Button */}
        <button
        type="button"
          onClick={() => {
            router.push("/login");
          }}
          className="w-full bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
