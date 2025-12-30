"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface VideoModalProps {
  videoUrl: string;
  trigger?: React.ReactNode;
}

export default function VideoModal({ videoUrl, trigger }: VideoModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ? (
          trigger
        ) : (
          <video
            src={videoUrl}
            className="h-60 w-full object-cover rounded-lg"
            muted
            loop
            playsInline
          />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-[80vh] object-contain bg-black"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
