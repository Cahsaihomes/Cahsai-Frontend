"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import OptimizedVideoPlayer from "./OptimizedVideoPlayer";
import { useCloudinaryVideo } from "@/hooks/useCloudinaryVideo";

interface VideoModalProps {
  videoUrl: string;
  trigger?: React.ReactNode;
}

export default function VideoModal({ videoUrl, trigger }: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const { posterUrl } = useCloudinaryVideo(videoUrl);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ? (
          trigger
        ) : (
          <OptimizedVideoPlayer
            src={videoUrl}
            poster={posterUrl}
            className="h-60 w-full object-cover rounded-lg"
            muted
          />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black">
          <OptimizedVideoPlayer
            src={videoUrl}
            poster={posterUrl}
            controls
            autoPlay
            className="w-full h-[80vh] object-contain bg-black"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
