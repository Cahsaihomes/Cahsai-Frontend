
import { multipartPrivateAxios } from "./axiosInstance";

export interface CreatePostPayload {
  title: string;
  description: string;
  price: string;
  zipCode: string;
  city: string;
  location: string;
  bedrooms: string;
  bathrooms: string;

  tags?: string[];
  amenities?: string[];
  homeStyle?: string[];

  post_images?: File[];
  post_videos?: File[];

  // 🔹 NEW LISTING FIELDS
  listing_type?: "FOR_SALE" | "FOR_RENT" | "STAY";
  monthly_rent?: string | null;
  lease_term?: string | null;
  pet_policy?: string | null;
  furnished?: boolean;
}

export const createPostService = async (data: CreatePostPayload) => {
  const formData = new FormData();

  // Basic fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("zipCode", data.zipCode);
  formData.append("city", data.city);
  formData.append("location", data.location);
  formData.append("bedrooms", data.bedrooms);
  formData.append("bathrooms", data.bathrooms);

  // Optional arrays
  if (data.tags?.length) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  if (data.amenities?.length) {
    formData.append("amenities", JSON.stringify(data.amenities));
  }

  if (data.homeStyle?.length) {
    formData.append("homeStyle", JSON.stringify(data.homeStyle));
  }

  // 🔹 NEW rental fields
  if (data.listing_type) {
    formData.append("listing_type", data.listing_type ?? "FOR_SALE");
  }

  if (data.monthly_rent) {
    formData.append("monthly_rent", data.monthly_rent);
  }

  if (data.lease_term) {
    formData.append("lease_term", data.lease_term);
  }

  if (data.pet_policy) {
    formData.append("pet_policy", data.pet_policy);
  }

  if (typeof data.furnished === "boolean") {
    formData.append("furnished", String(data.furnished));
  }

  // Images
  if (data.post_images?.length) {
    data.post_images.forEach((file) => {
      formData.append("post_images", file);
    });
  }

  // Videos
  if (data.post_videos?.length) {
    data.post_videos.forEach((file) => {
      formData.append("post_videos", file);
    });
  }

  try {
  const response = await multipartPrivateAxios.post(
    "/posts/create-post",
    formData
  );
  return response.data;
} catch (error: any) {
  console.error("❌ Create Post Error (frontend):", {
    status: error.response?.status,
    data: error.response?.data,
  });
  throw error;
}

};

// Update post service for PUT requests with file upload
export interface UpdatePostPayload {
  post_images?: File[];
  location?: string;
  price?: string;
  tags?: string[];
  description?: string;
  replaceIndex?: number;
  // Add other fields as needed
}

export const updatePostService = async (
  postId: number | string,
  data: UpdatePostPayload
) => {
  const formData = new FormData();

  // Append images if provided
  if (data.post_images && data.post_images.length > 0) {
    data.post_images.forEach((file) => {
      formData.append("post_images", file);
    });
  }
  if (data.location) formData.append("location", data.location);
  if (data.price) formData.append("price", data.price);
  if (data.description) formData.append("description", data.description);
  if (data.tags) formData.append("tags", JSON.stringify(data.tags));
  if (typeof data.replaceIndex === 'number') formData.append("replaceIndex", String(data.replaceIndex));

  const response = await multipartPrivateAxios.put(`/posts/update-post/${postId}`, formData);
  return response.data;
};

// Delete post service
export const deletePostService = async (postId: number | string) => {
  const response = await multipartPrivateAxios.delete(`/posts/delete-post/${postId}`);
  return response.data;
};

// Increment post views service
export const incrementPostViewsService = async (postId: number | string) => {
  const response = await multipartPrivateAxios.post(`/posts-stats/increment-views/${postId}`);
  return response.data;
};
// Increment post saves service
export const incrementPostSavesService = async (postId: number | string) => {
  const response = await multipartPrivateAxios.post(`/posts-stats/increment-saves/${postId}`);
  console.log("Increment Post Saves Response: ", response.data);
  return response.data;
};
// Update promote status service
export const updatePromoteStatusService = async (postId: number | string) => {
  const response = await multipartPrivateAxios.put(`/posts/promote-post/${postId}`, { isPromoted: true });
  return response.data;
};