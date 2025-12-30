"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Star,
  MapPin,
  ArrowLeft,
  Share2,
  ChevronDown,
  BookmarkIcon,
} from "lucide-react";
import { useState } from "react";
import { Lead } from "@/app/Utils/tourTypes";
import RatingForm from "./rating-form";
import { QueryObserverResult } from "@tanstack/react-query";

interface CardProps {
  onClose?: () => void;
  data: Lead | null;
  isSaved: boolean;
  onToggleSave: () => void;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
}

export default function 
DetailedBookingCard({
  onClose,
  data,
  isSaved,
  onToggleSave,
  refetch,
}: CardProps) {
  const [isHomeFactsExpanded, setIsHomeFactsExpanded] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const toggleHomeFacts = () => {
    setIsHomeFactsExpanded(!isHomeFactsExpanded);
  };
  return (
    <>
      <div className="px-4">
  <Card className="w-[720px] max-w-screen-md md:max-w-screen-lg lg:max-w-[900px] max-h-[90vh] border rounded-2xl p-5 mx-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">Detail</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-5 w-5" />
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
                      isSaved ? "text-black fill-black" : "text-black"
                    }`}
                  />
                  <span>{isSaved ? "Unsave" : "Save"}</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                {data?.bookingStatus === "pending" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setShowRatingForm(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    <span>Rating</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-y-auto pr-2 space-y-6 flex-1">
            {/* Image */}
            <div className="w-full overflow-hidden rounded-xl relative h-[335px]">
              <Image
                src={
                  (data && data?.post?.images?.[0]) || "/images/clip-image.jpg"
                }
                alt={data?.post?.title || ""}
                fill
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <CardContent className="p-0 space-y-6">
              {/* Price and Tags */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="text-2xl font-bold">{data?.post?.price}</div>
                {data?.post?.tags?.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-white hover:bg-[#5A7A5A] text-black px-3 py-1 rounded-md"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title + Rating */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{data?.post?.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  {data && data?.post?.ratingCount > 0 && (
                    <>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>
                        {data?.post?.ratingCount}{" "}
                        {data?.post?.reviewCount > 0 && (
                          <>({data?.post?.reviewCount} reviews)</>
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium">Location</span>
                  <span>{data?.post?.location}</span>
                </div>
              </div>

              {/* Agent Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={data?.agent?.avatarUrl}
                    alt={data?.agent?.user_name}
                  />
                  <AvatarFallback>
                    {" "}
                    {`${data?.agent?.first_name?.charAt(0) || ""}${
                      data?.agent?.last_name?.charAt(0) || ""
                    }`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-base">
                    {data?.agent.first_name} {data?.agent.last_name}
                  </div>
                  {/* <div className="text-sm text-muted-foreground">10k followers</div> */}
                  <div className="text-sm text-muted-foreground">
                    {data?.agent?.user_name}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {data?.post?.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="px-3 py-1 rounded-md"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expandable Facts */}
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={toggleHomeFacts}
                >
                  <h4 className="text-lg font-semibold">Home Facts</h4>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isHomeFactsExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isHomeFactsExpanded && (
                  <div className="flex flex-wrap gap-2">
                    {/* Bedrooms */}
                    {data?.post?.bedrooms && (
                      <Badge variant="outline" className="px-3 py-1 rounded-md">
                        {data.post.bedrooms} Beds
                      </Badge>
                    )}

                    {/* Bathrooms */}
                    {data?.post?.bathrooms && (
                      <Badge variant="outline" className="px-3 py-1 rounded-md">
                        {data.post.bathrooms} Baths
                      </Badge>
                    )}

                    {/* {data?.post?.sqft && (
                <Badge variant="outline" className="px-3 py-1 rounded-md">
                  {data.post.sqft} sqft
                </Badge>
              )}

              {data?.post?.builtYear && (
                <Badge variant="outline" className="px-3 py-1 rounded-md">
                  Built {data.post.builtYear}
                </Badge>
              )}

              {data?.post?.garage && (
                <Badge variant="outline" className="px-3 py-1 rounded-md">
                  Garage
                </Badge>
              )} */}
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      <RatingForm
        postId={data && data?.postId}
        open={showRatingForm}
        onOpenChange={setShowRatingForm}
        refetch={refetch}
      />
    </>
  );
}
