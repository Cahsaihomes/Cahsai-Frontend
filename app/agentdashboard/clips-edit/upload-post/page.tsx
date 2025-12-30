"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import {
  createPostService,
  CreatePostPayload,
} from "../../../services/create.post.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AgentUploadPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [squareFeet, setSquareFeet] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [homeStyle, setHomeStyle] = useState<string[]>([]);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Listing type and rental fields
  const [listingType, setListingType] = useState<"FOR_SALE" | "FOR_RENT" | "STAY">("FOR_SALE");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [petPolicy, setPetPolicy] = useState("");
  const [furnished, setFurnished] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentMedia, setCurrentMedia] = useState(0);

  const tags = [
    "Luxury Homes",
    "First-Time Buyers",
    "Relocations",
    "New Construction",
    "Shared Kitchen Access",
  ];

  const homeStyles = [
    "Modern",
    "Contemporary",
    "Farmhouse",
    "Mid-Century Modern",
    "Industrial",
    "Luxury Modern",
    "New Build",
    "Ranch",
    "Bungalow",
    "Cape Cod",
    "Colonial",
    "Craftsman",
    "Cottage",
    "Split-Level",
    "Traditional",
    "Loft",
    "Brownstone",
    "Townhome",
    "High-Rise",
    "Studio",
    "Coastal / Beach House",
    "Coastal Cottage",
    "Lake House",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleHomeStyle = (style: string) => {
    setHomeStyle((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const images: File[] = [];
    const videos: File[] = [];
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        images.push(file);
      } else if (file.type.startsWith("video/")) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error(`Video "${file.name}" exceeds 100MB limit.`);
          return;
        }
        videos.push(file);
      }
    });

    setPostImages((prev) => [...prev, ...images].slice(0, 5));
    setPostVideos((prev) => [...prev, ...videos].slice(0, 2));
    setCurrentMedia(0);
  };

  const handleCreatePost = async () => {
    setLoading(true);
    
    // Determine the correct price value based on listing type
    const priceValue = listingType === "FOR_SALE" ? price : (monthlyRent || price);
    
    const payload: CreatePostPayload = {
      title,
      price: priceValue,
      zipCode,
      city,
      location,
      bedrooms,
      bathrooms,
      description,
      tags: selectedTags,
      amenities,
      homeStyle,
      post_images: postImages,
      post_videos: postVideos,
      listing_type: listingType,
      monthly_rent: listingType !== "FOR_SALE" ? monthlyRent : null,
      lease_term: listingType === "FOR_RENT" ? leaseTerm : null,
      pet_policy: listingType === "FOR_RENT" ? petPolicy : null,
      furnished: listingType === "FOR_RENT" ? furnished : false,
    };

    try {
      await createPostService(payload);
      toast.success("Post created successfully!");
      router.push("/agentdashboard/clips-edit");

      // Reset all fields
      setTitle("");
      setPrice("");
      setZipCode("");
      setCity("");
      setLocation("");
      setBedrooms("2");
      setBathrooms("1");
      setSquareFeet("");
      setDescription("");
      setAmenities([]);
      setHomeStyle([]);
      setPostImages([]);
      setPostVideos([]);
      setSelectedTags([]);
      setListingType("FOR_SALE");
      setMonthlyRent("");
      setLeaseTerm("");
      setPetPolicy("");
      setFurnished(false);
    } catch (error: any) {
      console.error("Create post error:", error);
      toast.error(error?.response?.data?.message || "Failed to create post!");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    title.trim() !== "" &&
    (listingType === "FOR_SALE" ? price.trim() !== "" : monthlyRent.trim() !== "") &&
    zipCode.trim() !== "" &&
    city.trim() !== "" &&
    location.trim() !== "" &&
    description.trim() !== "" &&
    bedrooms.trim() !== "" &&
    bathrooms.trim() !== "" &&
    amenities.length > 0 &&
    homeStyle.length > 0 &&
    (postImages.length > 0 || postVideos.length > 0);

  return (
    <main className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <ArrowLeft
            className="w-5 h-5 text-gray-600 cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
            Upload Post
          </h1>
        </div>
        <Button
          className={`px-6 text-white ${
            loading || !isFormValid
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-[#6F8375] hover:bg-[#5a6a61] active:bg-[#4a5a51]"
          }`}
          onClick={handleCreatePost}
          disabled={loading || !isFormValid}
        >
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-6 py-6">
        <div className="w-full md:max-w-md space-y-6">
          {/* Listing Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={listingType === "FOR_SALE" ? "default" : "outline"}
                onClick={() => setListingType("FOR_SALE")}
                className={`flex-1 ${
                  listingType === "FOR_SALE"
                    ? "bg-[#6F8375] text-white hover:bg-[#5a6b60]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                For Sale
              </Button>
              <Button
                type="button"
                variant={listingType === "FOR_RENT" ? "default" : "outline"}
                onClick={() => setListingType("FOR_RENT")}
                className={`flex-1 ${
                  listingType === "FOR_RENT"
                    ? "bg-[#6F8375] text-white hover:bg-[#5a6b60]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                For Rent
              </Button>
              <Button
                type="button"
                variant={listingType === "STAY" ? "default" : "outline"}
                onClick={() => setListingType("STAY")}
                className={`flex-1 ${
                  listingType === "STAY"
                    ? "bg-[#6F8375] text-white hover:bg-[#5a6b60]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                Stays
              </Button>
            </div>
          </div>

          {/* Price or Monthly Rent */}
          <div>
            <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              {listingType === "FOR_SALE" ? "Sale Price" : listingType === "STAY" ? "Nightly Rate" : "Monthly Rent"}
            </Label>
            <Input
              id="price"
              placeholder={`Ex: ${listingType === "FOR_SALE" ? "$1,950,000" : listingType === "STAY" ? "$150/night" : "$2,500/month"}`}
              className="w-full"
              value={listingType === "FOR_SALE" ? price : monthlyRent}
              onChange={(e) => listingType === "FOR_SALE" ? setPrice(e.target.value) : setMonthlyRent(e.target.value)}
            />
          </div>

          {/* Conditional Rental Fields */}
          {listingType === "FOR_RENT" && (
            <>
              <div>
                <Label htmlFor="lease_term" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Term
                </Label>
                <Select value={leaseTerm} onValueChange={setLeaseTerm}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select lease term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="12-months">12 Months</SelectItem>
                    <SelectItem value="24-months">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pet_policy" className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Policy
                </Label>
                <Input
                  id="pet_policy"
                  placeholder="e.g., Pets allowed with deposit"
                  className="w-full"
                  value={petPolicy}
                  onChange={(e) => setPetPolicy(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  className="w-4 h-4 text-[#6F8375] border-gray-300 rounded focus:ring-[#6F8375]"
                />
                <Label htmlFor="furnished" className="text-sm font-medium text-gray-700">
                  Furnished
                </Label>
              </div>
            </>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter Title"
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Zip Code and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </Label>
              <Input
                id="zipCode"
                placeholder="Enter zip code"
                className="w-full"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full text-gray-700">
                  <SelectValue placeholder="Select city name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="houston">Houston</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter Location"
              className="w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Home Style - Multi-select Buttons */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Home Style
            </Label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {homeStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleHomeStyle(style)}
                  className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                    homeStyle.includes(style)
                      ? "bg-[#6F8375] text-white border-[#6F8375]"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a description..."
              className="w-full h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Bedrooms, Bathrooms, Square Feet */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                className="w-full"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                className="w-full"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                Sq Ft
              </Label>
              <Input
                id="squareFeet"
                type="number"
                className="w-full"
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
                placeholder="1200"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Write tags"
              className="w-full mb-3"
              value={selectedTags.join(", ")}
              onChange={(e) =>
                setSelectedTags(
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full border ${
                    selectedTags.includes(tag)
                      ? "bg-[#6F8375] text-white border-[#6F8375]"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src="/images/badge.svg"
                    alt="Badge"
                    width={20}
                    height={20}
                    className="inline-block mr-1"
                  />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </Label>
            <Input
              id="amenities"
              placeholder="Write Amenities"
              className="w-full"
              value={amenities.join(", ")}
              onChange={(e) =>
                setAmenities(
                  e.target.value
                    .split(",")
                    .map((a) => a.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
        </div>

        {/* Right File Upload Section */}
        <div className="w-full md:flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="h-[400px] md:h-[865px] border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-4 w-full">
                  <div className="w-full flex flex-col items-center">
                    {postImages.length === 0 && postVideos.length === 0 ? (
                      <Image
                        src="/images/upload.svg"
                        alt="Upload Icon"
                        width={83}
                        height={83}
                      />
                    ) : (
                      <div className="w-full flex flex-col items-center">
                        {(() => {
                          const allMedia = [...postImages, ...postVideos];
                          if (allMedia.length === 0) return null;
                          const isImage = currentMedia < postImages.length;
                          const file = allMedia[currentMedia];
                          return isImage ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="mx-auto object-cover rounded border"
                              style={{ maxWidth: 150, maxHeight: 150 }}
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              controls
                              className="mx-auto object-cover rounded border"
                              style={{ maxWidth: 150, maxHeight: 150 }}
                            />
                          );
                        })()}
                        <div className="flex justify-center mt-2 gap-2 w-full flex-wrap">
                          {[...postImages, ...postVideos].map((file, idx) => {
                            const isImage = idx < postImages.length;
                            return (
                              <div key={idx} className="relative inline-block">
                                {isImage ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className={`object-cover rounded border cursor-pointer ${
                                      currentMedia === idx ? "ring-2 ring-[#6F8375]" : ""
                                    }`}
                                    style={{ width: 48, height: 48 }}
                                    onClick={() => setCurrentMedia(idx)}
                                  />
                                ) : (
                                  <video
                                    src={URL.createObjectURL(file)}
                                    className={`object-cover rounded border cursor-pointer ${
                                      currentMedia === idx ? "ring-2 ring-[#6F8375]" : ""
                                    }`}
                                    style={{ width: 48, height: 48 }}
                                    onClick={() => setCurrentMedia(idx)}
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isImage) {
                                      setPostImages((prev) => {
                                        const arr = prev.filter((_, i) => i !== idx);
                                        if (arr.length + postVideos.length === 0)
                                          setCurrentMedia(0);
                                        else if (currentMedia >= arr.length + postVideos.length)
                                          setCurrentMedia(arr.length + postVideos.length - 1);
                                        return arr;
                                      });
                                    } else {
                                      const videoIdx = idx - postImages.length;
                                      setPostVideos((prev) => {
                                        const arr = prev.filter((_, i) => i !== videoIdx);
                                        if (postImages.length + arr.length === 0)
                                          setCurrentMedia(0);
                                        else if (currentMedia >= postImages.length + arr.length)
                                          setCurrentMedia(postImages.length + arr.length - 1);
                                        return arr;
                                      });
                                    }
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600"
                                  title={isImage ? "Remove image" : "Remove video"}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or{" "}
                  <span
                    className="text-[#6F8375] underline cursor-pointer"
                    onClick={handleBrowseClick}
                  >
                    Browse
                  </span>
                </p>
                <p className="text-sm text-[#D5D7DA]">Maximum file size 100mb</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}