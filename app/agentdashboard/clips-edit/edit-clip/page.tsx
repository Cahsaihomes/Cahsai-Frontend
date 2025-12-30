"use client";

import Image from "next/image";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { updatePostService } from "../../../services/create.post.service";

import { getMyPosts } from "../../../services/get.my-posts.service";
import { toast } from "sonner";

export default function Page() {
  const tags = [
    "Luxury Homes",
    "First-Time Buyers",
    "Relocations",
    "New Construction",
    "Shared Kitchen Access",
  ];
  const router = useRouter();

  // Get postId from query
  const searchParams = useSearchParams();
  const postId = Number(searchParams.get("postId"));

  // Form state
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [postImages, setPostImages] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<
    { type: string; src: string }[]
  >([]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch post data on mount
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await getMyPosts();
        const post = (res.data || []).find((p: any) => p.id === postId);
        if (post) {
          setLocation(post.location || "");
          setPrice(post.price ? String(post.price) : "");
          setTagInput(
            Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || ""
          );
          setDescription(post.description || "");
          // Gather all media (images then videos)
          const images = Array.isArray(post.images) ? post.images : [];
          let videos: string[] = [];
          if (Array.isArray(post.videos)) {
            videos = post.videos;
          } else if (typeof post.video === "string" && post.video.length > 0) {
            videos = [post.video];
          }
          const media = [
            ...images.map((img: string) => ({ type: "image", src: img })),
            ...videos.map((vid: string) => ({ type: "video", src: vid })),
          ];
          setExistingMedia(media);
        }
      } catch (err) {
        setError("Failed to fetch post data");
      }
    };
    fetchPost();
  }, [postId]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPostImages(Array.from(e.target.files));
    }
  };

  // Handle update
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // If only one image/video is being replaced, send only that file and its index
      let updatePayload: any = {
        location,
        price,
        tags: tagInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        description,
      };
      // If any replacements, send only the file and index
      if (postImages.some(Boolean)) {
        const replaceIdx = postImages.findIndex(Boolean);
        if (replaceIdx !== -1 && postImages[replaceIdx]) {
          const currentMedia = existingMedia[replaceIdx];
          if (currentMedia && currentMedia.type === "image") {
            updatePayload.post_images = [postImages[replaceIdx]];
            updatePayload.replaceIndex = replaceIdx;
          } else if (currentMedia && currentMedia.type === "video") {
            updatePayload.post_videos = [postImages[replaceIdx]];
            updatePayload.replaceVideo = replaceIdx;
          }
        }
      }
      await updatePostService(postId, updatePayload);
      setSuccess(true);

      toast.success("Post updated successfully!");
      setTimeout(() => {
        router.push("/agentdashboard/clips-edit");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Update failed");
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#D5D7DA] rounded-[12px] shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 ">
        <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
          Edit Clip
        </h1>
        <Button
          onClick={() => router.push("/agentdashboard/clips-edit")}
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* House Image & File Upload */}
        <div className="relative mb-4 sm:mb-6 -mt-4 sm:-mt-6 lg:-mt-10">
          {(() => {
            const originals = existingMedia;
            let mediaArr: { type: string; src: string; file?: File }[] = [];
            for (let i = 0; i < originals.length; i++) {
              if (postImages[i]) {
                const file = postImages[i];
                mediaArr.push({
                  type: file.type.startsWith("image") ? "image" : "video",
                  src: URL.createObjectURL(file),
                  file,
                });
              } else {
                mediaArr.push(originals[i]);
              }
            }
            const current =
              mediaArr && mediaArr.length > 0 ? mediaArr[mediaIndex] : null;
            if (!current) {
              return (
                <Image
                  src="/images/clip-image.jpg"
                  alt="Default"
                  width={779}
                  height={189}
                  className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg"
                />
              );
            }
            return (
              <div className="w-full flex flex-col items-center">
                {current.type === "image" ? (
                  <Image
                    src={current.src}
                    alt="main-media"
                    width={779}
                    height={189}
                    className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={current.src}
                    width={779}
                    height={189}
                    className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg"
                    controls
                  />
                )}
                {/* Thumbnails */}
                {mediaArr.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {mediaArr.map((media, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`border-2 ${
                          mediaIndex === idx
                            ? "border-[#6F8375]"
                            : "border-transparent"
                        } rounded focus:outline-none`}
                        onClick={() => setMediaIndex(idx)}
                      >
                        {media.type === "image" ? (
                          <Image
                            src={media.src}
                            alt={`thumb-${idx}`}
                            width={48}
                            height={32}
                            className="object-cover rounded"
                          />
                        ) : (
                          <video
                            src={media.src}
                            width={48}
                            height={32}
                            className="object-cover rounded"
                            muted
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {/* Replace Button for current index */}
                <div className="flex justify-center mt-4 sm:mt-6 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Upload className="h-5 w-5" />
                    Replace {current.type === "image" ? "Image" : "Video"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={current.type === "image" ? "image/*" : "video/*"}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const originalLength = existingMedia.length;
                        // Always keep array length same as originals
                        let newFiles =
                          postImages.length === originalLength
                            ? [...postImages]
                            : Array(originalLength)
                                .fill(undefined)
                                .map((_, i) => postImages[i]);
                        newFiles[mediaIndex] = file;
                        setPostImages(newFiles);
                      }
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Form Fields - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Location Field */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm sm:text-base text-gray-500"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Write description"
              className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] resize-none text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tags Field - Now below Description */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Tags
            </label>
            <Input
              placeholder="Write tags"
              className="w-full text-sm sm:text-base"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-center lg:justify-start mt-2">
              {tags.map((tag, index) => {
                const selected = tagInput
                  .split(",")
                  .map((t) => t.trim())
                  .includes(tag);
                return (
                  <Badge
                    key={index}
                    variant={selected ? "default" : "outline"}
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer ${
                      selected
                        ? "bg-[#6F8375] text-white"
                        : "bg-white text-gray-500"
                    }`}
                    onClick={() => {
                      let arr = tagInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      if (selected) {
                        arr = arr.filter((t) => t !== tag);
                      } else {
                        arr.push(tag);
                      }
                      setTagInput(arr.join(", "));
                    }}
                  >
                    <Image
                      src="/images/badge.svg"
                      alt="Badge"
                      width={20}
                      height={20}
                      className="inline-block mr-1"
                    />
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
          {/* Save Button */}
          <div className="p-4 w-full">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-[#6F8375] text-white px-6 py-2 rounded-lg hover:bg-[#4e5e53]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
