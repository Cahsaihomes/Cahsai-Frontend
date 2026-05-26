"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPosts, getFeedPosts } from "@/hooks/post-service";
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
import { IAProduct, useAffiliateProducts } from "@/hooks/useAffilateProduct";
import AffilateProduct from "./Cards/affilateProduct";
import { isDisabledCloudinaryUrl } from "@/lib/cloudinary-video";




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
  const watchLoadMoreRef = useRef<HTMLDivElement | null>(null);


  const { data: affilateProduct, isLoading: isAffLoading, error } = useAffiliateProducts("laptop");


  const { data: posts = [], isLoading: isAllPostsLoading, isError } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: activeButton === "search",
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: feedPages,
    isLoading: isFeedLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError: isFeedError,
    refetch: refetchFeed,
  } = useInfiniteQuery({
    queryKey: ["posts-feed-public", propertyType],
    queryFn: ({ pageParam }) =>
      getFeedPosts({
        type: propertyType,
        cursor: pageParam as string | null,
        limit: 10,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: activeButton === "watch",
  });

  useEffect(() => {
    const node = watchLoadMoreRef.current;
    if (!node || activeButton !== "watch") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeButton, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const filteredByType = posts.filter((post) => {
    if (!post.listing_type) return true;
    if (propertyType === "sale") return post.listing_type === "FOR_SALE";
    if (propertyType === "rent") return post.listing_type === "FOR_RENT";
    if (propertyType === "stays") return post.listing_type === "STAY";
    return true;
  });

  function getListingBadgeText(
    listingType?: "FOR_SALE" | "FOR_RENT" | "STAY",
    discoveryStay?: boolean | string,
  ) {
    switch (listingType) {
      case "FOR_SALE":
        return "FOR SALE";
      case "FOR_RENT":
        return "FOR RENT";
      case "STAY":
        // Handle both boolean and string values from backend
        const isDiscoveryStay = discoveryStay === true || discoveryStay === "true";
        return isDiscoveryStay ? "DISCOVERY STAY" : "SHORT-TERM STAY";
      default:
        return "FOR YOU";
    }
  }


  const watchPosts = feedPages?.pages.flatMap((page) => page.data) ?? [];
  const videoPosts = watchPosts.filter(
    (p) =>
      typeof p.video === "string" &&
      p.video.trim() !== "" &&
      !isDisabledCloudinaryUrl(p.video),
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
    const name = `${post.user?.first_name ?? ""} ${post.user?.last_name ?? ""
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
    <div className="h-screen flex flex-col bg-white">
      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur-2xl shadow-sm px-4 py-3 flex justify-between items-center">
        <Image
          src="/images/cahsai-logo1.png"
          alt="Cahsai Logo"
          width={100}
          height={50}
          className="h-7 w-auto"
        />
        <div className="flex gap-2">
          <Button className="bg-[#968470] hover:bg-[#968470]" onClick={() => router.push("/login")}>Login</Button>
          <Button className="bg-[#968470] hover:bg-[#968470]" onClick={() => router.push("/landing-page")}>Signup</Button>
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
                    ? "bg-[#968470] text-white"
                    : "text-gray-700",
                )}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* AFFILIATE PRODUCTS */}
        { activeButton === "search" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-4 gap-4 col-span-2">
          {isAffLoading ? (
            <p className="flex justify-center mx-auto w-full">Loading affiliate products...</p>
          ) : ((
            affilateProduct?.map((product: IAProduct) => (
              <AffilateProduct
                key={product._id}
                linkurl={product.linkurl}
                productName={product.productname}
                productPrice={product.price.amount}
                Imageurl={product.imageurl}
                merchantName={product.merchantname}
                productCurrency={product.price.currency}
                keywords={product.keywords}
              />
            ))
          ))}
        </div>
        )}

        {/* WATCH */}
        {activeButton === "watch" && (
          <div className="grid gap-6 max-w-lg mx-auto px-3">
            {isFeedLoading ? (
              <p>Loading...</p>
            ) : isFeedError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <p className="text-sm text-red-500">Failed to load posts.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => refetchFeed()}
                  className="border-[#968470] text-[#968470] hover:bg-[#968470] hover:text-white"
                >
                  Retry
                </Button>
              </div>
            ) : filteredWatchPosts.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No posts found</p>
            ) : (
              <>
                {filteredWatchPosts.map((post) => (
                  <PropertyCard
                    key={post.id}
                    id={post.user?.id ?? post.id}
                    postId={post.id}
                    variant={
                      post.user?.role === "agent"
                        ? "Cahsai Agent"
                        : "Cahsai Creator"
                    }
                    imageUrl={post.images?.[0] || "/images/Rectangle.png"}
                    video={post.video ?? ""}
                    name={`${post.user?.first_name ?? ""} ${post.user?.last_name ?? ""
                      }`}
                    first_name={post.user?.first_name}
                    last_name={post.user?.last_name}
                    profile={post.user?.avatarUrl}
                    title={post.title}
                    location={`${post.city}, ${post.location}`}
                    beds={post.bedrooms ?? 0}
                    baths={post.bathrooms ?? 0}
                    area=""
                    likes={post.likeCount ?? 0}
                    comments={post.commentCount ?? 0}
                    shares={post.shareCount ?? 0}
                    listing_type={post.listing_type}
                    monthly_rent={post.monthly_rent}
                    amenities={post.amenities}
                    pet_policy={post.pet_policy}
                    parking={post.parking}
                    furnished={post.furnished}
                    productLink={post.productLink}
                    topBadgeText={
                      post.isPromoted
                        ? "PROMOTED"
                        : getListingBadgeText(post.listing_type, post.discoveryStay)
                    }
                    buttonColor="#968470"
                    onToggleSave={() =>
                      handleUnauthenticatedAction("like posts")
                    }
                    onBookTour={() =>
                      handleUnauthenticatedAction("book a tour")
                    }
                  />
                ))}
                <div ref={watchLoadMoreRef} className="h-8" />
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 border-4 border-[#968470] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SEARCH */}
        {activeButton === "search" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">No posts found</div>
            ) : (
              filteredPosts.map((post) => (
                <DetailedListingCard
                key={post.id}
                id={post.id}
                images={post.images ?? []}
                video={post.video ?? ""}
                title={post.title}
                price={post.price}
                tags={post.tags ?? []}
                agentName={`${post.user?.first_name ?? ""} ${post.user?.last_name ?? ""
                  }`}
                agentAvatarUrl={post.user?.avatarUrl}
                bedrooms={String(post.bedrooms ?? 0)}
                bathrooms={String(post.bathrooms ?? 0)}
                area=""
                location={`${post.city}, ${post.location}`}
                description={post.description}
                topBadgeText={
                  post.isPromoted
                    ? "PROMOTED"
                    : getListingBadgeText(post.listing_type, post.discoveryStay)
                }
                listing_type={post.listing_type}
                monthly_rent={post.monthly_rent}
                amenities={post.amenities}
                buttonColor="#968470"
                onBookTour={() =>
                  handleUnauthenticatedAction("book a tour")
                }
                onToggleSave={() =>
                  handleUnauthenticatedAction("save posts")
                }
                isLike={false}
                />
              ))
            )}
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
