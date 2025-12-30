import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useState } from "react";
import { RequestTourDialog } from "@/components/ui/request-tour-dialog";

export default function PropertyCard({ post }: { post: any }) {
  const [openRequest, setOpenRequest] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        {post.isPromoted ? (
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded font-semibold">
            Promoted
          </span>
        ) : (
          <span className="invisible bg-green-100 text-green-700 text-xs px-3 py-1 rounded font-semibold">
            Promoted
          </span>
        )}
        <div className="flex gap-2">
          <button className="p-1">
            <Image src="/icons/heart.svg" alt="heart" width={24} height={24} />
          </button>
          <button className="p-1">
            <Image src="/icons/share.svg" alt="share" width={24} height={24} />
          </button>
        </div>
      </div>
      <div className="w-full h-40 rounded-xl overflow-hidden mb-2 relative">
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {/* Show all images */}
            {post.images && post.images.map((img: string, idx: number) => (
              <CarouselItem key={"img-"+idx} className="h-40">
                <Image
                  src={img}
                  alt={post.title || `Property image ${idx+1}`}
                  width={400}
                  height={160}
                  className="object-cover w-full h-full rounded-xl"
                />
              </CarouselItem>
            ))}
            {/* Show video if exists */}
            {post.video && (
              <CarouselItem key="video" className="h-40">
                <video
                  src={post.video}
                  controls
                  className="object-cover w-full h-full rounded-xl"
                  width={400}
                  height={160}
                  poster={post.images && post.images.length > 0 ? post.images[0] : "/images/house1.jpg"}
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex gap-2 mb-2">
        {post.tags && post.tags.length > 0 ? post.tags.map((tag: string, idx: number) => (
          <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">{tag}</span>
        )) : <span className="bg-gray-100 text-xs px-2 py-1 rounded">No Tags</span>}
      </div>
      <div className="text-2xl font-bold mb-1">${post.price || "-"}</div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full overflow-hidden">
          <Image 
            src={post.user?.avatarUrl || "/images/avatar.jpg"} 
            alt="Agent" 
            width={28} 
            height={28} 
            className="object-cover aspect-square w-full h-full rounded-full" 
          />
        </div>
        <span className="font-medium text-sm">{post.user ? `${post.user.first_name} ${post.user.last_name}` : "Agent"}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
        <span>{post.homeStyle && post.homeStyle.length > 0 ? post.homeStyle[0] : "-"}</span>
        <span>•</span>
        <span>{post.bedrooms ?? "-"}BR</span>
        <span>•</span>
        <span>{post.bathrooms ?? "-"}BA</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
        <Image src="/icons/location.svg" alt="Location" width={16} height={16} />
        <span>{post.location || post.city || "-"}</span>
      </div>
      <div className="text-gray-500 text-xs mb-2">{post.description || "No description provided."}</div>
      <button
        className="w-full py-2 rounded-lg bg-[#6F8375] text-white font-medium"
        onClick={() => setOpenRequest(true)}
      >
        Book a tour
      </button>
      <RequestTourDialog
        isOpen={openRequest}
        setIsOpen={setOpenRequest}
        onClose={() => setOpenRequest(false)}
        post={post}
      />
    </div>
  );
}
