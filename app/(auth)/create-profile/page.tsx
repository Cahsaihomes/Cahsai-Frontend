"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Loader2, Plus, Upload, X } from "lucide-react";
import {
  CreateProfileFormValues,
  createProfileSchema,
} from "@/app/validation/createProfile";
import { specializationsList } from "@/app/Utils/types";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux";
import { toast } from "sonner";
import { agentCreateProfile } from "@/app/services/auth.service";
import { validateFile } from "@/app/Utils/helper";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
export default function CreateProfilePage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      areasServed: [{ value: "" }],
      specializations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "areasServed",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields, append]);

  const selectedSpecializations = watch("specializations");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const toggleSpecialization = (tag: string) => {
    const current = selectedSpecializations || [];
    if (current.includes(tag)) {
      setValue(
        "specializations",
        current.filter((t) => t !== tag)
      );
    } else {
      setValue("specializations", [...current, tag]);
    }
  };

  const onSubmit = async (data: CreateProfileFormValues) => {
    setLoading(true);
    try {
      const fileError = validateFile(data.profileImage as File);
      if (fileError) {
        toast.error(fileError);
        setLoading(false);
        return;
      }
      const formattedAreas = data.areasServed.map((area) => area.value);
      const formData = new FormData();
      formData.append("userId", String(user?.id));
      formData.append("linkedinUrl", data.linkedin || "");
      formData.append("instagramUsername", data.instagram || "");
      formData.append(
        "specializations",
        JSON.stringify(data.specializations || [])
      );
      formData.append("areasServed", JSON.stringify(formattedAreas || []));
      if (data.profileImage instanceof File) {
        formData.append("profilePic", data.profileImage);
      }
      const res = await agentCreateProfile(formData);

      toast.success(res.message || "Profile Created successful!");
      router.push("/onboarding");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Profile Creation failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F9F6F1] flex items-center justify-center p-4 ${inter.className}`}
    >
      <div
        className="bg-white rounded-xl w-[595px] lg:p-6 p-0"
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
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image */}
          <div className="text-center mb-8">
            <div className="relative">
              <Image
                src={preview || "/images/avatar.jpg"}
                alt="Profile"
                width={124}
                height={124}
                className="w-[124px] h-[124px] rounded-full mx-auto mb-2 object-cover"
              />
              {/* Upload Button */}
              <label className="absolute bottom-0 right-[40%] bg-[#6F8375] text-white w-9 h-9 flex items-center justify-center rounded-full border-2 border-white cursor-pointer">
                <Upload size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <h2 className="font-medium">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="linkedin"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              LinkedIn URL
            </label>
            <input
              id="linkedin"
              {...register("linkedin")}
              placeholder="Enter your LinkedIn URL"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
            {errors.linkedin && (
              <span className="text-sm text-red-500">
                {errors.linkedin.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="instagram"
              className="font-inter font-medium text-[16px] leading-6 text-[#414651]"
            >
              Instagram Username
            </label>
            <input
              id="instagram"
              {...register("instagram")}
              placeholder="Enter your Instagram Username"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
            />
          </div>

          {/* Areas Served */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px] leading-6 text-[#414651]">
              Areas Served (ZIP codes)
            </label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`areasServed.${index}.value` as const)}
                  placeholder="Enter ZIP code"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
                  defaultValue={field.value}
                />

                {index === fields.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="p-2 text-[#717680] hover:text-[#6F8375]"
                  >
                    <Plus size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}

            {Array.isArray(errors.areasServed) &&
              errors.areasServed?.map((err, index) =>
                err?.value?.message ? (
                  <p key={index} className="text-red-500 text-sm">
                    {err.value.message}
                  </p>
                ) : null
              )}

            {typeof errors.areasServed?.message === "string" && (
              <p className="text-red-500 text-sm">
                {errors.areasServed.message}
              </p>
            )}
          </div>

          {/* Specializations */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px] leading-6 text-[#414651]">
              Specializations
            </label>
            <div className="flex flex-wrap gap-2">
              {specializationsList.map((tag) => {
                const isSelected = selectedSpecializations?.includes(tag);
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
            {errors.specializations && (
              <span className="text-sm text-red-500">
                {errors.specializations.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#6F8375] hover:bg-[#5a6b60] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
              </>
            ) : (
              "Create Profile"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#6F8375] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
