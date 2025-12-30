"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/hooks/post-service";
import { Post } from "@/app/Utils/post-types";

import ButtonGroup from "@/components/ui/button-group";
import PropertyCard from "@/components/ui/property-card";
import { SignupDialog } from "@/components/ui/signup-dialog";
import { RequestTourDialog } from "@/components/ui/request-tour-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ListingPanel from "@/components/ui/listingpanel";
import DetailedListingCard from "@/components/ui/detailed-listing-card";
import FeedFilter from "@/components/ui/feed-filter";
import ListingFeedFilter from "@/components/ui/listing-feed-filter";
import { dislikePost, likePost } from "@/app/services/get.my-posts.service";
import { toast } from "sonner";
import { useBuyerLikes } from "@/hooks/useHooks";

interface SelectedPost {
  id: number;
  userId: number;
  title: string;
  location: string;
  city: string;
  image: string;
  profile_pic?: string;
  first_name: string;
  last_name: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
}

export default function Home() {
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isPreferHomesOpen, setIsPreferHomesOpen] = useState(false);
  const [isRequestTourDialogOpen, setIsRequestTourDialogOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<"watch" | "search">("watch");
  const [showFilter, setShowFilter] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isListingCardOpen, setIsListingCardOpen] = useState(false);
  const [isPropertyFilterOpen, setIsPropertyFilterOpen] = useState(false);

  // Property Type Filter State
  const [propertyType, setPropertyType] = useState<"sale" | "rent" | "stays">(
    "sale",
  );

  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Search filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBadgeFilters, setActiveBadgeFilters] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [moreFilters, setMoreFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([0, 5000]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [localSaved, setLocalSaved] = useState<{ [key: number]: boolean }>({});
  const { data: buyerLikes, refetch: likeRefetch } = useBuyerLikes();

  // Get current user ID from your auth context/store
  // Replace this with your actual auth implementation
  const currentUserId = 1; // Example: get from useAuth() or similar

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  // Filter posts by property type first
  const postsByPropertyType = posts?.filter((post) => {
    if (!post.listing_type) {
      return propertyType === "sale";
    }

    if (propertyType === "sale") {
      return post.listing_type === "FOR_SALE";
    } else if (propertyType === "rent") {
      return post.listing_type === "FOR_RENT";
    } else if (propertyType === "stays") {
      return post.listing_type === "STAY";
    }
    return false;
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

  const videoPosts = postsByPropertyType?.filter(
    (post) =>
      post.video && typeof post.video === "string" && post.video.trim() !== "",
  );

  const filteredWatchPosts =
    selectedFilters.length > 0
      ? videoPosts?.filter((post) =>
          post.homeStyle?.some((style: string) =>
            selectedFilters.includes(style),
          ),
        )
      : videoPosts;

  const filteredPosts =
    postsByPropertyType?.filter((post: any) => {
      const fullName =
        `${post.user.first_name} ${post.user.last_name}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        post.title?.toLowerCase().includes(searchLower) ||
        post.price?.toString().toLowerCase().includes(searchLower) ||
        post.zipCode?.toLowerCase().includes(searchLower) ||
        post.city?.toLowerCase().includes(searchLower) ||
        post.location?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.bedrooms?.toString().includes(searchLower) ||
        post.bathrooms?.toString().includes(searchLower) ||
        fullName.includes(searchLower) ||
        post.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower),
        ) ||
        post.homeStyle?.some((style: string) =>
          style.toLowerCase().includes(searchLower),
        ) ||
        post.amenities?.some((amenity: string) =>
          amenity.toLowerCase().includes(searchLower),
        );

      const matchesQuick =
        quickFilters.length === 0 ||
        quickFilters.some(
          (filter) =>
            post.homeStyle?.includes(filter) || post.tags?.includes(filter),
        );

      const matchesMore =
        moreFilters.length === 0 ||
        moreFilters.some(
          (filter) =>
            post.tags?.includes(filter) || post.amenities?.includes(filter),
        );

      const matchesBadges =
        searchQuery === "Pet-Friendly"
          ? post.tags?.includes("Pet-Friendly")
          : searchQuery === "Modern Homes"
            ? post.tags?.includes("Modern Homes")
            : searchQuery === "Budget Rooms"
              ? post.tags?.includes("Budget Rooms")
              : true;

      const price = parseFloat(post.price || "0");
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      const sqft = 0;
      const matchesSqft = sqft >= sqftRange[0] && sqft <= sqftRange[1];

      const matchesCity =
        !selectedCity ||
        post.city?.toLowerCase() === selectedCity.toLowerCase();

      const matchesZip =
        !zipCode || post.zipCode?.toLowerCase() === zipCode.toLowerCase();

      const matchesBtnFilters =
        activeBadgeFilters.length === 0 ||
        activeBadgeFilters.some((badge) =>
          post.homeStyle?.some(
            (tag: string) => tag.toLowerCase() === badge.toLowerCase(),
          ),
        );

      return (
        matchesSearch &&
        matchesQuick &&
        matchesMore &&
        matchesBadges &&
        matchesPrice &&
        matchesSqft &&
        matchesCity &&
        matchesZip &&
        matchesBtnFilters
      );
    }) || [];

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load posts.</p>
    );
  }

  const handleToggleLikes = async (postId: number, isSaved: boolean) => {
    setLocalSaved((prev) => ({
      ...prev,
      [postId]: !isSaved,
    }));

    try {
      if (isSaved) {
        await dislikePost({ postId });
        toast.success("Post Dislike Successfully!");
      } else {
        await likePost({ postId });
        toast.success("Post Liked Successfully!");
      }
      await Promise.all([refetch(), likeRefetch()]);
    } catch (err) {
      console.error("like toggle failed:", err);
      setLocalSaved((prev) => ({
        ...prev,
        [postId]: isSaved,
      }));
    }
  };

  return (
    <div>
      <div
        className={cn(
          "bg-white border border-[#D5D7DA] rounded-[12px] shadow-lg p-0 md:p-2 lg:p-4 max-w-9xl w-full relative transition-all duration-300",
          { "filter blur-sm pointer-events-none": isPreferHomesOpen },
        )}
      >
        {/* Header Section */}
        <div className="flex items-center w-full mb-2 px-2 relative">
          {/* Left Button */}
          <div className="flex-shrink-0 z-10">
            {activeButton === "watch" ? (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilter(true)}
                className="hidden lg:flex h-9 w-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFilterOpen(true)}
                className="h-9 w-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Center Area */}
          <div className="flex-1 flex justify-center relative py-2 z-20">
            <div className="flex items-center gap-1 relative">
              {/* Watch / Search */}
              <div className="inline-flex rounded-lg border border-gray-300 bg-white">
                <button
                  onClick={() => setActiveButton("watch")}
                  className={cn(
                    "px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-l-lg transition-colors whitespace-nowrap",
                    activeButton === "watch"
                      ? "bg-[#6F8375] text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  Watch Homes
                </button>

                <button
                  onClick={() => setActiveButton("search")}
                  className={cn(
                    "px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                    activeButton === "search"
                      ? "bg-[#6F8375] text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  Search Homes
                </button>
              </div>

              {/* Dropdown */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPropertyFilterOpen(!isPropertyFilterOpen)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Toggle Property Type Filter"
              >
                <ChevronDown
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4 transition-transform",
                    isPropertyFilterOpen && "rotate-180"
                  )}
                />
              </Button>

              {/* Arrow */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsListingCardOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Prefer Homes"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Property Filter Panel */}
              {isPropertyFilterOpen && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50">
                  <div
                    className="
                      backdrop-blur-xl
                      bg-white/30
                      border border-white/40
                      rounded-2xl
                      shadow-2xl
                      px-4 py-3
                      animate-in
                      slide-in-from-top-4
                      fade-in
                      duration-300
                      w-max
                    "
                  >
                    <div className="inline-flex rounded-xl bg-white/60 backdrop-blur-md p-1 gap-1">
                      <button
                        onClick={() => {
                          setPropertyType("sale");
                          setIsPropertyFilterOpen(false);
                        }}
                        className={cn(
                          "px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all",
                          propertyType === "sale"
                            ? "bg-[#6F8375] text-white shadow"
                            : "text-gray-800 hover:bg-white/70",
                        )}
                      >
                        For Sale
                      </button>

                      <button
                        onClick={() => {
                          setPropertyType("rent");
                          setIsPropertyFilterOpen(false);
                        }}
                        className={cn(
                          "px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all",
                          propertyType === "rent"
                            ? "bg-[#6F8375] text-white shadow"
                            : "text-gray-800 hover:bg-white/70",
                        )}
                      >
                        For Rent
                      </button>

                      <button
                        onClick={() => {
                          setPropertyType("stays");
                          setIsPropertyFilterOpen(false);
                        }}
                        className={cn(
                          "px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all",
                          propertyType === "stays"
                            ? "bg-[#6F8375] text-white shadow"
                            : "text-gray-800 hover:bg-white/70",
                        )}
                      >
                        Stays
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-2 justify-center items-start">
          {/* Watch Feed → Property Cards */}
          {activeButton === "watch" && (
            <div className="px-3 py-2 w-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-[#6C806F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredWatchPosts && filteredWatchPosts.length === 0 ? (
                <p className="text-center text-gray-500 w-full">
                  No Record found!
                </p>
              ) : (
                <div className="mx-auto grid max-w-lg grid-cols-1 gap-6">
                  {filteredWatchPosts?.map((post) => {
                    const isSaved =
                      localSaved[post.id] !== undefined
                        ? localSaved[post.id]
                        : buyerLikes?.data?.some(
                            (sp: any) => sp.postId === post?.id,
                          ) || false;
                    return (
                      <PropertyCard
                        key={post.id}
                        id={post.user.id}
                        postId={post.id}
                        currentUserId={currentUserId}
                        postOwnerId={post.user.id}
                        variant={
                          post.user.role === "agent"
                            ? "Cahsai Agent"
                            : "Cahsai Creator"
                        }
                        imageUrl={post.images?.[0] || "/images/Rectangle.png"}
                        video={post?.video || ""}
                        name={`${post.user.first_name} ${post.user.last_name}`}
                        first_name={post.user.first_name}
                        last_name={post.user.last_name}
                        profile={post.user.avatarUrl}
                        title={post.title}
                        location={`${post.city}, ${post.location}`}
                        beds={post.bedrooms}
                        baths={post.bathrooms}
                        area="1200"
                        likes={post?.likeCount}
                        comments={post?.commentCount}
                        shares={post?.shareCount}
                        listing_type={post.listing_type}
                        topBadgeText={
                          post.isPromoted
                            ? "PROMOTED"
                            : getListingBadgeText(post.listing_type)
                        }
                        monthly_rent={post.monthly_rent}
                        amenities={post.amenities}
                        pet_policy={post.pet_policy}
                        parking={post.parking}
                        furnished={post.furnished}
                        onOpenFullStory={() => setIsSignupDialogOpen(true)}
                        onToggleSave={() => handleToggleLikes(post.id, isSaved)}
                        isLike={isSaved}
                        onBookTour={() => {
                          setSelectedPost({
                            id: post.id,
                            userId: post.user?.id,
                            title: post.title,
                            location: post.location,
                            city: post.city,
                            image: post.images?.[0] || "/images/Rectangle.png",
                            profile_pic: post.user.avatarUrl,
                            first_name: post.user.first_name,
                            last_name: post.user.last_name,
                            name: `${post.user.first_name} ${post.user.last_name}`,
                            bedrooms: post.bedrooms,
                            bathrooms: post.bathrooms,
                          });
                          setIsRequestTourDialogOpen(true);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Search Listings → Detailed Cards */}
          {activeButton === "search" && (
            <div className="max-w-7xl mx-auto px-4 w-full">
              {/* Search Row */}
              <div className="flex flex-wrap items-center lg:gap-3 gap-0 mb-6">
                <div className="flex flex-row gap-2 w-full lg:max-w-[300px]">
                  <Input
                    type="text"
                    placeholder="Search Feed"
                    className="flex-grow max-w-xs rounded-md border border-gray-300 px-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {["Pet-Friendly", "Modern Homes", "Budget Rooms"].map(
                  (badge) => (
                    <Badge
                      key={badge}
                      variant={
                        activeBadgeFilters.includes(badge)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer mt-2 lg:mt-0 bg-white border-gray-300 text-gray-800 hover:bg-[#6F8375] hover:text-white"
                      onClick={() => {
                        setActiveBadgeFilters((prev) =>
                          prev.includes(badge)
                            ? prev.filter((b) => b !== badge)
                            : [...prev, badge],
                        );
                      }}
                    >
                      {badge}
                    </Badge>
                  ),
                )}
              </div>

              {/* Cards Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-[#6C806F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredPosts && filteredPosts.length === 0 ? (
                <p className="text-center text-gray-500 w-full">
                  No Record found!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  {filteredPosts?.map((post) => {
                    const isSaved =
                      localSaved[post.id] !== undefined
                        ? localSaved[post.id]
                        : buyerLikes?.data?.some(
                            (sp: any) => sp.postId === post?.id,
                          ) || false;
                    return (
                      <DetailedListingCard
                        id={post.user.id}
                        key={post.id}
                        images={post.images}
                        video={post.video ?? undefined}
                        price={`$${post.price}`}
                        tags={post.tags}
                        agentName={`${post.user.first_name} ${post.user.last_name}`}
                        agentAvatarUrl={post.user.avatarUrl}
                        bedrooms={String(post.bedrooms)}
                        bathrooms={String(post.bathrooms)}
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
                        title={post.title}
                        onBookTour={() => {
                          setSelectedPost({
                            id: post.id,
                            userId: post.user?.id,
                            title: post.title,
                            location: post.location,
                            city: post.city,
                            image: post.images?.[0] || "/images/Rectangle.png",
                            profile_pic: post.user.avatarUrl,
                            first_name: post.user.first_name,
                            last_name: post.user.last_name,
                            name: `${post.user.first_name} ${post.user.last_name}`,
                            bedrooms: post.bedrooms,
                            bathrooms: post.bathrooms,
                          });
                          setIsRequestTourDialogOpen(true);
                        }}
                        onToggleSave={() => handleToggleLikes(post.id, isSaved)}
                        isLike={isSaved}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 mb-6">
          <Button
            variant="outline"
            className="bg-white border-2 border-[#6F8375] text-[#6F8375] hover:bg-[#6F8375] hover:text-white px-8 py-2 rounded-lg font-medium transition-colors"
          >
            Add to Dreamboard
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <SignupDialog
        isOpen={isSignupDialogOpen}
        setIsOpen={setIsSignupDialogOpen}
      />
      <ListingPanel
        isOpen={isListingCardOpen}
        onClose={() => setIsListingCardOpen(false)}
        post={posts}
        isLoading={isLoading}
      />
      <RequestTourDialog
        isOpen={isRequestTourDialogOpen}
        setIsOpen={setIsRequestTourDialogOpen}
        onClose={() => setIsRequestTourDialogOpen(false)}
        post={selectedPost}
      />
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