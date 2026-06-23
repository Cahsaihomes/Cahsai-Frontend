"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import {
  createPostService,
  CreatePostPayload,
} from "../../services/create.post.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home({ setShowUploadPost }: { setShowUploadPost: (show: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [productLink, setProductLink] = useState("");
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentMedia, setCurrentMedia] = useState(0);
  const [discoveryStay, setDiscoveryStay] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPreviewItems = useMemo(
    () =>
      postVideos.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [postVideos]
  );

  useEffect(() => {
    return () => {
      videoPreviewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [videoPreviewItems]);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const videos: File[] = [];
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

    // Helper function to check if file is a video
    const isVideoFile = (file: File) => {
      const videoMimes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"];
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv", ".mkv", ".flv", ".m4v"];
      
      if (file.type && videoMimes.some(mime => file.type.includes(mime))) {
        return true;
      }
      if (file.type && file.type.startsWith("video/")) {
        return true;
      }
      const fileName = file.name.toLowerCase();
      return videoExtensions.some(ext => fileName.endsWith(ext));
    };

    Array.from(files).forEach((file) => {
      if (isVideoFile(file)) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error(`Video "${file.name}" exceeds 100MB limit.`);
          return;
        }
        videos.push(file);
      } else {
        toast.error("Only video files are allowed");
        return;
      }
    });

    if (postVideos.length + videos.length > 5) {
      toast.error("You can upload a maximum of 5 videos.");
    }
    setPostVideos([...postVideos, ...videos].slice(0, 5));
    setCurrentMedia(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setUploadProgress(0);
    setUploadStatus("Starting upload...");
    
    const payload: CreatePostPayload = {
      title,
      description,
      location,
      productLink,
      post_videos: postVideos,
      price: "",
      zipCode: "",
      city: "",
      bedrooms: "",
      bathrooms: "",
      postType: "LISTING_VIDEO",
      discoveryStay: discoveryStay,
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
      setUploadStatus("Creating post...");
      
      // Wait a moment to show 100% completion
      setTimeout(() => {
        toast.success("Post created successfully!");
        router.push("/creatordashboard/home");
        setShowUploadPost(false);
        
        setTitle("");
        setDescription("");
        setLocation("");
        setProductLink("");
        setPostVideos([]);
        setUploadProgress(0);
        setUploadStatus("");
        setDiscoveryStay(false);
      }, 800);
      
    } catch (error: any) {
      console.error("Create post error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to create post!");
      setUploadProgress(0);
      setUploadStatus("");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() !== "" && description.trim() !== "" && location.trim() !== "" && productLink.trim() !== "" && postVideos.length > 0;


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
        <div className="w-full md:max-w-md space-y-6">
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

          {/* Product Link */}
          <div>
            <Label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-2">
              Product Link
            </Label>
            <Input
              id="productLink"
              placeholder="Enter Product Link (e.g., https://example.com/product)"
              className="w-full"
              type="url"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
            />
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

          {/* Discovery Stay Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Label
              htmlFor="discoveryStay"
              className="text-sm font-medium text-gray-700"
            >
              Enable Discovery Stay
            </Label>
            <button
              type="button"
              onClick={() => setDiscoveryStay(!discoveryStay)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                discoveryStay ? "bg-[#968470]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  discoveryStay ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right File Upload Section */}
        <div className="w-full md:flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="h-[400px] md:h-[465px] border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="video/*"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-4 w-full">
                  <div className="w-full flex flex-col items-center">
                    {postVideos.length === 0 ? (
                      <Image
                        src="/images/upload.svg"
                        alt="Upload Icon"
                        width={83}
                        height={83}
                      />
                    ) : (
                      <div className="w-full flex flex-col items-center">
                        {(() => {
                          const item = videoPreviewItems[currentMedia];
                          if (!item) return null;
                          return (
                            <video
                              src={item.url}
                              controls
                              className="mx-auto object-cover rounded border"
                              style={{ maxWidth: 150, maxHeight: 150 }}
                            />
                          );
                        })()}
                        <div className="flex justify-center mt-2 gap-2 w-full flex-wrap">
                          {videoPreviewItems.map((item, idx) => (
                            <div key={item.url} className="relative inline-block">
                              <video
                                src={item.url}
                                className={`object-cover rounded border cursor-pointer ${
                                  currentMedia === idx
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                                style={{ width: 48, height: 48 }}
                                onClick={() => setCurrentMedia(idx)}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPostVideos((prev) => {
                                    const arr = prev.filter((_, i) => i !== idx);
                                    if (arr.length === 0) setCurrentMedia(0);
                                    else if (currentMedia >= arr.length)
                                      setCurrentMedia(arr.length - 1);
                                    return arr;
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600"
                                title="Remove video"
                              >
                                ×
                              </button>
                            </div>
                          ))}
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
                <p className="text-sm text-[#D5D7DA]">
                  Maximum file size 100mb
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
