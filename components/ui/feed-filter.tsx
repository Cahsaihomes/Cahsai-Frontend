"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FilterChip } from "@/components/ui/filterchip";

interface FeedFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FeedFilter({
  open,
  onOpenChange,
  selectedFilters,
  setSelectedFilters,
}: FeedFilterProps) {
  const filterOptions = [
    "Budget Rooms",
    // "Homes with Big Backyards",
    "Modern Homes",
    "Pet-Friendly",
    // "Lofts in the City",
    // "Pet-Friendly Homes",
    // "Going Fast in Atlanta",
    // "Modern Farmhouses",
    // "Spa Bathrooms",
  ];

  const [tempFilters, setTempFilters] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setTempFilters(selectedFilters);
    }
  }, [open, selectedFilters]);
  const handleApply = () => {
    setSelectedFilters(tempFilters);
    onOpenChange(false);
  };
  const handleChipClick = (label: string) => {
    setTempFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[400px] lg:w-[400px]
    h-auto px-4 sm:px-6 py-6 sm:py-8 rounded-lg shadow-lg"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-gray-200">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Filter
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((label) => (
              <FilterChip
                key={label}
                label={label}
                isSelected={tempFilters.includes(label)}
                onClick={() => handleChipClick(label)}
              />
            ))}
          </div>
        </div>
        <DialogFooter className="border-gray-200">
          <Button
            type="submit"
            className="w-full bg-[#6F8375] hover:bg-[#6F8375]/90 text-white py-2 rounded-md"
            onClick={handleApply}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
