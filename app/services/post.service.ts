import { multipartPrivateAxios, publicAxiosWithToken } from "@/app/services/axiosInstance";
import { Post } from "@/app/Utils/post-types";

/**
 * Fetch a single post by ID
 * @param postId - The ID of the post to fetch
 * @returns The post data
 */
export const getPostById = async (postId: string | number): Promise<Post> => {
  try {
    // Method 1: Try direct endpoint first
    try {
      const response = await multipartPrivateAxios.get(`/posts/${postId}`);
      console.log("Fetched Post via direct endpoint:", response.data);
      return response.data.data || response.data;
    } catch (directError: any) {
      console.warn(`Direct endpoint failed (${directError.response?.status}), trying fallback...`);
      
      // Method 2: Fallback - Fetch all posts and filter by ID
      try {
        const allPostsResponse = await multipartPrivateAxios.get("/posts/get-all-posts");
        const posts = allPostsResponse.data.data || allPostsResponse.data || [];
        
        const post = posts.find((p: Post) => String(p.id) === String(postId));
        
        if (post) {
          console.log("Fetched Post via getAllPosts fallback:", post);
          return post;
        }
        
        throw new Error("Post not found in all posts");
      } catch (fallbackError) {
        console.warn("Fallback failed, trying public endpoint...");
        throw directError; // Throw original error if fallback fails
      }
    }
  } catch (error: any) {
    console.error("Error fetching post:", error);
    throw new Error(`Failed to fetch post with ID ${postId}`);
  }
};

/**
 * Fetch a single post by slug (if available)
 * @param slug - The slug of the post
 * @returns The post data
 */
export const getPostBySlug = async (slug: string): Promise<Post> => {
  try {
    const response = await publicAxiosWithToken.get(`/posts/slug/${slug}`);
    console.log("Fetched Post by Slug:", response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Error fetching post by slug:", error);
    throw new Error(`Failed to fetch post with slug ${slug}`);
  }
};
