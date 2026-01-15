"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface ButtonGroupProps {
  activeButton: "watch" | "search";
  setActiveButton: Dispatch<SetStateAction<"watch" | "search">>;
}

export default function ButtonGroup({
  activeButton,
  setActiveButton,
}: ButtonGroupProps) {
  return (
    <div className="flex gap-2 p-4">
      <Button
        onClick={() => setActiveButton("watch")}
        className={cn(
          "rounded-lg px-6 py-3",
          activeButton === "watch"
            ? "bg-[#968470] text-white hover:bg-[#968470]/90"
            : "bg-transparent text-gray-800 border border-gray-200 hover:bg-gray-50"
        )}
      >
        Watch Homes
      </Button>
      <Button
        onClick={() => setActiveButton("search")}
        className={cn(
          "rounded-lg px-6 py-3",
          activeButton === "search"
            ? "bg-[#968470] text-white hover:bg-[#968470]/90"
            : "bg-transparent text-gray-800 border border-gray-200 hover:bg-gray-50"
        )}
      >
        Search Homes
      </Button>
    </div>
  );
}
