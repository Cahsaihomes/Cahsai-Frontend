"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2 } from "lucide-react";
import { FilterChip } from "@/components/ui/filterchip";
// import ListingFeedFilter from "@/components/ui/listing-feed-filter";
// import FeedFilter from "@/components/ui/feed-filter";

interface SearchInputWithTagsProps {
  pageType: "home" | "listing";
}

export default function SearchInputWithTags({
  pageType,
}: SearchInputWithTagsProps) {
  const [recentSearches, setRecentSearches] = useState([
    { label: "#Bedrooms", isSelected: false },
    { label: "#Bathrooms", isSelected: false },
    { label: "#House", isSelected: false },
    { label: "#Kitchen", isSelected: false },
    { label: "#Garage", isSelected: false },
  ]);
  const [isListingFeedFilterOpen, setIsListingFeedFilterOpen] = useState(false);
  const [isFeedFilterOpen, setIsFeedFilterOpen] = useState(false);

  const handleChipClick = (index: number) => {
    setRecentSearches((prev) =>
      prev.map((chip, i) =>
        i === index ? { ...chip, isSelected: !chip.isSelected } : chip
      )
    );
  };

  const handleFilterIconClick = () => {
    if (pageType === "home") {
      setIsFeedFilterOpen(true);
    } else if (pageType === "listing") {
      setIsListingFeedFilterOpen(true);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search"
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-12 focus:border-[#6F8375] focus:ring-[#6F8375]"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 rounded-full"
          onClick={handleFilterIconClick}
        >
          <Settings2 className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700">Recent Search</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {recentSearches.map((chip, index) => (
            <FilterChip
              key={chip.label}
              label={chip.label}
              isSelected={chip.isSelected}
              onClick={() => handleChipClick(index)}
            />
          ))}
        </div>
      </div>

      {/* Conditional Dialogs */}
      {/* <ListingFeedFilter
        open={isListingFeedFilterOpen}
        onOpenChange={setIsListingFeedFilterOpen}
        quickFilters={[]}
        setQuickFilters={() => {}}
        moreFilters={[]}
        setMoreFilters={() => {}}
        priceRange={[0, 1000000]}
        setPriceRange={() => {}}
        sqftRange={[0, 10000]}
        setSqftRange={() => {}}
        selectedCity=""
        setSelectedCity={() => {}}
        zipCode=""
        setZipCode={() => {}}
      />

      <FeedFilter
        open={isFeedFilterOpen}
        onOpenChange={setIsFeedFilterOpen}
        selectedFilters={[]} 
        setSelectedFilters={() => {}}
      /> */}
    </div>
  );
}
