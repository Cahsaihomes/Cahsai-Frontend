"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Bookmark, Share2, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMyPosts } from "../../../services/get.my-posts.service";
import { incrementPostSavesService } from "../../../services/create.post.service";

import BoostPostModal from "@/app/components/creatordashboard/clips/postmodal";
import { toast } from "sonner";

export default function BoostPostPage() {
  const [clipsData, setClipsData] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [boostPost, setBoostPost] = useState<any>(null);
  const [promotedCollapsed, setPromotedCollapsed] = useState(false);
  const [expandCollapsed, setExpandCollapsed] = useState(false);

  // separate slider states for promoted and regular posts
  const [promotedSliderIndexes, setPromotedSliderIndexes] = useState<{
    [id: string]: number;
  }>({});
  const [regularSliderIndexes, setRegularSliderIndexes] = useState<{
    [id: string]: number;
  }>({});

  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getMyPosts();
      setClipsData(res.data || []);
    } catch (err) {
      // optionally handle error
    }
  };

  const handleSave = async (postId: number) => {
    try {
      await incrementPostSavesService(postId);
      setSavedIds((prev) => new Set(prev).add(postId));

      toast.success("Post saved!");
      fetchPosts();
    } catch (err: any) {
      toast.error("Failed to save post!");
    }
  };

  // Separate promoted and regular posts
  const promotedPosts = clipsData.filter((post) => post.isPromoted);
  const regularPosts = clipsData.filter((post) => !post.isPromoted);

  return (
    <div className="lg:p-6 py-4 px-1 p-0 bg-white border border-[#D5D7DA] rounded-[12px] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
              Boost Your Post
            </h1>
          </div>
        </div>

        {/* Promoted Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] lg:text-xl font-semibold text-gray-900">
                Promoted Posts
              </h2>
            </div>
            <button
              onClick={() => setPromotedCollapsed(!promotedCollapsed)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  promotedCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {!promotedCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotedPosts.length > 0 ? (
                promotedPosts.map((clip) => {
                  const images = Array.isArray(clip.images) ? clip.images : [];
                  let videos: string[] = [];
                  if (Array.isArray(clip.videos)) {
                    videos = clip.videos;
                  } else if (
                    typeof clip.video === "string" &&
                    clip.video.length > 0
                  ) {
                    videos = [clip.video];
                  }
                  const media = [
                    ...images.map((img: string) => ({
                      type: "image",
                      src: img,
                    })),
                    ...videos.map((vid: string) => ({
                      type: "video",
                      src: vid,
                    })),
                  ];
                  if (media.length === 0 && clip.image) {
                    media.push({ type: "image", src: clip.image });
                  }
                  if (media.length === 0) {
                    media.push({ type: "image", src: "/placeholder.svg" });
                  }

                  const currentIdx = promotedSliderIndexes[clip.id] ?? 0;
                  const goPrev = () =>
                    setPromotedSliderIndexes((prev) => ({
                      ...prev,
                      [clip.id]:
                        currentIdx > 0 ? currentIdx - 1 : media.length - 1,
                    }));
                  const goNext = () =>
                    setPromotedSliderIndexes((prev) => ({
                      ...prev,
                      [clip.id]:
                        currentIdx < media.length - 1 ? currentIdx + 1 : 0,
                    }));

                  return (
                    <div key={clip.id} className="relative">
                      <Card className="border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-white">
                        <div className="relative m-4">
                          <div className="relative w-full flex flex-col items-center">
                            <div className="relative w-full">
                              {/* Promoted Badge */}
                              <span
                                className="mb-4 mt-1 ml-2 bg-[#E8F0E0] text-[#417E00] text-xs px-2 py-1 rounded inline-block"
                                style={{ pointerEvents: "none" }}
                              >
                                Promoted
                              </span>
                              {media[currentIdx].type === "image" ? (
                                <Image
                                  src={media[currentIdx].src}
                                  alt={`Property Media ${currentIdx + 1}`}
                                  width={400}
                                  height={138}
                                  className="w-full h-64 object-cover rounded"
                                />
                              ) : (
                                <video
                                  src={media[currentIdx].src}
                                  controls
                                  className="w-full h-64 object-cover rounded"
                                />
                              )}
                              {media.length > 1 && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-4 z-30">
                                  <button
                                    onClick={goPrev}
                                    className="bg-white/20 backdrop-blur-md hover:bg-[#6F8375]/80 text-[#6F8375] hover:text-white rounded-full shadow-xl p-1.5 transition-all duration-200 ring-1 ring-[#6F8375]/10 hover:ring-white/40 scale-100 hover:scale-105 drop-shadow"
                                    style={{
                                      fontSize: 20,
                                      width: 36,
                                      height: 36,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 4px 16px 0 rgba(111,131,117,0.10)",
                                    }}
                                    aria-label="Previous media"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={goNext}
                                    className="bg-white/20 backdrop-blur-md hover:bg-[#6F8375]/80 text-[#6F8375] hover:text-white rounded-full shadow-xl p-1.5 transition-all duration-200 ring-1 ring-[#6F8375]/10 hover:ring-white/40 scale-100 hover:scale-105 drop-shadow"
                                    style={{
                                      fontSize: 20,
                                      width: 36,
                                      height: 36,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 4px 16px 0 rgba(111,131,117,0.10)",
                                    }}
                                    aria-label="Next media"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M9 6l6 6-6 6" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            {media.length > 1 && (
                              <div className="flex gap-1 mt-2">
                                {media.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-block w-2 h-2 rounded-full ${
                                      idx === currentIdx
                                        ? "bg-[#6F8375]"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-base font-semibold text-gray-900">
                              $ {clip.price}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-xs text-gray-600 truncate">
                              {clip.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-0.5">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="text-xs text-gray-600">
                                {typeof clip.views === "number"
                                  ? clip.views.toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => handleSave(clip.id)}
                                title="Save post"
                              >
                                <Bookmark
                                  className={`w-4 h-4 mr-1 ${
                                    savedIds.has(clip.id)
                                      ? "text-[#6F8375] fill-[#6F8375]"
                                      : "text-gray-500"
                                  }`}
                                  fill={
                                    savedIds.has(clip.id) ? "#6F8375" : "none"
                                  }
                                />
                              </button>
                              <span className="text-xs text-gray-600">
                                {clip.saves || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Share2 className="w-4 h-4 mr-1" />
                              <span className="text-xs text-gray-600">
                                {clip.shares || 0}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">
                              Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(clip.tags.slice(0, 4) as string[]).map(
                                (tag: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-1.5 py-0.5 h-5 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                )
                              )}
                              {clip.tags.length > 4 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-1.5 py-0.5 h-5"
                                >
                                  +{clip.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center w-full h-40 text-gray-500 font-medium">
                  No Promoted Posts Found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand Your Post Reach Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] lg:text-xl font-semibold text-gray-900">
              Expand Your Post Reach
            </h2>
            <button
              onClick={() => setExpandCollapsed(!expandCollapsed)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  expandCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {!expandCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularPosts.length > 0 ? (
                regularPosts.map((clip) => {
                  const images = Array.isArray(clip.images) ? clip.images : [];
                  let videos: string[] = [];
                  if (Array.isArray(clip.videos)) {
                    videos = clip.videos;
                  } else if (
                    typeof clip.video === "string" &&
                    clip.video.length > 0
                  ) {
                    videos = [clip.video];
                  }
                  const media = [
                    ...images.map((img: string) => ({
                      type: "image",
                      src: img,
                    })),
                    ...videos.map((vid: string) => ({
                      type: "video",
                      src: vid,
                    })),
                  ];
                  if (media.length === 0 && clip.image) {
                    media.push({ type: "image", src: clip.image });
                  }
                  if (media.length === 0) {
                    media.push({ type: "image", src: "/placeholder.svg" });
                  }

                  const currentIdx = regularSliderIndexes[clip.id] ?? 0;
                  const goPrev = () =>
                    setRegularSliderIndexes((prev) => ({
                      ...prev,
                      [clip.id]:
                        currentIdx > 0 ? currentIdx - 1 : media.length - 1,
                    }));
                  const goNext = () =>
                    setRegularSliderIndexes((prev) => ({
                      ...prev,
                      [clip.id]:
                        currentIdx < media.length - 1 ? currentIdx + 1 : 0,
                    }));

                  return (
                    <div key={clip.id} className="relative">
                      <Card className="border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-white">
                        <div className="relative m-4">
                          <div className="relative w-full flex flex-col items-center">
                            <div className="relative w-full">
                              {media[currentIdx].type === "image" ? (
                                <Image
                                  src={media[currentIdx].src}
                                  alt={`Property Media ${currentIdx + 1}`}
                                  width={400}
                                  height={138}
                                  className="w-full h-64 object-cover rounded"
                                />
                              ) : (
                                <video
                                  src={media[currentIdx].src}
                                  controls
                                  className="w-full h-64 object-cover rounded"
                                />
                              )}
                              {media.length > 1 && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-4 z-30">
                                  <button
                                    onClick={goPrev}
                                    className="bg-white/20 backdrop-blur-md hover:bg-[#6F8375]/80 text-[#6F8375] hover:text-white rounded-full shadow-xl p-1.5 transition-all duration-200 ring-1 ring-[#6F8375]/10 hover:ring-white/40 scale-100 hover:scale-105 drop-shadow"
                                    style={{
                                      fontSize: 20,
                                      width: 36,
                                      height: 36,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 4px 16px 0 rgba(111,131,117,0.10)",
                                    }}
                                    aria-label="Previous media"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={goNext}
                                    className="bg-white/20 backdrop-blur-md hover:bg-[#6F8375]/80 text-[#6F8375] hover:text-white rounded-full shadow-xl p-1.5 transition-all duration-200 ring-1 ring-[#6F8375]/10 hover:ring-white/40 scale-100 hover:scale-105 drop-shadow"
                                    style={{
                                      fontSize: 20,
                                      width: 36,
                                      height: 36,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 4px 16px 0 rgba(111,131,117,0.10)",
                                    }}
                                    aria-label="Next media"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M9 6l6 6-6 6" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            {media.length > 1 && (
                              <div className="flex gap-1 mt-2">
                                {media.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-block w-2 h-2 rounded-full ${
                                      idx === currentIdx
                                        ? "bg-[#6F8375]"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-base font-semibold text-gray-900">
                              $ {clip.price}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600 truncate">
                              {clip.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
                              <Eye className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                {typeof clip.views === "number"
                                  ? clip.views.toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => handleSave(clip.id)}
                                title="Save post"
                              >
                                <Bookmark
                                  className={`h-3 w-3 transition-colors ${
                                    savedIds.has(clip.id)
                                      ? "text-[#6F8375] fill-[#6F8375]"
                                      : "text-gray-500"
                                  }`}
                                  fill={
                                    savedIds.has(clip.id) ? "#6F8375" : "none"
                                  }
                                />
                              </button>
                              <span className="text-xs text-gray-600">
                                {clip.saves}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Share2 className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                {clip.shares}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-1.5">
                              Tags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(clip.tags.slice(0, 4) as string[]).map(
                                (tag: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-1.5 py-0.5 h-5 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                )
                              )}
                              {clip.tags.length > 4 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-1.5 py-0.5 h-5"
                                >
                                  +{clip.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            className="w-full flex items-center justify-center gap-2 text-white font-medium rounded-lg py-2 transition-colors duration-200 shadow-sm text-base border-0 mt-3"
                            onClick={() => {
                              setBoostPost(clip);
                              setBoostModalOpen(true);
                            }}
                            style={{
                              background:
                                "linear-gradient(95.09deg, #69AD7D 0%, #3D6E4B 100%)",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-flame"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
                            </svg>
                            Post Boost
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center w-full h-40 text-gray-500 font-medium">
                  No Posts Found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Boost Modal */}
      <BoostPostModal
        isOpen={boostModalOpen}
        onClose={() => setBoostModalOpen(false)}
        post={boostPost}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}
