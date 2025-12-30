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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Dispatch, SetStateAction } from "react";

import { FilterChip } from "@/components/ui/filterchip";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

type ListingFeedFilterProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  quickFilters: string[];
  setQuickFilters: Dispatch<SetStateAction<string[]>>;
  moreFilters: string[];
  setMoreFilters: Dispatch<SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  sqftRange: [number, number];
  setSqftRange: Dispatch<SetStateAction<[number, number]>>;
  selectedCity: string;
  setSelectedCity: Dispatch<SetStateAction<string>>;
  zipCode: string;
  setZipCode: Dispatch<SetStateAction<string>>;
};

export default function ListingFeedFilter({
  open,
  onOpenChange,
  quickFilters,
  setQuickFilters,
  moreFilters,
  setMoreFilters,
  priceRange,
  setPriceRange,
  sqftRange,
  setSqftRange,
  selectedCity,
  setSelectedCity,
  zipCode,
  setZipCode,
}: ListingFeedFilterProps) {
  const quickFilterOptions = [
    "Homes with Big Backyards",
    "Modern Homes",
    "Pet-Friendly",
    "Lofts in the City",
    "Pet-Friendly Homes",
    "Going Fast in Atlanta",
    "Modern Farmhouses",
    "Spa Bathrooms",
  ];

  const moreFilterOptions = [
    "Modern",
    "Cozy",
    "Walkable",
    "Open Kitchen",
    "Entertainer's Dream",
    "Pet-friendly",
    "Great for Kids",
    "Good Schools",
    "Weekend Retreat",
    "One-Story Only",
    "With Basement",
    "Home Office Ready",
    "For Sale",
    "Coming Soon",
    "Under $Xk",
    "Move-in Ready",
  ];
  const [tempQuickFilters, setTempQuickFilters] =
    useState<string[]>(quickFilters);
  const [tempMoreFilters, setTempMoreFilters] = useState<string[]>(moreFilters);
  const [tempPriceRange, setTempPriceRange] =
    useState<[number, number]>(priceRange);
  const [tempSqftRange, setTempSqftRange] =
    useState<[number, number]>(sqftRange);
  const [tempCity, setTempCity] = useState<string>(selectedCity);
  const [tempZip, setTempZip] = useState<string>(zipCode);

  // Reset local state when dialog opens
  useEffect(() => {
    if (open) {
      setTempQuickFilters(quickFilters);
      setTempMoreFilters(moreFilters);
      setTempPriceRange(priceRange);
      setTempSqftRange(sqftRange);
      setTempCity(selectedCity);
      setTempZip(zipCode);
    }
  }, [
    open,
    quickFilters,
    moreFilters,
    priceRange,
    sqftRange,
    selectedCity,
    zipCode,
  ]);
  const handleQuickFilterClick = (label: string) => {
    setQuickFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleMoreFilterClick = (label: string) => {
    setMoreFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };
  const handleApply = () => {
    setQuickFilters(tempQuickFilters);
    setMoreFilters(tempMoreFilters);
    setPriceRange(tempPriceRange);
    setSqftRange(tempSqftRange);
    setSelectedCity(tempCity);
    setZipCode(tempZip);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] md:w-[600px] lg:w-[600px] px-4 sm:px-6 py-6 sm:py-8 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-gray-200">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Personalize My Search
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-wrap gap-2">
            {quickFilterOptions.map((label) => (
              <FilterChip
                key={label}
                label={label}
                isSelected={tempQuickFilters.includes(label)}
                onClick={() => {
                  setTempQuickFilters((prev) =>
                    prev.includes(label)
                      ? prev.filter((item) => item !== label)
                      : [...prev, label]
                  );
                }}
              />
            ))}
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              More Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {moreFilterOptions.map((label) => (
                <FilterChip
                  key={label}
                  label={label}
                  isSelected={tempMoreFilters.includes(label)}
                  onClick={() => {
                    setTempMoreFilters((prev) =>
                      prev.includes(label)
                        ? prev.filter((item) => item !== label)
                        : [...prev, label]
                    );
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="zip"
                className="text-sm font-medium text-gray-700"
              >
                Zip
              </Label>
              <Input
                id="zip"
                value={tempZip}
                onChange={(e) => setTempZip(e.target.value)}
                placeholder="Zip code"
                className="mt-1 rounded-md border border-gray-300 focus:border-[#6F8375] focus:ring-[#6F8375"
              />
            </div>
            <div>
              <Label
                htmlFor="city"
                className="text-sm font-medium text-gray-700"
              >
                City
              </Label>
              <Select value={tempCity} onValueChange={setTempCity}>
                <SelectTrigger
                  id="city"
                  className="mt-1 rounded-md  border-gray-300 focus:border-[#6F8375] focus:ring-[#6F8375"
                >
                  <SelectValue placeholder="City name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atlanta">Atlanta</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label
              htmlFor="price-range"
              className="text-sm font-medium text-gray-700"
            >
              Price range
            </Label>
            <RangeSlider
              id="price-range"
              min={0}
              max={1000000}
              step={100}
              value={tempPriceRange}
              onInput={(val: number[]) =>
                setTempPriceRange(val as [number, number])
              }
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* SQFT */}
          <div>
            <Label
              htmlFor="sqft-range"
              className="text-sm font-medium text-gray-700"
            >
              SQFT
            </Label>
            <RangeSlider
              id="sqft-range"
              min={0}
              max={5000}
              step={100}
              value={tempSqftRange}
              onInput={(val: number[]) =>
                setTempSqftRange(val as [number, number])
              }
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>{sqftRange[0].toLocaleString()}</span>
              <span>{sqftRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t border-gray-200">
          <Button
            type="button"
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
