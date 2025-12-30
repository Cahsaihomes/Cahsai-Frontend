"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function PasswordUpdatedPage() {
  const router = useRouter();
  return (
    <div
      className={`min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4 ${inter.className}`}
    >
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        {/* Success Illustration */}
        <div className="w-60 h-60 mx-auto mb-8 flex items-center justify-center">
          <Image
            src="\images\Approval 5 1.png"
            alt="Password Updated Successfully - Person giving OK gesture with checkmark"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Password Updated!
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your password has been changed successfully. You&apos;re now
            protected with your new credentials.
          </p>
        </div>

        {/* Back to Login Button */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
