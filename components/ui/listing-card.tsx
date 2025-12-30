import { FC } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface ListingCardProps {
  imageUrl: string;
  price: string;
  isPromoted?: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  details: string;
  bedrooms: string;   
  bathrooms: string;  
  area: string;       
  location: string;
}

const ListingCard: FC<ListingCardProps> = ({
  imageUrl,
  price,
  isPromoted,
  rating,
  reviews,
  tags,
  details,
  location,
}) => {
  return (
    
<div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
  {/* Image */}
  <div className="relative">
    <Image
  src={imageUrl}
  alt="Property"
  width={500}
  height={300}
  className="w-full h-[140px] object-cover"
/>
  </div>

  {/* Content */}
  <div className="p-3 space-y-2">
    {/* Price + Promoted */}
     <div className="flex items-center justify-between">
      <span className="text-[17px] font-semibold">{price}</span>
      {isPromoted && (
        <span className="bg-green-100 text-green-700 text-[11px] font-medium px-2 py-[2px] rounded-md">
          Promoted
        </span>
      )}
    </div>

    {/* Rating */}
    <div className="flex items-center text-[13px] text-gray-700">
      <span className="mr-[2px]">⭐</span>
      {rating}
      <span className="ml-1 text-gray-500">({reviews} reviews)</span>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-gray-100 text-gray-700 text-[11px] px-2 py-[2px] rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Details */}
    <p className="text-[13px] text-gray-700">{details}</p>

    {/* Location */}
    <div className="flex items-center text-[13px] text-gray-500">
      <MapPin size={13} className="mr-1" />
      {location}
    </div>
  </div>
</div>

  );
};

export default ListingCard;
