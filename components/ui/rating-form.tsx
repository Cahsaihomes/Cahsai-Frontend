"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { giveRating } from "@/app/services/get.my-posts.service";
import { QueryObserverResult } from "@tanstack/react-query";

interface RatingFormProps {
  postId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
}

export default function RatingForm({
  postId,
  open,
  onOpenChange,
  refetch,
}: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarClick = (index: number, isHalf: boolean) => {
    const newRating = isHalf ? index - 0.5 : index;
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (!postId) return;
    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }

    setLoading(true);
    try {
      const payload: { postId: number; rating: number; comment?: string } = {
        postId,
        rating,
      };
      if (reviewText.trim()) {
        payload.comment = reviewText;
      }

      await giveRating(payload);
      toast.success("Review submitted successfully!");
      refetch();
      setRating(0);
      setReviewText("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to submit review!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoverRating(0);
      setReviewText("");
      setLoading(false);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[90%] rounded-xl p-0 overflow-hidden">
        <Card className="border-0 shadow-none">
          {/* Header */}
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-base font-[500] font-inter text-[24px] text-[#333333] ">
              Rate Our Application
            </DialogTitle>
          </DialogHeader>

          {/* Main Content */}
          <CardContent className="px-4 flex flex-col gap-4 pb-0">
            {/* Star Rating */}
            <div className="flex flex-col gap-1">
              <label className="text-[16px] font-[500] font-inter text-[#414651]">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="relative flex items-center"
                    style={{ width: "24px" }}
                  >
                    {/* Half Left */}
                    <Star
                      className={`w-6 h-6 cursor-pointer transition-colors absolute left-0 top-0 ${
                        (hoverRating || rating) >= index - 0.5
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                      onClick={() => handleStarClick(index, true)}
                      onMouseEnter={() => setHoverRating(index - 0.5)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                    {/* Full Star */}
                    <Star
                      size={28}
                      className={`cursor-pointer transition-colors ${
                        (hoverRating || rating) >= index
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                      onClick={() => handleStarClick(index, false)}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Selected: {rating} ★</p>
            </div>

            {/* Review Textarea */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="review-text"
                className="text-[16px] font-[500] font-inter text-[#414651]"
              >
                Review (optional)
              </label>
              <Textarea
                id="review-text"
                placeholder="Write your review here"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[175px] resize-none placeholder:text-[#717680] text-[#717680] font-[400] font-inter text-[16px]"
              />
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="px-4 pt-7 pb-4">
            <Button
              type="button"
              className="w-full bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white text-base cursor-pointer"
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
            >
              {loading ? "Submitting..." : "Send Review"}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
