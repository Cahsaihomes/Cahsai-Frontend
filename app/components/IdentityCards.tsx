"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import React from "react";
import { RootState } from "../redux";
import { useSelector } from "react-redux";

interface IdentityCardsProps {
  passportFile: File | null;
  passportPreview: string | null;
  isPassportRemove: boolean;
  onPassportUpload: (file: File | null) => void;
  onPassportRemove: () => void;
  cnicFile: File | null;
  cnicPreview: string | null;
  isCnicRemove: boolean;
  onCnicUpload: (file: File | null) => void;
  onCnicRemove: () => void;
}

const IdentityCards: React.FC<IdentityCardsProps> = ({
  passportFile,
  passportPreview,
  isPassportRemove,
  onPassportUpload,
  onPassportRemove,
  cnicFile,
  cnicPreview,
  isCnicRemove,
  onCnicUpload,
  onCnicRemove,
}) => {
  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onPassportUpload(file);
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onCnicUpload(file);
  };

  const renderUploadCard = (
    label: string,
    icon: string,
    file: File | null,
    preview: string | null,
    onRemove: () => void,
    inputId: string,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    // const isUploaded = Boolean(file);
    const isUploaded = Boolean(file || preview);

    return (
      <div
        className={`p-4 rounded-md text-center cursor-pointer border-2 ${
          isUploaded
            ? "border-green-600 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Image
          src={icon}
          alt={`${label} Icon`}
          width={40}
          height={40}
          className="mx-auto mb-2"
        />
        <p className="font-medium text-[#414651]">{label}</p>

        {preview ? (
          <div className="mt-3">
            <Image
              src={preview}
              alt={`${label} Preview`}
              width={80}
              height={80}
              className="object-cover rounded-md mx-auto border"
            />
            <p className="text-xs text-[#717680] mt-1">{file?.name}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="mt-3 w-full">
            <Input
              id={inputId}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={onUpload}
            />
            <label
              htmlFor={inputId}
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drop your file here, or{" "}
                <span className="text-[#6F8375] font-medium underline">
                  Browse
                </span>
              </p>
            </label>
          </div>
        )}
      </div>
    );
  };
  // const showVerificationBox = Boolean(passportPreview || cnicPreview);
  const showVerificationBox =
    Boolean(passportPreview || cnicPreview) &&
    !(isPassportRemove && isCnicRemove);

  return (
    <>
      <Card>
        <CardContent className="lg:p-4 p-0 space-y-4">
          <h3 className="text-lg font-semibold text-[#414651]">
            Identity Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderUploadCard(
              "Passport",
              "/images/passport.png",
              passportFile,
              passportPreview,
              onPassportRemove,
              "passportUpload",
              handlePassportChange
            )}
            {renderUploadCard(
              "CNIC",
              "/images/cnic.png",
              cnicFile,
              cnicPreview,
              onCnicRemove,
              "cnicUpload",
              handleCnicChange
            )}
          </div>
          {showVerificationBox && (
            <div className="flex flex-row items-center gap-2 p-3 rounded-[8px] bg-[#0892061F] border border-[#089206]">
              <CheckCircle2 className="w-5 h-5" color="#089206" />
              <div className="flex flex-col">
                <p className="text-sm font-[500] text-[#089206]">
                  Verification Complete!
                </p>
                <p className="text-[16px] font-[500] text-[#08920680]">
                  Your identity has been successfully verified. You can now
                  receive payouts and access all creator features.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default IdentityCards;
