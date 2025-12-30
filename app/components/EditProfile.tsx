/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import StripeCard from "./StripeCard";
import IdentityCards from "./IdentityCards";
import CreatorBio from "./CreatorBio";
import AgentInfo from "./AgentInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { editProfileService } from "../services/auth.service";
import { toast } from "sonner";
import { validateFile } from "../Utils/helper";
import { updateUser } from "../redux/slices/authSlice";

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const initialProfile = {
    user_name: user?.user_name || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.contact || "",
    email: user?.email || "",
    location: user?.profile_info?.location || "",
    bio: user?.profile_info?.bio || "",
    brokerageName: user?.profile_info?.brokerageName || "",
    mlsLicenseNumber: user?.profile_info?.mlsLicenseNumber || "",
    mlsAssociation: user?.profile_info?.mlsAssociation || "",
    linkedinUrl: user?.profile_info?.linkedinUrl || "",
    instagramUsername: user?.profile_info?.instagramUsername || "",
    areasServed: user?.profile_info?.areasServed
      ? user.profile_info.areasServed.map((area: string) => ({ value: area }))
      : [],
    specializations: user?.profile_info?.specializations || [],
  };
  const [profileData, setProfileData] = useState(initialProfile);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [cnicFile, setCnicFile] = useState<File | null>(null);
  const [cnicPreview, setCnicPreview] = useState<string | null>(null);

  const [isPassportRemove, setIsPassportRemove] = useState(false);
  const [isCnicRemove, setIsCnicRemove] = useState(false);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const error = validateFile(f);
      if (error) {
        toast.error(error);
        return;
      }
      setFile(f);
      const imageUrl = URL.createObjectURL(f);
      setSelectedImage(imageUrl);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const changed =
      Object.keys(initialProfile).some((key) => {
        const newValue = profileData[key as keyof typeof profileData];
        const oldValue = initialProfile[key as keyof typeof initialProfile];

        if (typeof newValue === "object") {
          return JSON.stringify(newValue) !== JSON.stringify(oldValue);
        }

        return newValue !== oldValue;
      }) ||
      !!file ||
      !!cnicFile ||
      !!passportFile ||
      !!isCnicRemove ||
      !!isPassportRemove;

    setHasChanges(changed);
  }, [
    profileData,
    file,
    cnicFile,
    passportFile,
    isCnicRemove,
    isPassportRemove,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(initialProfile).forEach((key) => {
        const newValue = profileData[key as keyof typeof profileData];
        const oldValue = initialProfile[key as keyof typeof initialProfile];

        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          if (Array.isArray(newValue)) {
            if (key === "areasServed") {
              // explicitly cast type
              const onlyValues = (newValue as { value: string }[]).map(
                (item) => item.value
              );
              formData.append(key, JSON.stringify(onlyValues));
            } else {
              formData.append(key, JSON.stringify(newValue));
            }
          } else if (typeof newValue === "object" && newValue !== null) {
            formData.append(key, JSON.stringify(newValue));
          } else if (newValue !== undefined && newValue !== null) {
            formData.append(key, String(newValue));
          }
        }
      });
      if (file) {
        formData.append("profilePic", file);
      }

      if (passportFile) {
        formData.append("passport", passportFile);
      }

      if (cnicFile) {
        formData.append("cnic", cnicFile);
      }

      if (isPassportRemove) {
        formData.append("isPassportRemove", String(isPassportRemove));
      }

      if (isCnicRemove) {
        formData.append("isCnicRemove", String(isCnicRemove));
      }

      const res = await editProfileService(formData);

      localStorage.setItem("token", res.token);
      Cookies.set("token", res.token, { path: "/" });
      dispatch(updateUser({ token: res.token, user: res.user }));
      toast.success(res.message || "Profile updated successfully!");
      Object.assign(initialProfile, profileData);
      setHasChanges(false);
      setFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  useEffect(() => {
    if (user?.profile_info?.passportUrl) {
      setPassportPreview(user?.profile_info?.passportUrl);
    }
    if (user?.profile_info?.cnicUrl) {
      setCnicPreview(user?.profile_info?.cnicUrl);
    }
  }, [user]);

  return (
    <div className="w-full mx-auto bg-white lg:px-8 px-4 py-8 lg:py-8 border border-[#D5D7DA] rounded-[12px] max-w-full sm:max-w-xl md:max-w-full lg:max-w-full space-y-8">
      {/* Profile Image Section */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                // src={selectedImage || "/images/avatar.jpg"}
                src={selectedImage ?? user?.avatarUrl ?? "/images/avatar.jpg"}
                alt="Profile"
              />
              <AvatarFallback className="bg-gray-300 text-lg">
                JS
              </AvatarFallback>
            </Avatar>
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              size="icon"
              onClick={handleEditClick}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#6F8375] hover:bg-[#5a6b61]"
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
          </div>
          <h2 className="text-lg font-medium text-[#414651] mb-1">
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-sm text-[#717680]">{user?.email}</p>
        </div>

        {/* Form Section */}

        <div>
          <Label
            htmlFor="user_name"
            className="block text-sm font-medium text-[#414651] mb-2"
          >
            Username
          </Label>
          <Input
            id="user_name"
            type="text"
            value={profileData.user_name}
            onChange={(e) => handleInputChange("user_name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        </div>

        <div>
          <Label
            htmlFor="first_name"
            className="block text-sm font-medium text-[#414651] mb-2"
          >
            First Name
          </Label>
          <Input
            id="first_name"
            type="text"
            value={profileData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        </div>

        <div>
          <Label
            htmlFor="last_name"
            className="block text-sm font-medium text-[#414651] mb-2"
          >
            Last Name
          </Label>
          <Input
            id="last_name"
            type="text"
            value={profileData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="block text-sm font-medium text-[#414651] mb-2"
          >
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        </div>

        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-[#414651] mb-2"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#717680]"
          />
        </div>

        {/* Agent Info */}
        {user?.role === "agent" && (
          <AgentInfo
            profileData={profileData}
            handleInputChange={handleInputChange}
            setProfileData={setProfileData}
          />
        )}
        {user?.role === "creator" && (
          <>
            {/* Creator Bio */}
            <CreatorBio
              profileData={profileData}
              handleInputChange={handleInputChange}
            />

            {/* Identity Verification Section */}

            <IdentityCards
              passportFile={passportFile}
              passportPreview={passportPreview}
              isPassportRemove={isPassportRemove}
              onPassportUpload={(file) => {
                setPassportFile(file);
                setPassportPreview(file ? URL.createObjectURL(file) : null);
                setIsPassportRemove(false);
              }}
              onPassportRemove={() => {
                setPassportFile(null);
                setPassportPreview(null);
                setIsPassportRemove(true);
              }}
              cnicFile={cnicFile}
              cnicPreview={cnicPreview}
              isCnicRemove={isCnicRemove}
              onCnicUpload={(file) => {
                setCnicFile(file);
                setCnicPreview(file ? URL.createObjectURL(file) : null);
                setIsCnicRemove(false);
              }}
              onCnicRemove={() => {
                setCnicFile(null);
                setCnicPreview(null);
                setIsCnicRemove(true);
              }}
            />
            {/* Payment Methods Section */}
            <StripeCard />
          </>
        )}
        <div>
          <Button
            type="submit"
            disabled={!hasChanges}
            className="w-full bg-[#6F8375] hover:bg-[#6F8375] text-white py-2 px-4 rounded-md font-medium transition-colors mt-3"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
