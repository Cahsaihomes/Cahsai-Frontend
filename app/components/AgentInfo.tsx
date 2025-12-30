"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import React from "react";
interface Props {
  profileData: {
    brokerageName: string;
    mlsLicenseNumber: string;
    mlsAssociation: string;
    linkedinUrl: string;
    instagramUsername: string;
    areasServed: { value: string }[];
    specializations: string[];
  };
  handleInputChange: (field: string, value: string) => void;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
}
const specializationsList = [
  "Luxury Homes",
  "First-Time Buyers",
  "Relocations",
  "Investment Properties",
  "Vacation Homes",
];

const AgentInfo: React.FC<Props> = ({
  profileData,
  handleInputChange,
  setProfileData,
}) => {
  const brokerageOptions = [
    "Compass",
    "Coldwell Banker",
    "Keller Williams",
    "Century 21",
  ];

  const selectValue = brokerageOptions.includes(profileData.brokerageName)
    ? profileData.brokerageName
    : "Not Listed";

  const handleAreaChange = (index: number, value: string) => {
    const updated = [...profileData.areasServed];
    updated[index].value = value;
    setProfileData((prev: any) => ({ ...prev, areasServed: updated }));
  };

  const addArea = () => {
    setProfileData((prev: any) => ({
      ...prev,
      areasServed: [...prev.areasServed, { value: "" }],
    }));
  };

  const removeArea = (index: number) => {
    const updated = profileData.areasServed.filter((_, i) => i !== index);
    setProfileData((prev: any) => ({ ...prev, areasServed: updated }));
  };

  // Specializations toggle
  const toggleSpecialization = (tag: string) => {
    setProfileData((prev: any) => {
      const isSelected = prev.specializations.includes(tag);
      return {
        ...prev,
        specializations: isSelected
          ? prev.specializations.filter((t: any) => t !== tag)
          : [...prev.specializations, tag],
      };
    });
  };

  return (
    <>
      {/* Brokerage Name */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="brokerageName"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Brokerage Name
        </Label>
        <select
          value={selectValue}
          onChange={(e) => handleInputChange("brokerageName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
        >
          <option value="">Select your Brokerage</option>
          {brokerageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="Not Listed">Not in the list - enter manually</option>
        </select>

        {selectValue === "Not Listed" && (
          <Input
            id="brokerageName"
            type="text"
            placeholder="Enter your Brokerage"
            value={
              brokerageOptions.includes(profileData.brokerageName)
                ? ""
                : profileData.brokerageName
            }
            onChange={(e) => handleInputChange("brokerageName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        )}
      </div>

      {/* MLS License */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="mlsLicenseNumber"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          MLS License Number
        </Label>
        <Input
          id="mlsLicenseNumber"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          placeholder="Enter your MLS license number"
          value={profileData.mlsLicenseNumber}
          onChange={(e) =>
            handleInputChange("mlsLicenseNumber", e.target.value)
          }
        />
      </div>

      {/* MLS Association */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="association"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          MLS Association
        </Label>
        <select
          value={profileData.mlsAssociation}
          onChange={(e) => handleInputChange("mlsAssociation", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
        >
          <option value="">Select MLS Association</option>
          <option value="CRMLS">CRMLS (California)</option>
          <option value="Bright">Bright MLS (East Coast)</option>
          <option value="HARMLS">HARMLS (Texas)</option>
          <option value="Stellar">Stellar MLS (Florida)</option>
        </select>
      </div>
      <div className="py-4">
        <h3 className="text-[18px]  font-[600] font-inter text-[#414651]">
          Social Media Links
        </h3>
      </div>
      {/* LinkedIn */}
      <div>
        <Label
          htmlFor="linkedinUrl"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          {" "}
          LinkedIn URL
        </Label>
        <Input
          id="linkedinUrl"
          type="text"
          value={profileData.linkedinUrl}
          onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
        />
      </div>

      {/* Instagram */}
      <div>
        <Label
          htmlFor="instagramUsername"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Instagram Username
        </Label>
        <Input
          id="instagramUsername"
          type="text"
          value={profileData.instagramUsername}
          onChange={(e) =>
            handleInputChange("instagramUsername", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
        />
      </div>

      {/* Areas Served */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="area_codes"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Areas Served (ZIP codes)
        </Label>
        {profileData.areasServed.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              id="area_codes"
              value={field.value}
              onChange={(e) => handleAreaChange(index, e.target.value)}
              placeholder="Enter ZIP code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
            />
            {index === profileData.areasServed.length - 1 ? (
              <button
                type="button"
                onClick={addArea}
                className="p-2 text-[#717680] hover:text-[#6F8375]"
              >
                <Plus size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeArea(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Specializations */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="specializations"
          className="block text-sm font-medium text-[#414651] mb-2"
        >
          Specializations
        </Label>
        <div className="flex flex-wrap gap-2">
          {specializationsList.map((tag) => {
            const isSelected = profileData.specializations.includes(tag);
            return (
              <span
                key={tag}
                onClick={() => toggleSpecialization(tag)}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  isSelected
                    ? "bg-[#6F8375] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AgentInfo;
