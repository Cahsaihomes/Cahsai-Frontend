'use client';
import Image from "next/image";

export const sliderData = {
  agent: [
    {
      id: 0,
      topContent: (
        <div
          className="flex items-center justify-center mx-auto mb-6"
          style={{ width: 230, height: 230 }}
        >
          <div className="p-4">
            <Image src="/images/logo.png" alt="logo" width={253} height={212} />
          </div>
        </div>
      ),
      title: "Welcome to Cahsai",
      text: "Your daily scroll of dreamy spaces, stunning videos, and inspiration made to spark “what if?” moments.",
    },
    {
      id: 2,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/Manager 1.png"
            alt="Tour on Your Terms - Professional at desk with laptop"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Claim Leads Instantly",
      text: "Receive nearby leads and claim them with one tap no cold calls needed.",
    },
    {
      id: 3,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/smart.png"
            alt="Smart Matching"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Smart Matching",
      text: "We send you the right clients based on location, speed, and expertise.",
    },
  ],
  buyer: [
    {
      id: 0,
      topContent: (
        <div
          className="flex items-center justify-center mx-auto mb-6"
          style={{ width: 230, height: 230 }}
        >
          <div className="p-4">
            <Image src="/images/logo.png" alt="logo" width={253} height={212} />
          </div>
        </div>
      ),
      title: "Welcome to Cahsai",
      text: "Your daily scroll of dreamy spaces, stunning videos, and inspiration made to spark “what if?” moments",
    },
    {
      id: 2,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/Manager 1.png"
            alt="Tour on Your Terms"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Tour on Your Terms",
      text: "Book video or in-person tours instantly whenever it fits your schedule.",
    },
    {
      id: 3,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/Chatting (2) 1.png"
            alt="Save and Share"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Save & Share Easily",
      text: "Like homes and share them with friends, family, or your agent in one tap.",
    },
  ],
  creator: [
    {
      id: 0,
      topContent: (
        <div
          className="flex items-center justify-center mx-auto mb-6"
          style={{ width: 230, height: 230 }}
        >
          <div className="p-4">
            <Image src="/images/logo.png" alt="logo" width={253} height={212} />
          </div>
        </div>
      ),
      title: "Welcome to Cahsai",
      text: "Your daily scroll of dreamy spaces, stunning videos, and inspiration made to spark “what if?” moments",
    },
    {
      id: 2,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/Manager 1.png"
            alt="Tour on Your Terms"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Tour on Your Terms",
      text: "Book video or in-person tours instantly whenever it fits your schedule.",
    },
    {
      id: 3,
      topContent: (
        <div className="w-60 h-60 mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/images/Chatting (2) 1.png"
            alt="Save and Share"
            width={240}
            height={240}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      title: "Save & Share Easily",
      text: "Like homes and share them with friends, family, or your agent in one tap.",
    },
  ],
};
