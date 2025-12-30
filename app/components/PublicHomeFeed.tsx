"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/hooks/post-service";
import { Post } from "@/app/Utils/post-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ButtonGroup from "@/components/ui/button-group";
import PropertyCard from "@/components/ui/property-card";
import DetailedListingCard from "@/components/ui/detailed-listing-card";
import FeedFilter from "@/components/ui/feed-filter";
import ListingFeedFilter from "@/components/ui/listing-feed-filter";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicHomeFeed() {
  const router = useRouter();

  const [activeButton, setActiveButton] = useState<"watch" | "search">("watch");
  const [showFilter, setShowFilter] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [propertyType, setPropertyType] = useState<"sale" | "rent" | "stays">(
    "sale",
  );

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBadgeFilters, setActiveBadgeFilters] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [moreFilters, setMoreFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1_000_000]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([0, 5000]);
  const [selectedCity, setSelectedCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const { data: posts = [], isLoading, isError } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const filteredByType = posts.filter((post) => {
    if (!post.listing_type) return true;
    if (propertyType === "sale") return post.listing_type === "FOR_SALE";
    if (propertyType === "rent") return post.listing_type === "FOR_RENT";
    if (propertyType === "stays") return post.listing_type === "STAY";
    return true;
  });

      function getListingBadgeText(
      listingType?: "FOR_SALE" | "FOR_RENT" | "STAY",
    ) {
      switch (listingType) {
        case "FOR_SALE":
          return "FOR SALE";
        case "FOR_RENT":
          return "FOR RENT";
        case "STAY":
          return "SHORT-TERM STAY";
        default:
          return "FOR YOU";
      }
    }


  const videoPosts = filteredByType.filter(
    (p) => typeof p.video === "string" && p.video.trim() !== "",
  );

  const filteredWatchPosts = 
  selectedFilters.length === 0
    ? videoPosts
    : videoPosts.filter((p) =>
        p.homeStyle?.some((s) => selectedFilters.includes(s)) ||
        selectedFilters.includes("for sale") && p.listing_type === "FOR_SALE" ||
        selectedFilters.includes("for rent") && p.listing_type === "FOR_RENT" ||
        selectedFilters.includes("stays") && p.listing_type === "STAY"
      );


  const filteredPosts = filteredByType.filter((post) => {
    const search = searchQuery.toLowerCase();
    const name = `${post.user?.first_name ?? ""} ${
      post.user?.last_name ?? ""
    }`.toLowerCase();

    const price = Number(post.price ?? 0);

    return (
      (!search ||
        post.title?.toLowerCase().includes(search) ||
        post.city?.toLowerCase().includes(search) ||
        name.includes(search)) &&
      price >= priceRange[0] &&
      price <= priceRange[1] &&
      (!selectedCity ||
        post.city?.toLowerCase() === selectedCity.toLowerCase()) &&
      (!zipCode || post.zipCode === zipCode)
    );
  });

  const handleUnauthenticatedAction = (action: string) => {
    toast.error(`Please login to ${action}`);
    setTimeout(() => router.push("/login"), 1500);
  };

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load posts.</p>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9F6F1]">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex justify-between">
        <h1 className="text-2xl font-bold text-[#6F8375]">CAHSAI</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button onClick={() => router.push("/landing-page")}>Signup</Button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto">
        {/* Toggle */}
        <div className="flex justify-center my-4">
          <ButtonGroup
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        </div>

        {/* TYPE FILTER */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-lg border">
            {(["sale", "rent", "stays"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPropertyType(type)}
                className={cn(
                  "px-5 py-2 rounded-md text-sm",
                  propertyType === type
                    ? "bg-[#6F8375] text-white"
                    : "text-gray-700",
                )}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* WATCH */}
        {activeButton === "watch" && (
          <div className="grid gap-6 max-w-lg mx-auto px-3">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filteredWatchPosts.map((post) => (
                <PropertyCard
                postId={post.id}
                  key={post.id}
                  id={post.user?.id ?? post.id}
                  variant={
                    post.user?.role === "agent"
                      ? "Cahsai Agent"
                      : "Cahsai Creator"
                  }
                  imageUrl={post.images?.[0] || "/images/Rectangle.png"}
                  video={post.video ?? ""}
                  name={`${post.user?.first_name ?? ""} ${
                    post.user?.last_name ?? ""
                  }`}
                  first_name={post.user?.first_name}
                  last_name={post.user?.last_name}
                  profile={post.user?.avatarUrl}
                  title={post.title}
                  location={`${post.city}, ${post.location}`}
                  beds={post.bedrooms ?? 0}
                  baths={post.bathrooms ?? 0}
                  area="1200"
                  likes={post.likeCount ?? 0}
                  comments={post.commentCount ?? 0}
                  shares={post.shareCount ?? 0}
                  listing_type={post.listing_type}
                  monthly_rent={post.monthly_rent}
                  amenities={post.amenities}
                  pet_policy={post.pet_policy}
                  parking={post.parking}
                  furnished={post.furnished}
                  onToggleSave={() =>
                    handleUnauthenticatedAction("like posts")
                  }
                  // onOpenComments={() =>
                  //   handleUnauthenticatedAction("comment")
                  // }
                  onBookTour={() =>
                    handleUnauthenticatedAction("book a tour")
                  }
                />
              ))
            )}
          </div>
        )}

        {/* SEARCH */}
        {activeButton === "search" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            {filteredPosts.map((post) => (
              <DetailedListingCard
                key={post.id}
                id={post.id}
                images={post.images ?? []} 
                video={post.video ?? ""}
                title={post.title}
                price={post.price}
                tags={post.tags ?? []}
                agentName={`${post.user?.first_name ?? ""} ${
                  post.user?.last_name ?? ""
                }`}
                agentAvatarUrl={post.user?.avatarUrl}
                bedrooms={String(post.bedrooms ?? 0)}
                bathrooms={String(post.bathrooms ?? 0)}
                area="2000"
                location={`${post.city}, ${post.location}`}
                description={post.description}
                topBadgeText={
                  post.isPromoted
                    ? "PROMOTED"
                    : getListingBadgeText(post.listing_type)
                }

                listing_type={post.listing_type}
                monthly_rent={post.monthly_rent}
                amenities={post.amenities}
                onBookTour={() =>
                  handleUnauthenticatedAction("book a tour")
                }
                onToggleSave={() =>
                  handleUnauthenticatedAction("save posts")
                }
                isLike={false}
              />
            ))}
          </div>
        )}
      </div>

      <FeedFilter
        open={showFilter}
        onOpenChange={setShowFilter}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <ListingFeedFilter
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        quickFilters={quickFilters}
        setQuickFilters={setQuickFilters}
        moreFilters={moreFilters}
        setMoreFilters={setMoreFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sqftRange={sqftRange}
        setSqftRange={setSqftRange}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        zipCode={zipCode}
        setZipCode={setZipCode}
      />
    </div>
  );
}
