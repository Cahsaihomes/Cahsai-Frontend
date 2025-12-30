"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Bookmark, Share2, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { getMyPosts } from "../../services/get.my-posts.service";
import {
  deletePostService,
  incrementPostViewsService,
  incrementPostSavesService,
} from "../../services/create.post.service";

import BoostPostModal from "@/app/components/creatordashboard/clips/postmodal";
import ConfirmModal from "@/app/components/Modal/ConfirmModal";
import { toast } from "sonner";

export default function EditClipsPage() {
  const [filterBy, setFilterBy] = useState("all");
  const [deletedId, setDeletedId] = useState("");
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [clipsData, setClipsData] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [boostPost, setBoostPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sliderIndexes, setSliderIndexes] = useState<{
    [id: string]: number;
  }>({});
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getMyPosts();
      setClipsData(res.data || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePostService(deletedId);
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (err: any) {
      toast.error("Failed to delete post");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    router.push("/agentdashboard/clips-edit/upload-post");
  };

  const editClick = async (postId: number) => {
    try {
      await incrementPostViewsService(postId);
      // toast.success("Post viewed!");
    } catch (err: any) {
      toast.error("Failed to increment views");
    }
    router.push(`/agentdashboard/clips-edit/edit-clip?postId=${postId}`);
  };

  const handleSave = async (postId: number) => {
    try {
      await incrementPostSavesService(postId);
      setSavedIds((prev) => new Set(prev).add(postId));
      toast.success("Post saved!");
      fetchPosts();
    } catch (err: any) {
      toast.error("Failed to save post");
    }
  };

  return (
    <>
      <div className="lg:p-6 py-4 px-1 p-0 bg-white border border-[#D5D7DA] rounded-[12px] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
              Clip & Edit
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  router.push("/agentdashboard/clips-edit/boost-post")
                }
                className="flex items-center gap-2 lg:px-6 px-2 py-2 rounded-lg text-white font-medium text-base border-0 shadow-sm transition-colors duration-200"
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
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
                </svg>
                <span className="hidden lg:inline"> Post Boost</span>
              </button>
              <Button
                onClick={handleClick}
                className="flex items-center bg-[#6F8375] hover:bg-[#6F8375] gap-2 lg:px-6 px-2 py-2 rounded-lg text-white font-medium text-base border-0 shadow-sm transition-colors duration-200"

                // className=" text-white"
              >
                <Plus className="h-4 w-4 lg:mr-2 mr-0" />
                <span className="hidden lg:inline"> Upload Post</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Clips" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clips</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Most Recent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="saves">Most Saves</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maintain slider state for each card by id */}
            {(() => {
              // Helper to update index for a given card
              const setIndex = (id: string, idx: number) =>
                setSliderIndexes((prev) => ({ ...prev, [id]: idx }));
              return clipsData.map((clip) => {
                // Gather all media (images then videos)
                const images = Array.isArray(clip.images) ? clip.images : [];
                // Support both 'video' (string) and 'videos' (array)
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
                  ...images.map((img: string) => ({ type: "image", src: img })),
                  ...videos.map((vid: string) => ({ type: "video", src: vid })),
                ];
                if (media.length === 0 && clip.image) {
                  media.push({ type: "image", src: clip.image });
                }
                if (media.length === 0) {
                  media.push({ type: "image", src: "/placeholder.svg" });
                }
                const currentIdx = sliderIndexes[clip.id] ?? 0;
                const goPrev = () =>
                  setIndex(
                    clip.id,
                    currentIdx > 0 ? currentIdx - 1 : media.length - 1
                  );
                const goNext = () =>
                  setIndex(
                    clip.id,
                    currentIdx < media.length - 1 ? currentIdx + 1 : 0
                  );
                return (
                  <div key={clip.id} className="relative">
                    <Card className="border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-white">
                      <div className="relative m-4">
                        <div className="relative w-full flex flex-col items-center">
                          <div className="relative w-full">
                            {/* Promoted Badge */}
                            {clip.isPromoted && (
                              <span
                                className="mb-4 mt-1 ml-2 bg-[#E8F0E0] text-[#417E00] text-xs px-2 py-1 rounded inline-block"
                                style={{ pointerEvents: "none" }}
                              >
                                Promoted
                              </span>
                            )}
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
                              <>
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
                              </>
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
                        {/* Price, Edit, and Delete */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-gray-900">
                            $ {clip.price}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => editClick(clip.id)}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                <path d="M13.5 6.5l4 4" />
                              </svg>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setOpen(true);
                                setDeletedId(clip.id);
                              }}
                              className="h-6 w-6 text-red-400 hover:text-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M4 7l16 0" />
                                <path d="M10 11l0 6" />
                                <path d="M14 11l0 6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-xs text-gray-600 truncate">
                            {clip.location}
                          </span>
                        </div>
                        {/* Stats */}
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
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 mr-1" />
                            <span className="text-xs text-gray-600">
                              {clip.shares || 0}
                            </span>
                          </div>
                        </div>
                        {/* Tags */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-800 mb-2">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(clip.tags.slice(0, 4) as string[]).map(
                              (tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200  px-1.5 py-0.5 h-5 text-xs"
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
                      <div className="px-3 pb-3">
                        {!clip.isPromoted && (
                          <button
                            className="w-full flex items-center justify-center gap-2 text-white font-medium rounded-lg py-2 transition-colors duration-200 shadow-sm text-base border-0"
                            style={{
                              marginTop: "8px",
                              background:
                                "linear-gradient(95.09deg, #69AD7D 0%, #3D6E4B 100%)",
                            }}
                            onClick={() => {
                              setBoostModalOpen(true);
                              setBoostPost(clip);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
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
                          </button>
                        )}
                      </div>
                      {/* Boost Post Modal */}
                      <BoostPostModal
                        isOpen={boostModalOpen}
                        onClose={() => setBoostModalOpen(false)}
                        post={boostPost}
                        onBoostSuccess={fetchPosts}
                        fetchPosts={fetchPosts}
                      />
                    </Card>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete this clip? This action cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onCancel={() => console.log("Cancel from parent")}
        onConfirm={handleDelete}
        loading={loading}
        // disableCloseOnOutsideClick // uncomment if you want strict modal
      />
    </>
  );
}
