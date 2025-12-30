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
