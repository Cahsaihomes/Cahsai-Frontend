"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";

// LightGallery
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-zoom.css";

import { useEffect, useRef, useState } from "react";

interface DetailedListingCardProps {
  id: string | number;
  images?: string[];
  video?: string;
  price: string;
  tags: string[];
  agentName: string;
  agentAvatarUrl?: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  location: string;
  description: string;
  topBadgeText?: string;
  onBookTour?: () => void;
  onToggleSave: () => void;
  isLike?: boolean;

  // NEW RENTAL PROPS
  listing_type?: "FOR_SALE" | "FOR_RENT" | "STAY";
  monthly_rent?: number;
  amenities?: string[];
  title?: string;
}

export default function DetailedListingCard({
  images = [],
  video = "",
  price,
  tags,
  agentName,
  agentAvatarUrl,
  bedrooms,
  bathrooms,
  area,
  location,
  description,
  topBadgeText,
  onBookTour,
  onToggleSave,
  isLike,
  id,
  listing_type = "FOR_SALE",
  monthly_rent,
  amenities = [],
  title,
}: DetailedListingCardProps) {
  const router = useRouter();

  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const remainingCount = images.length > 1 ? images.length - 1 : 0;

  // Determine if this is a rental
  const isRental = listing_type === "FOR_RENT";
  const isStay = listing_type === "STAY";

  // Format price display
  const displayPrice =
    isRental || isStay
      ? `$${monthly_rent || price.replace("$", "")} / ${isStay ? "night" : "month"}`
      : price;

  // Get amenity chips (2-3 for display)
  const displayAmenities = amenities.slice(0, 3);

  // Auto mini-player when video scrolls out of view
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;

        if (!isVisible && !videoRef.current?.paused) {
          setShowMiniPlayer(true);
        } else {
          setShowMiniPlayer(false);
        }
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Hover preview
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="w-full max-w-[560px] lg:max-w-4xl rounded-xl border shadow-md overflow-hidden bg-white text-black">
      {/* MAIN MEDIA CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full h-[300px] cursor-pointer group"
        onMouseEnter={video ? handleMouseEnter : undefined}
        onMouseLeave={video ? handleMouseLeave : undefined}
      >
        <LightGallery speed={500} plugins={[lgThumbnail, lgZoom, lgVideo]}>
          {/* First item (video or first image) */}
          {video ? (
            <a
              data-lg-size="1280-720"
              data-video={`{ "source": [ { "src":"${video}", "type":"video/mp4" } ], "attributes": { "controls": true } }`}
            >
              <video
                ref={videoRef}
                src={video}
                className="object-cover w-full h-[300px] rounded-md"
              />
            </a>
          ) : (
            <a href={images[0]} data-lg-size="1400-900">
              <Image
                src={images[0]}
                alt="Property Image"
                width={600}
                height={300}
                className="object-cover w-full h-[300px]"
              />
            </a>
          )}

          {/* Remaining images */}
          {images.slice(1).map((img, index) => (
            <a
              key={index}
              href={img}
              data-lg-size="1400-900"
              style={{ display: "block" }}
            />
          ))}
        </LightGallery>

        {/* Fade gradient */}
        <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Image count overlay */}
        {remainingCount > 0 && (
          <div className="absolute bottom-3 right-3 bg-[#D4EDDA] text-[#28A745] px-3 py-1 rounded-md text-sm">
            +{remainingCount} more
          </div>
        )}

        {/* Badges */}
        {topBadgeText && (
          <div className="absolute top-2 left-6">
            <Badge className="bg-[#D4EDDA] text-[#28A745] text-xs rounded-full px-2 py-0.5">
              {topBadgeText}
            </Badge>
          </div>
        )}

        {/* Icons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSave}
            className="h-8 w-8 rounded-full bg-white/80 text-gray-700 hover:bg-white"
          >
            <Heart
              className={`h-4 w-4 ${isLike ? "text-red-500 fill-red-500" : ""}`}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 text-gray-700 hover:bg-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* MINI PLAYER (YouTube style) */}
      {showMiniPlayer && video && (
        <div className="fixed bottom-4 right-4 w-[230px] h-[140px] shadow-xl bg-black rounded-lg z-[9999]">
          <video
            src={video}
            autoPlay
            controls
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={() => setShowMiniPlayer(false)}
            className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      )}

      {/* CONTENT */}
      <CardContent className="p-4 space-y-2">
        {/* Tags or Amenity Badges */}
        <div className="flex gap-2 flex-wrap">
          {(isRental || isStay) && displayAmenities.length > 0
            ? displayAmenities.map((amenity, index) => (
                <Badge
                  key={index}
                  className="bg-[#6B8E6E] text-white text-xs px-2 py-0.5 rounded"
                >
                  {amenity}
                </Badge>
              ))
            : tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs hover:bg-[#6B8E6E] hover:text-white cursor-pointer px-2 py-0.5 rounded"
                >
                  {tag}
                </Badge>
              ))}
        </div>

        {/* Price */}
        <div className="text-xl font-semibold">{displayPrice}</div>

        {/* Property Title (for rentals) */}
        {(isRental || isStay) && title && (
          <div className="text-base font-medium text-gray-800">{title}</div>
        )}

        {/* Agent/Property Manager */}
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() =>
            router.push(`/buyerdashboard/agent-creator-profile?id=${id}`)
          }
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={agentAvatarUrl || "/placeholder.svg"} />
            <AvatarFallback>
              {agentName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {isRental || isStay ? `Managed by ${agentName}` : agentName}
          </span>
        </button>

        {/* Property Specs */}
        <div className="text-sm text-gray-600">
          {bedrooms}BR • {bathrooms}BA • {area} sq ft
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>

      {/* FOOTER - Buttons */}
      <CardFooter className="px-4 pb-4 flex gap-2">
        {(isRental || isStay) && (
          <>
            <Button
              onClick={onBookTour}
              className="flex-1 bg-[#5a6b60] hover:bg-[#4a5b50] text-white text-sm font-medium py-2 rounded-md"
            >
              Apply Now
            </Button>
            <Button
              onClick={onBookTour}
              className="flex-1 bg-[#6B8E6E] hover:bg-[#5e7d5f] text-white text-sm font-medium py-2 rounded-md"
            >
              Schedule Tour
            </Button>
          </>
        )}

        {!isRental && !isStay && (
          <Button
            onClick={onBookTour}
            className="w-full bg-[#6B8E6E] hover:bg-[#5e7d5f] text-white text-sm font-medium py-2 rounded-md"
          >
            Book a tour
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
