"use client";
import Image from "next/image";
import { BookmarkIcon as BookmarkFilled, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { savedPost, unsavedPost } from "@/app/services/get.my-posts.service";
import { useState } from "react";
import { useBuyerPost, useBuyerSavedPost } from "@/hooks/useHooks";
import { toast } from "sonner";
import { RequestTourDialog } from "./request-tour-dialog";

type MoodboardCardProps = {
  post: {
    id: number;
    price: string;
    name: string;
    city:string;
    type: string;
    location: string;
    image: string;
    profile_pic: string;
    isSaved: boolean;
    bedrooms?: number;
    bathrooms?: number;
    description?: string;
    tags?: string[];
    amenities?: string[];
    video?: string | null;
    isPromoted?: boolean;
    forYou?: boolean;
    contact?: string;
    email?: string;
    userId?:number;
  };
};

export default function MoodboardCard({ post }: MoodboardCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(post?.isSaved);
  const [loading, setLoading] = useState(false);
  const { refetch } = useBuyerPost();
  const { refetch: savedRefetch } = useBuyerSavedPost();
  const handleToggleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (saved) {
        await unsavedPost({ postId: post.id });
        toast.success("Post Unsaved Successfully!");
        setSaved(false);
      } else {
        await savedPost({ postId: post?.id });
        setSaved(true);
        toast.success("Post Saved Successfully!");
      }
      await Promise.all([refetch(), savedRefetch()]);
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <RequestTourDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={() => setIsOpen(false)}
        post={post}
      />
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
        <Image
          src={post?.image}
          alt={post?.type}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6 text-white">
          {/* Bookmark */}
          <div className="flex justify-end">
            <BookmarkFilled
              onClick={handleToggleSave}
              className={`w-6 cursor-pointer h-6 ${
                saved ? "fill-white text-white" : "text-white"
              }`}
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-4xl ">{post?.price}</h2>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 relative">
                <Image
                  src={post?.profile_pic || "/images/avatar.jpg"}
                  alt="Avatar"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-white drop-shadow">
                {post?.name}
              </span>
            </div>

            {/* Type */}
            <div className="text-lg">
              <span>{post?.type}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{post?.location}</span>
            </div>

            {/* Button */}
            <Button
              onClick={() => setIsOpen(true)}
              type="button"
              className="w-full bg-transparent text-white border border-white rounded-full hover:bg-white hover:text-black transition-colors duration-200"
            >
              Book a tour
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
