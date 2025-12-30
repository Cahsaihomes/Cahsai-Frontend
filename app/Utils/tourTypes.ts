export interface Lead {
  id: number;
  postId: number;
  buyerId: number;
  agentId: number;
  date: string;
  time: string;
  status: string;
  bookingStatus: string;
  activeLead: boolean;
  timerExpiresAt: string;
  createdAt: string;
  updatedAt: string;
  post: Post;
  buyer: User;
  agent: User;
}

interface Post {
  id: number;
  title: string;
  price: string;
  zipCode: string;
  city: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  tags: string[];
  homeStyle: string[];
  amenities: string[];
  images: string[] | null;
  video: string | null;
  forYou: boolean;
  userId: number;
  isPromoted: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  ratingCount: number;
  reviewCount: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  contact: string;
  role: "buyer" | "agent" | "creator";
  avatarUrl?: string;
}
