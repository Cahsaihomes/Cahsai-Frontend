"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FC } from "react";
import Image from "next/image";

interface RoleCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
}

const SelectRolePage: FC = () => {
  const router = useRouter();

  const roles: RoleCardProps[] = [
    {
      id: "buyer",
      title: "Discover",
      description: "Immerse yourself in homes worth swooning over.",
      path: "/welcome?role=buyer",
    },
    {
      id: "agent",
      title: "Feature",
      description: "Highlight unique spaces and connect with future fans.",
      path: "/welcome?role=agent",
    },
    {
      id: "creator",
      title: "Creator",
      description:
        "Share beautiful spaces, and shape the way the next generation dreams about home.",
      path: "/welcome?role=creator",
    },
  ];

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <div className="bg-[#F9F6F1] flex flex-col justify-center items-center space-y-6 relative">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-md p-6 w-72 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            onClick={() => router.push(role.path)}
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
            <h2 className="text-lg font-semibold text-gray-800">
              {role.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              {role.description}
            </p>
            <div
              onClick={() => router.push(role.path)}
              className="w-8 h-8 rounded-full border border-[#6F8375] flex items-center justify-center 
                      cursor-pointer group"
            >
              <ArrowRight className="w-4 h-4 text-[#6F8375] transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </div>
          </div>
        ))}

        {/* Login Button for Mobile */}
        <div className="block md:hidden mt-6">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="cursor-pointer bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </div>

      {/* Right Side (hidden on mobile) */}
      <div className="relative w-full h-screen md:block hidden">
        <Image
          src="/images/welcomescreen.png"
          alt="Modern Home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-6 right-6">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="cursor-pointer bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </button>
        </div>
        <div className="absolute bottom-10 left-6 max-w-sm bg-white/20 backdrop-blur-md text-white p-4 border border-white/30 rounded-md">
          <h2 className="text-lg font-semibold">
            Join the next wave of home discovery.
          </h2>
          <p className="text-sm mt-2">
            Whether you showcase or scroll, it starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
