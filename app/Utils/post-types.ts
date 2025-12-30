export interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  role: "agent" | "creator" | "buyer";
  avatarUrl?: string;
  contact: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  price: string;
  city: string;
  location: string;
  zipCode: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  tags: string[];
  homeStyle: string[];
  amenities: string[];
  images: string[];
  video: string | null;
  forYou: boolean;
  isPromoted: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  ratingCount: number;
  reviewCount: number;

  // NEW RENTAL FIELDS
  listing_type?: "FOR_SALE" | "FOR_RENT" | "STAY";
  monthly_rent?: number;
  security_deposit?: number;
  lease_term?: string;
  available_from?: string;
  pet_policy?: string;
  parking?: string;
  furnished?: boolean;
  application_url?: string;
  manager_id?: number;
  is_verified_manager?: boolean;
}
