"use client";

//import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import PropertyCard from "@/components/ui/listing-card";

interface PreferHomesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferHomesSidebar({
  isOpen,
  onClose,
}: PreferHomesSidebarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} 
    // //className="h-full w-full max-w-sm rounded-none border-l bg-white p-6 shadow-lg sm:max-w-md",
    //     style={{
    //       position: "fixed",
    //       top: 0,
    //       right: 0,
    //       bottom: 0,
    //       transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    //       transition: "transform 0.3s ease-in-out",
    //     }}
        >
      {/* FULL SCREEN WHITE BLUR OVERLAY */}

      {/* SIDEBAR PANEL */}
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Prefer for you
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-y-auto py-4">
          {/* Example Property Card */}
          <PropertyCard
            imageUrl="/images/Frame.png"
            price="$20,000"
            rating={4.5}
            reviews={156}
            tags={["Modern", "Family Home"]}
            bedrooms="3BR"
            bathrooms="2BA"
            area="1,800 sq ft"
            details="Beautiful family home with a garden and garage."
            location="DHA Phase 6, Karachi"
            isPromoted={true}
          />
          <PropertyCard
            imageUrl="/images/Frame.png"
            price="$18,500"
            rating={4.2}
            reviews={98}
            tags={["Cozy", "Apartment"]}
            bedrooms="2BR"
            bathrooms="1BA"
            area="1,000 sq ft"
            details="Beautiful family home with a garden and garage."
            location="Clifton, Karachi"
            isPromoted={false}
          />
          {/* Add more PropertyCards if needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
