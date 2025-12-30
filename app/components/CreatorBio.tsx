"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface CreatorBioProps {
  profileData: {
    location: string;
    bio: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

const CreatorBio: React.FC<CreatorBioProps> = ({
  profileData,
  handleInputChange,
}) => {
  
  return (
    <>
      <div>
        <Label
          htmlFor="location"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Location
        </Label>
        <Input
          id="location"
          type="text"
          value={profileData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
        />
      </div>

      <div>
        <Label
          htmlFor="bio"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Bio
        </Label>
        <div className="relative w-full">
          <Textarea
            id="bio"
            rows={3}
            value={profileData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="w-full px-3 py-2 h-[121px] resize-none border border-[#D5D7DA] rounded-md text-[#717680]"
            placeholder="Write about yourself..."
          />
          <span className="absolute bottom-2 right-3 text-[#535862] text-sm font-normal">
            {profileData.bio.length}/200
          </span>
        </div>
      </div>
    </>
  );
};

export default CreatorBio;
