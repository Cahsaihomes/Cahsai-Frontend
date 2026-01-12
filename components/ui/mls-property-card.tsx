"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Property } from "@/hooks/usemls";

// LightGallery
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-zoom.css";

type Props = {
  property: Property;
  onClick?: () => void;
  onToggleSave?: () => void;
  onBookTour?: () => void;
  isLike?: boolean;
};

const MlsPropertyCard: React.FC<Props> = ({
  property,
  onClick,
  onToggleSave,
  onBookTour,
  isLike = false,
}) => {
  const router = useRouter();
  const raw = property.raw || {};
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  const title =
    property.address ||
    [property.streetNumber, property.streetName].filter(Boolean).join(" ") ||
    property.city ||
    "Address unavailable";

  const beds = property.beds ?? 0;
  const baths = property.baths ?? 0;
  const area = property.livingArea ?? "N/A";
  const listPrice = property.listPrice ?? 0;

  // Get agent info from property (extracted from agentDetail)
  const agentName = property.agentName || "MLS Agent";
  const agentImage = property.agentImage || "";
  const agentPhone = property.agentPhone || "";
  const agentEmail = property.agentEmail || "";
  
  // Build complete location from all address components
  const addressParts = [
    property.streetNumber && property.streetName ? `${property.streetNumber} ${property.streetName}` : 
    property.address || "",
    property.city,
    property.state,
    property.postalCode ? `Postal Code ${property.postalCode}` : ""
  ].filter(Boolean);
  
  const completeLocation = addressParts.length > 0 
    ? addressParts.join(", ") 
    : "Location unavailable";
  
  const description = raw.publicRemarks || "No description available.";
  const propertyType = raw.propertyType || "Property";

  // Get agent avatar fallback initials
  const getAgentInitials = () => {
    const parts = (agentName || "ML").split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  return (
    <Card className="w-full max-w-[560px] lg:max-w-4xl rounded-xl border shadow-md overflow-hidden bg-white text-black flex flex-col h-full">
      {/* MAIN MEDIA CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full h-[300px] cursor-pointer group bg-gray-200 flex-shrink-0"
      >
        <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
          {/* Image */}
          {property.image ? (
            <a href={property.image} data-lg-size="1400-900">
              <img
                src={property.image}
                alt={title}
                className="object-cover w-full h-[300px]"
              />
            </a>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-300 text-gray-500">
              No Image Available
            </div>
          )}
        </LightGallery>

        {/* Fade gradient */}
        <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black/60 to-transparent" />

        {/* MLS Status Badge */}
        {/* <div className="absolute top-2 left-6">
          <Badge className="bg-[#D4EDDA] text-[#28A745] text-xs rounded-full px-2 py-0.5">
            {property.mlsStatus || "MLS"}
          </Badge>
        </div> */}

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

      {/* CONTENT */}
      <CardContent className="p-4 space-y-2 flex-grow">
        {/* Property Type Badge */}
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-[#6B8E6E] text-white text-xs px-2 py-0.5 rounded">
            {propertyType}
          </Badge>
          {raw.propertySubType && (
            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              {raw.propertySubType}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="text-xl font-semibold">
          ${listPrice?.toLocaleString() || "N/A"}
        </div>

        {/* Agent/Property Manager */}
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => router.push(`/buyerdashboard/agent-creator-profile?id=${agentName}`)}
        >
          <Avatar className="w-8 h-8">
            {agentImage ? (
              <AvatarImage src={agentImage} alt={agentName} />
            ) : null}
            <AvatarFallback className="bg-[#6B8E6E] text-white text-xs font-semibold">
              {getAgentInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{agentName}</span>
          
          </div>
        </button>

        {/* Property Specs */}
        <div className="text-sm text-gray-600">
          {beds}BR • {baths}BA • {area} sq ft
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{completeLocation}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>

      {/* FOOTER - Button */}
      <CardFooter className="px-4 pb-4 flex gap-2 flex-shrink-0 mt-auto">
        <Button
          onClick={onBookTour}
          className="w-full bg-[#6B8E6E] hover:bg-[#5e7d5f] text-white text-sm font-medium py-2 rounded-md"
        >
          Book a tour
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MlsPropertyCard;
