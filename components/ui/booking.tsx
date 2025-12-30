"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Star,
  MapPin,
  ArrowRight,
  Share2,
  BookmarkIcon,
} from "lucide-react";
import { Lead } from "@/app/Utils/tourTypes";

import { useEffect, useState } from "react";
import ConfirmModal from "@/app/components/Modal/ConfirmModal";

interface PropertyCardProps {
  onDetailClick: () => void;
  onRatingClick: (postId: number) => void;
  data: Lead;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function BookingCard({
  onDetailClick,
  onRatingClick,
  data,
  onToggleSave,
  isSaved,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  return (
    <>
      <Card className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full h-48">
          <Image
            src={data?.post?.images?.[0] || "/images/clip-image.jpg"}
            alt="Luxury house with green lawn"
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
          {/* Booking Status Badge - top left */}
          {data?.bookingStatus && (
            <span
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold shadow ${
                data.bookingStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : data.bookingStatus === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : data.bookingStatus === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              style={{ zIndex: 2 }}
            >
              {data.bookingStatus.charAt(0).toUpperCase() + data.bookingStatus.slice(1)}
            </span>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{data?.post?.price}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onToggleSave}
                >
                  <BookmarkIcon
                    className={`mr-2 h-4 w-4 ${
                      saved ? "text-black fill-black" : "text-black"
                    }`}
                  />
                  <span>{saved ? "Unsave" : "Save"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                {data?.bookingStatus === "pending" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onRatingClick(data.postId)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    <span>Rating</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    
          <h3 className="text-lg font-semibold">{data?.post?.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <span>{data?.post?.homeStyle?.slice(0, 2).join(" | ")}</span>
            {data?.post?.ratingCount > 0 && (
              <>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-2" />
                <span>{data?.post?.ratingCount}</span>{" "}
              </>
            )}
          </div>
          {/* Updated structure for location and address alignment */}
          <div className="flex text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5" />{" "}
            {/* Icon */}
            <div className="flex flex-col space-y-1">
              {" "}
              {/* Container for Location text and Address */}
              <span className="font-medium">Location</span>
              <span>{data?.post?.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium text-primary cursor-pointer hover:underline">
            <span>Amenities</span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          {data?.bookingStatus === "pending" && (
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(true)}
            >
              Cancel
            </Button>
          )}
          <Button
            className="flex-1 bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white"
            onClick={onDetailClick}
          >
            Detail
          </Button>
        </CardFooter>
      </Card>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Cancel Booking"
        description="Are you sure you want to cancel this tour requests? This action cannot be undone."
        cancelLabel="Keep Booking"
        confirmLabel="Cancelled"
        onCancel={() => console.log("Cancel from parent")}
      />
    </>
  );
}
