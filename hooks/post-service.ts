import { multipartPrivateAxios } from "@/app/services/axiosInstance";
import { Post } from "@/app/Utils/post-types";

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await multipartPrivateAxios.get("/posts/get-all-posts");
    return response.data.data;
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
};

export interface FeedPostsResponse {
  data: Post[];
  nextCursor: string | null;
}

export const getFeedPosts = async ({
  type,
  cursor,
  limit = 10,
}: {
  type: "sale" | "rent" | "stays";
  cursor?: string | null;
  limit?: number;
}): Promise<FeedPostsResponse> => {
  const response = await multipartPrivateAxios.get("/posts/feed", {
    params: {
      type,
      cursor: cursor || undefined,
      limit,
    },
  });

  return {
    data: response.data.data || [],
    nextCursor: response.data.nextCursor || null,
  };
};
