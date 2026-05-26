"use client";

import { useEffect, useRef, useState } from "react";
import HLS from "hls.js";
import { Pause, Play } from "lucide-react";
import { isCloudinaryUrl } from "@/lib/cloudinary-video";

interface OptimizedVideoPlayerProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  className?: string;
  showLoadingIndicator?: boolean;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onBuffering?: () => void;
}

/**
 * Optimized Video Player Component
 * - Supports HLS streaming with adaptive bitrate
 * - Handles buffering gracefully
 * - Cleans up HLS/network work when unmounted from offscreen cards
 */
export default function OptimizedVideoPlayer({
  src,
  poster,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  preload = "metadata",
  className = "",
  showLoadingIndicator = true,
  onLoadStart,
  onCanPlay,
  onBuffering,
}: OptimizedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaybackIcon, setShowPlaybackIcon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hlsRef = useRef<HLS | null>(null);
  const playbackIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const objectFitClass = className.match(/\bobject-(cover|contain|fill|scale-down|none)\b/)?.[0] || "object-cover";
  const wrapperClassName = className.replace(/\bobject-(cover|contain|fill|scale-down|none)\b/g, "").trim();

  const flashPlaybackIcon = () => {
    setShowPlaybackIcon(true);
    if (playbackIconTimerRef.current) {
      clearTimeout(playbackIconTimerRef.current);
    }

    playbackIconTimerRef.current = setTimeout(() => {
      setShowPlaybackIcon(false);
    }, 700);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!src) {
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);
    setIsReady(false);
    onLoadStart?.();

    const handleCanPlay = () => {
      setIsReady(true);
      setIsLoading(false);
      onCanPlay?.();
    };

    const handleWaiting = () => {
      onBuffering?.();
    };

    const handleVideoError = () => {
      setError("Failed to load video");
      setIsReady(false);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      flashPlaybackIcon();
    };

    const handlePlaying = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowPlaybackIcon(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("error", handleVideoError);
    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);

    const playbackStateInterval = window.setInterval(() => {
      setIsPlaying(!video.paused && !video.ended);
    }, 400);

    try {
      let videoSrc = src;
      const isAlreadyStreamingUrl =
        src.includes(".m3u8") || src.includes("f_hls");

      if (isCloudinaryUrl(src) && !isAlreadyStreamingUrl) {
        videoSrc = src;
      }

      if (videoSrc.endsWith(".m3u8")) {
        if (HLS.isSupported()) {
          const hls = new HLS({
            enableWorker: true,
            lowLatencyMode: false,
            capLevelToPlayerSize: true,
            startFragPrefetch: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            startLevel: -1,
            fragLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 4000,
                maxLoadTimeMs: 20000,
                timeoutRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 1000,
                  maxRetryDelayMs: 8000,
                },
                errorRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 1000,
                  maxRetryDelayMs: 8000,
                },
              },
            },
          });

          hlsRef.current = hls;
          hls.loadSource(videoSrc);
          hls.attachMedia(video);

          hls.on(HLS.Events.MANIFEST_PARSED, () => {
            hls.currentLevel = -1;
          });

          hls.on(HLS.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              hls.destroy();
              hlsRef.current = null;
              setError(null);
              video.src = src;
              video.load();
              if (autoPlay) {
                video.play().catch(() => {
                  video.pause();
                });
              }
            }
          });

          hls.on(HLS.Events.BUFFER_APPENDING, () => {
            onBuffering?.();
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoSrc;
        } else {
          setError("HLS not supported. Please use a modern browser.");
          setIsLoading(false);
        }
      } else {
        video.src = videoSrc;
      }
    } catch (err) {
      console.error("Video initialization error:", err);
      setError("Failed to initialize video player");
      setIsLoading(false);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleVideoError);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
      window.clearInterval(playbackStateInterval);
      video.pause();
      video.removeAttribute("src");
      video.load();

      if (playbackIconTimerRef.current) {
        clearTimeout(playbackIconTimerRef.current);
        playbackIconTimerRef.current = null;
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onLoadStart, onCanPlay, onBuffering]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          video.pause();
        });
      }
    } else {
      video.pause();
    }
  }, [autoPlay, src]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        video.pause();
      });
    } else {
      video.pause();
    }
  };

  if (error) {
    return (
      <div className={`${className} bg-gray-900 flex items-center justify-center text-white`}>
        {poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full ${objectFitClass}`}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/35" />
        <p className="relative z-10 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full ${objectFitClass} transition-opacity duration-200 ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
          decoding="async"
        />
      )}
      <video
        ref={videoRef}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        poster={poster}
        className={`absolute inset-0 h-full w-full ${objectFitClass} transition-opacity duration-200 ${
          isReady || !poster ? "opacity-100" : "opacity-0"
        }`}
        preload={preload}
      />

      <button
        type="button"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={togglePlayback}
        className={`absolute left-1/2 top-1/2 z-50 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-opacity duration-200 ${
          showPlaybackIcon || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 fill-white" />
        ) : (
          <Play className="ml-1 h-8 w-8 fill-white" />
        )}
      </button>

      {showLoadingIndicator && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="animate-spin">
            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
