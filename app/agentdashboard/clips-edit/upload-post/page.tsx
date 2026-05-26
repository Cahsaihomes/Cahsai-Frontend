"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  createPostService,
  CreatePostPayload,
} from "../../../services/create.post.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMyPosts } from "../../../services/get.my-posts.service";
import { RootState } from "@/app/redux";

export default function AgentUploadPage() {
  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isRentalCompany = currentUser?.isRentalCompany || false;



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
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [homeStyle, setHomeStyle] = useState<string[]>([]);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  // Post type selection
  const [postType, setPostType] = useState<"CREATE_LISTING" | "LISTING_VIDEO">("CREATE_LISTING");

  // Listing video fields
  const [selectedExistingListingId, setSelectedExistingListingId] = useState<string>("");
  const [publishToWatchHomes, setPublishToWatchHomes] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Listing type and rental fields
  const [listingType, setListingType] = useState<"FOR_SALE" | "FOR_RENT" | "STAY">("FOR_SALE");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [petPolicy, setPetPolicy] = useState("");
  const [furnished, setFurnished] = useState(false);

  // Property listing fields
  const [streetAddress, setStreetAddress] = useState("");
  const [unitApartment, setUnitApartment] = useState("");
  const [state, setState] = useState("");
  const [customState, setCustomState] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featuresInput, setFeaturesInput] = useState("");
  const [hoaFees, setHoaFees] = useState("");
  const [agentName, setAgentName] = useState(
    currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : ""
  );
  const [brokerageName, setBrokerageName] = useState("");
  const [stateDisclosures, setStateDisclosures] = useState("");

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentMedia, setCurrentMedia] = useState(0);
  const STORAGE_KEY = "agentUploadFormData";

  // Load form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        setTitle(data.title || "");
        setPrice(data.price || "");
        setZipCode(data.zipCode || "");
        setCity(data.city || "");
        setLocation(data.location || "");
        setBedrooms(data.bedrooms || "2");
        setBathrooms(data.bathrooms || "1");
        setSquareFeet(data.squareFeet || "");
        setDescription(data.description || "");
        setAmenities(data.amenities || []);
        setHomeStyle(data.homeStyle || []);
        setSelectedTags(data.selectedTags || []);
        setListingType(data.listingType || "FOR_SALE");
        setMonthlyRent(data.monthlyRent || "");
        setLeaseTerm(data.leaseTerm || "");
        setPetPolicy(data.petPolicy || "");
        setFurnished(data.furnished || false);
        setStreetAddress(data.streetAddress || "");
        setUnitApartment(data.unitApartment || "");
        setState(data.state || "");
        setCustomState(data.customState || "");
        setPropertyType(data.propertyType || "");
        setLotSize(data.lotSize || "");
        setYearBuilt(data.yearBuilt || "");
        setFeatures(data.features || []);
        setHoaFees(data.hoaFees || "");
        setAgentName(data.agentName || "");
        setBrokerageName(data.brokerageName || "");
        setStateDisclosures(data.stateDisclosures || "");
        setPostType(data.postType || "CREATE_LISTING");
        setSelectedExistingListingId(data.selectedExistingListingId || "");
        setPublishToWatchHomes(data.publishToWatchHomes || false);
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      title,
      price,
      zipCode,
      city,
      location,
      bedrooms,
      bathrooms,
      squareFeet,
      description,
      amenities,
      homeStyle,
      selectedTags,
      listingType,
      monthlyRent,
      leaseTerm,
      petPolicy,
      furnished,
      streetAddress,
      unitApartment,
      state,
      customState,
      propertyType,
      lotSize,
      yearBuilt,
      features,
      hoaFees,
      agentName,
      brokerageName,
      stateDisclosures,
      postType,
      selectedExistingListingId,
      publishToWatchHomes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [
    title,
    price,
    zipCode,
    city,
    location,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    amenities,
    homeStyle,
    selectedTags,
    listingType,
    monthlyRent,
    leaseTerm,
    petPolicy,
    furnished,
    streetAddress,
    unitApartment,
    state,
    customState,
    propertyType,
    lotSize,
    yearBuilt,
    features,
    hoaFees,
    agentName,
    brokerageName,
    stateDisclosures,
    postType,
    selectedExistingListingId,
    publishToWatchHomes,
  ]);

  // Fetch user's posts for listing video
  useEffect(() => {
    if (postType === "LISTING_VIDEO") {
      fetchMyPosts();
    }
  }, [postType]);

  const fetchMyPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await getMyPosts();
      setMyPosts(response?.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load your listings");
    } finally {
      setPostsLoading(false);
    }
  };

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

    // Helper function to check if file is a video
    const isVideoFile = (file: File) => {
      const videoMimes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"];
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv", ".mkv", ".flv", ".m4v"];
      
      // Check MIME type
      if (file.type && videoMimes.some(mime => file.type.includes(mime))) {
        return true;
      }
      
      // Check if starts with "video/"
      if (file.type && file.type.startsWith("video/")) {
        return true;
      }
      
      // Check file extension
      const fileName = file.name.toLowerCase();
      return videoExtensions.some(ext => fileName.endsWith(ext));
    };

    // Helper function to check if file is an image
    const isImageFile = (file: File) => {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
      
      // Check MIME type
      if (file.type && file.type.startsWith("image/")) {
        return true;
      }
      
      // Check file extension
      const fileName = file.name.toLowerCase();
      return imageExtensions.some(ext => fileName.endsWith(ext));
    };

    Array.from(files).forEach((file) => {
      // For listing video, only accept videos
      if (postType === "LISTING_VIDEO") {
        if (isVideoFile(file)) {
          if (file.size > MAX_VIDEO_SIZE) {
            toast.error(`Video "${file.name}" exceeds 100MB limit.`);
            return;
          }
          videos.push(file);
        } else {
          toast.error("Only video files are allowed for Listing Videos");
          return;
        }
      } else {
        // For create listing, accept both images and videos
        if (isImageFile(file)) {
          images.push(file);
        } else if (isVideoFile(file)) {
          if (file.size > MAX_VIDEO_SIZE) {
            toast.error(`Video "${file.name}" exceeds 100MB limit.`);
            return;
          }
          videos.push(file);
        } else {
          toast.error(`File "${file.name}" is not a valid image or video`);
          return;
        }
      }
    });

    if (postImages.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
    }
    if (postVideos.length + videos.length > 5) {
      toast.error("You can upload a maximum of 5 videos.");
    }

    setPostImages([...postImages, ...images].slice(0, 5));
    setPostVideos([...postVideos, ...videos].slice(0, 5));
    setCurrentMedia(0);
    
    // Reset file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setUploadProgress(0);
    setUploadStatus("Starting upload...");
    
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
      // New property fields
      street: streetAddress,
      unit: unitApartment,
      state: state === "custom" ? customState : state,
      propertyType: propertyType,
      lotSize: lotSize,
      yearBuilt: yearBuilt,
      features: features,
      hoaFees: hoaFees,
      agentName: agentName,
      brokerageName: brokerageName,
      stateDisclosures: stateDisclosures,
      // Post type fields
      postType: postType,
      linkedPostId: postType === "LISTING_VIDEO" ? selectedExistingListingId : null,
      publishToWatchHomes: publishToWatchHomes,
    };

    try {
      await createPostService(payload, (progress, status) => {
        // Cap progress at 95% during upload to show final 5% for post creation
        if (progress <= 95) {
          setUploadProgress(progress);
          setUploadStatus(status);
        }
      });
      
      // Set to 100% only after post is actually created
      setUploadProgress(100);
      setUploadStatus("Post created successfully!");
      
      // Wait a moment to show 100% completion
      setTimeout(() => {
        toast.success("Post created successfully!");
        
        // Clear localStorage after successful post creation
        localStorage.removeItem(STORAGE_KEY);
        
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
        // Reset new fields
        setStreetAddress("");
        setUnitApartment("");
        setState("");
        setCustomState("");
        setPropertyType("");
        setLotSize("");
        setYearBuilt("");
        setFeatures([]);
        setHoaFees("");
        setAgentName("");
        setBrokerageName("");
        setStateDisclosures("");
        setPostType("CREATE_LISTING");
        setSelectedExistingListingId("");
        setPublishToWatchHomes(false);
        setUploadProgress(0);
        setUploadStatus("");
      }, 800);
    } catch (error: any) {
      console.error("Create post error:", error);
      toast.error(error?.response?.data?.message || "Failed to create post!");
      setUploadProgress(0);
      setUploadStatus("");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    postType === "LISTING_VIDEO" 
      ? // For listing video: need title, selected listing and video
        title.trim() !== "" && selectedExistingListingId.trim() !== "" && (postVideos.length > 0)
      : // For create listing: minimal validation (at least one field filled and media)
        (postImages.length > 0 || postVideos.length > 0) &&
        (title.trim() !== "" || 
         price.trim() !== "" || 
         zipCode.trim() !== "" || 
         city.trim() !== "" || 
         description.trim() !== "");

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
              : "bg-[#968470] hover:bg-[#5a6a61] active:bg-[#4a5a51]"
          }`}
          onClick={handleCreatePost}
          disabled={loading || !isFormValid}
        >
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </div>

      {/* Progress Bar Section */}
      {loading && (
        <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-[#D5D7DA]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{uploadStatus}</span>
              <span className="text-sm font-medium text-[#968470]">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-6 py-6">
        {/* Right File Upload Section - Top */}
        <div className="w-full md:flex-1 flex items-start justify-center md:order-last">
          <div className="w-full max-w-md">
            <div 
              className="h-[400px] md:h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center"
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept={postType === "LISTING_VIDEO" ? "video/*" : "image/*,video/*"}
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
                                      currentMedia === idx ? "ring-2 ring-[#968470]" : ""
                                    }`}
                                    style={{ width: 48, height: 48 }}
                                    onClick={() => setCurrentMedia(idx)}
                                  />
                                ) : (
                                  <video
                                    src={URL.createObjectURL(file)}
                                    className={`object-cover rounded border cursor-pointer ${
                                      currentMedia === idx ? "ring-2 ring-[#968470]" : ""
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
                    className="text-[#968470] underline cursor-pointer"
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

        {/* Left Form Fields Section */}
        <div className="w-full md:max-w-md space-y-6 md:order-first">
          {/* Post Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={postType === "CREATE_LISTING" ? "default" : "outline"}
                onClick={() => setPostType("CREATE_LISTING")}
                className={`flex-1 ${
                  postType === "CREATE_LISTING"
                    ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                Listing Post
              </Button>
              <Button
                type="button"
                variant={postType === "LISTING_VIDEO" ? "default" : "outline"}
                onClick={() => setPostType("LISTING_VIDEO")}
                className={`flex-1 ${
                  postType === "LISTING_VIDEO"
                    ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                Listing Video
              </Button>
            </div>
          </div>

          {/* Listing Video Fields - Only show when Listing Video is selected */}
          {postType === "LISTING_VIDEO" && (
            <>
              {/* Title */}
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Select Existing Listing */}
              <div>
                <Label htmlFor="existingListing" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Existing Listing
                </Label>
                <Select value={selectedExistingListingId} onValueChange={setSelectedExistingListingId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={postsLoading ? "Loading your listings..." : "Select a listing"} />
                  </SelectTrigger>
                  <SelectContent>
                    {myPosts.map((post) => (
                      <SelectItem key={post.id} value={String(post.id)}>
                        {post.title || `Listing ${post.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Publish to Watch Homes Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Also publish this to Watch Homes & Creator Clips?
                </span>
                <Switch
                  checked={publishToWatchHomes}
                  onCheckedChange={setPublishToWatchHomes}
                />
              </div>
            </>
          )}

          {/* Show all form fields only when Create Listing is selected */}
          {postType === "CREATE_LISTING" && (
            <>
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
                    ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                For Sale
              </Button>
              <Button
                type="button"
                variant={listingType === "FOR_RENT" ? "default" : "outline"}
                onClick={() => setListingType("FOR_RENT")}
                disabled={!isRentalCompany}
                title={!isRentalCompany ? "Upgrade to Rental Company to access this option" : ""}
                className={`flex-1 ${
                  listingType === "FOR_RENT"
                    ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
                    : "bg-white border-gray-300 text-gray-700"
                } ${!isRentalCompany ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                For Rent
              </Button>
              <Button
                type="button"
                variant={listingType === "STAY" ? "default" : "outline"}
                onClick={() => setListingType("STAY")}
                disabled={!isRentalCompany}
                title={!isRentalCompany ? "Upgrade to Rental Company to access this option" : ""}
                className={`flex-1 ${
                  listingType === "STAY"
                    ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
                    : "bg-white border-gray-300 text-gray-700"
                } ${!isRentalCompany ? "opacity-50 cursor-not-allowed" : ""}`}
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">$</span>
              <Input
                id="price"
                placeholder={listingType === "FOR_SALE" ? "1,950,000" : listingType === "STAY" ? "150/night" : "2,500/month"}
                className="w-full pl-7"
                value={listingType === "FOR_SALE" ? price : monthlyRent}
                onChange={(e) => listingType === "FOR_SALE" ? setPrice(e.target.value) : setMonthlyRent(e.target.value)}
              />
            </div>
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
                  className="w-4 h-4 text-[#968470] border-gray-300 rounded focus:ring-[#968470]"
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
              <Input
                id="city"
                placeholder="Enter city name"
                className="w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
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

          {/* Address Related Fields */}
          {/* Street Address */}
          {/* <div>
            <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </Label>
            <Input
              id="streetAddress"
              placeholder="Enter street address"
              className="w-full"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div> */}

          {/* Unit / Apartment */}
          <div>
            <Label htmlFor="unitApartment" className="block text-sm font-medium text-gray-700 mb-2">
              Unit / Apartment
            </Label>
            <Input
              id="unitApartment"
              placeholder="Enter unit or apartment number"
              className="w-full"
              value={unitApartment}
              onChange={(e) => setUnitApartment(e.target.value)}
            />
          </div>

          {/* State */}
          <div>
            <Label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State
            </Label>
            <Input
              id="state"
              placeholder="Enter state name"
              className="w-full"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family Home</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhome">Townhome</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                      ? "bg-[#968470] text-white border-[#968470]"
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
                      ? "bg-[#968470] text-white border-[#968470]"
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
              placeholder="Write Amenities (separate with commas, e.g. Pool, Parking, Gym)"
              className="w-full"
              value={amenitiesInput}
              onChange={(e) => {
                const input = e.target.value;
                setAmenitiesInput(input);
                // Parse the input into array
                if (input.trim() === "") {
                  setAmenities([]);
                } else {
                  const newAmenities = input
                    .split(",")
                    .map((a) => a.trim())
                    .filter((a) => a.length > 0);
                  setAmenities(newAmenities);
                }
              }}
            />
          </div>

          {/* Lot Size */}
          <div>
            <Label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size (Sq Ft)
            </Label>
            <Input
              id="lotSize"
              type="number"
              placeholder="Enter lot size"
              className="w-full"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
          </div>

          {/* Year Built */}
          <div>
            <Label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
              Year Built
            </Label>
            <Input
              id="yearBuilt"
              type="number"
              placeholder="Enter year built"
              className="w-full"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
            />
          </div>

          {/* Features (separate from amenities) */}
          <div>
            <Label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </Label>
            <Input
              id="features"
              placeholder="Write features (comma-separated, max 5)"
              className="w-full"
              value={featuresInput}
              disabled={features.length >= 5}
              onChange={(e) => {
                const input = e.target.value;
                setFeaturesInput(input);
                const newFeatures = input
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f.length > 0)
                  .slice(0, 5); // Limit to 5 features
                setFeatures(newFeatures);
              }}
            />
            {features.length > 0 && (
              <p className={`text-xs mt-1 ${
                features.length >= 5 ? "text-red-500 font-medium" : "text-gray-500"
              }`}>
                {features.length}/5 features
                {features.length >= 5 && " - Maximum reached"}
              </p>
            )}
          </div>

          {/* HOA Fees */}
          <div>
            <Label htmlFor="hoaFees" className="block text-sm font-medium text-gray-700 mb-2">
              HOA Fees (Monthly)
            </Label>
            <Input
              id="hoaFees"
              type="number"
              placeholder="Enter monthly HOA fees"
              className="w-full"
              value={hoaFees}
              onChange={(e) => setHoaFees(e.target.value)}
            />
          </div>

          {/* Agent Name */}
          <div>
            <Label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </Label>
            <Input
              id="agentName"
              placeholder="Enter agent name"
              className="w-full"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>

          {/* Brokerage Name */}
          <div>
            <Label htmlFor="brokerageName" className="block text-sm font-medium text-gray-700 mb-2">
              Brokerage Name
            </Label>
            <Input
              id="brokerageName"
              placeholder="Enter brokerage name"
              className="w-full"
              value={brokerageName}
              onChange={(e) => setBrokerageName(e.target.value)}
            />
          </div>

          {/* State Disclosures */}
          <div>
            <Label htmlFor="stateDisclosures" className="block text-sm font-medium text-gray-700 mb-2">
              State Disclosures
            </Label>
            <Textarea
              id="stateDisclosures"
              placeholder="Enter state disclosures..."
              className="w-full h-20 resize-none"
              value={stateDisclosures}
              onChange={(e) => setStateDisclosures(e.target.value)}
            />
          </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
