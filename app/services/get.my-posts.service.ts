import { AxiosError } from "axios";
import { multipartPrivateAxios, publicAxiosWithToken } from "./axiosInstance";

export interface GetMyPostsResponse {
  status: string;
  message?: string;
  data: any[];
}

export const getMyPosts = async (): Promise<GetMyPostsResponse> => {
  const response = await multipartPrivateAxios.get("/posts/my-posts");
  console.log("Get My Posts Response: ", response.data);
  return response.data;
};

export const buyerPost = async () => {
  try {
    const response = await publicAxiosWithToken.get("/posts/get-all-posts");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to fetch buyer posts!:", err.message);
    return null;
  }
};

export const buyerSavedPost = async () => {
  try {
    const response = await publicAxiosWithToken.get(
      "/buyer-saved-posts/fetch-all"
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to fetch buyer saved posts!:", err.message);
    return null;
  }
};

export const savedPost = async ({ postId }: { postId: number }) => {
  try {
    const response = await publicAxiosWithToken.post(
      "/buyer-saved-posts/save",
      {
        postId,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer saved posts!:", err.message);
    return null;
  }
};

export const unsavedPost = async ({ postId }: { postId: number }) => {
  try {
    const response = await publicAxiosWithToken.delete(
      "/buyer-saved-posts/unsave",
      {
        data: { postId },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer unsaved posts!:", err.message);
    return null;
  }
};

export const tourBookRequest = async ({
  postId,
  agentId,
  date,
  time,
}: {
  postId: number;
  agentId: number;
  date: string;
  time: string;
}) => {
  try {
    const response = await publicAxiosWithToken.post("/tour/book-tour", {
      postId,
      agentId,
      date,
      time,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to book a tour!:", err.message);

    if (err.response?.data) {
      throw err.response.data;
    }
    throw { status: "error", message: err.message || "Unknown error" };
  }
};

export const buyerAllTours = async (buyerId?: number) => {
  try {
    const response = await publicAxiosWithToken.get(
      `/tour/get-all-tours?buyerId=${buyerId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to fetch buyer all tours!:", err.message);
    return null;
  }
};

export const buyerSavedTours = async () => {
  try {
    const response = await publicAxiosWithToken.get("/tour/fetch-all");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to fetch buyer saved tours!:", err.message);
    return null;
  }
};

export const savedTour = async ({ tourId }: { tourId: number }) => {
  try {
    const response = await publicAxiosWithToken.post("/tour/save", {
      tourId,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer saved posts!:", err.message);
    return null;
  }
};

export const unsavedTour = async ({ tourId }: { tourId: number }) => {
  try {
    const response = await publicAxiosWithToken.delete("/tour/unsave", {
      data: { tourId },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer unsaved tour!:", err.message);
    return null;
  }
};

export const giveRating = async ({
  postId,
  rating,
  comment,
}: {
  postId: number;
  rating: number;
  comment?: string;
}) => {
  try {
    const response = await publicAxiosWithToken.post(
      "/buyer-reviews-posts/review",
      {
        postId,
        rating,
        comment,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer rating!:", err.message);
    return null;
  }
};

export const likePost = async ({ postId }: { postId: number }) => {
  try {
    const response = await publicAxiosWithToken.post(
      `posts-stats/like/${postId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer like posts!:", err.message);
    return null;
  }
};

export const dislikePost = async ({ postId }: { postId: number }) => {
  try {
    const response = await publicAxiosWithToken.post(
      `posts-stats/unlike/${postId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to buyer dislike tour!:", err.message);
    return null;
  }
};

export const buyerLikes = async () => {
  try {
    const response = await publicAxiosWithToken.get("/posts-stats/fetch-all");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to fetch buyer likes post!:", err.message);
    return null;
  }
};
