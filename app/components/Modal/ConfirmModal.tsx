"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  disableCloseOnOutsideClick?: boolean;
};

export default function ConfirmModal({
  open,
  onOpenChange,
  title = "Log out?",
  description = "Are you sure you want to log out of your account?",
  cancelLabel = "Cancel",
  confirmLabel = "Remove",
  onCancel,
  onConfirm,
  loading = false,
  disableCloseOnOutsideClick = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // className="w-full max-w-[391px] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[391px] p-6 rounded-[12px]"
        className="
    w-[95vw] sm:w-[90vw] md:w-[400px] lg:w-[400px]
    h-auto rounded-[12px] px-4 sm:px-6 py-6 sm:py-8
  "
        onPointerDownOutside={(e) => {
          if (disableCloseOnOutsideClick) e.preventDefault();
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-inter font-medium text-[24px] leading-[32px] text-[#101828]">
            {title}
          </DialogTitle>
          <DialogDescription className="font-inter font-normal text-[16px] leading-[24px] text-[#667085]">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Footer */}
        <div className="mt-8 flex justify-between gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="flex-1 h-[48px] rounded-[6px] border border-[#D5D7DA] font-inter font-semibold text-[16px] leading-[24px] text-[#717680]"
            onClick={() => {
              console.log("Cancel clicked");
              onCancel?.();
              onOpenChange(false);
            }}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            disabled={loading}
            className="flex-1 h-[48px] rounded-[6px] bg-[#D92D20] font-inter font-semibold text-[16px] leading-[24px] text-white hover:bg-[#d63c3c]"
            onClick={() => {
              console.log("Remove clicked");
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
