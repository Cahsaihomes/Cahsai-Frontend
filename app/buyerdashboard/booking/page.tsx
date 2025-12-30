"use client";

import React, { useEffect } from "react";
import BookingCard from "@/components/ui/booking";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import RatingForm from "@/components/ui/rating-form";
import DetailedBookingCard from "@/components/ui/detailed-booking";
import { RootState } from "@/app/redux";
import { useSelector } from "react-redux";
import { useBuyerAllTours, useBuyerSavedTours } from "@/hooks/useHooks";
import { Lead } from "@/app/Utils/tourTypes";
import { savedTour, unsavedTour } from "@/app/services/get.my-posts.service";
import { toast } from "sonner";

export default function TourBookedPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [localSaved, setLocalSaved] = useState<{ [key: number]: boolean }>({});

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: tours, isLoading, refetch } = useBuyerAllTours(user?.id);
  const { data: savedTours, refetch: savedRefetch } = useBuyerSavedTours();
  const toursArray = Array.isArray(tours?.data) ? tours.data : [];
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleShowDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  const handleShowRatingModal = (postId: number) => {
    setSelectedPostId(postId);
    setShowRatingModal(true);
  };

  const handleToggleSave = async (tourId: number, isSaved: boolean) => {
    setLocalSaved((prev) => ({
      ...prev,
      [tourId]: !isSaved,
    }));

    try {
      if (isSaved) {
        await unsavedTour({ tourId });
        toast.success("Tour Unsaved Successfully!");
      } else {
        await savedTour({ tourId });
        toast.success("Tour Saved Successfully!");
      }
      await Promise.all([refetch(), savedRefetch()]);
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      setLocalSaved((prev) => ({
        ...prev,
        [tourId]: isSaved,
      }));
    }
  };

  return (
    <>
      <div className="border bg-white shadow-sm border-[#D5D7DA] rounded-[12px]">
        {/* Header */}
        <header className="items-left px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-800 mt-4">
            Tour Booked
          </h1>
        </header>

        {/* Main Content Grid */}
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Loader */}
            {isLoading ? (
              <div className="flex justify-center items-center h-40 col-span-full">
                <div className="w-10 h-10 border-4 border-[#6C806F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tours?.length === 0 || toursArray?.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full py-10">
                No booked tours found!
              </p>
            ) : (
              toursArray?.map((data: Lead, index: number) => {
                const isSaved =
                  localSaved[data.id] !== undefined
                    ? localSaved[data.id]
                    : savedTours?.data?.some(
                        (sp: any) => sp.tourId === data?.id,
                      ) || false;

                return (
                  <BookingCard
                    key={data?.id}
                    onDetailClick={() => handleShowDetail(data)}
                    onRatingClick={handleShowRatingModal}
                    data={data}
                    onToggleSave={() => handleToggleSave(data.id, isSaved)}
                    isSaved={isSaved}
                  />
                );
              })
            )}
          </div>
        </main>

        {/* Detailed Booking Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
          }}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="max-h-[90vh]">
              <DetailedBookingCard
                data={selectedLead}
                onClose={() => {
                  setShowDetailModal(false);
                }}
                refetch={refetch}
                isSaved={
                  localSaved[selectedLead?.postId || 0] !== undefined
                    ? localSaved[selectedLead?.postId || 0]
                    : savedTours?.data?.some(
                        (sp: any) => sp.tourId === selectedLead?.id,
                      ) || false
                }
                onToggleSave={() =>
                  handleToggleSave(
                    selectedLead!.id,
                    localSaved[selectedLead!.id] !== undefined
                      ? localSaved[selectedLead!.id]
                      : savedTours?.data?.some(
                          (sp: any) => sp.tourId === selectedLead?.id,
                        ) || false,
                  )
                }
              />
            </div>
          </div>
        </Modal>
      </div>

      <RatingForm
        postId={selectedPostId}
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        refetch={refetch}
      />
    </>
  );
}
