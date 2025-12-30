import { privateAxios, publicAxios } from "./axiosInstance";

export interface BookTourPayload {
  postId: number;
  agentId: number;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm:ss
}

export interface BookTourResponse {
  status: string;
  message?: string;
  data?: any;
}

export const bookTourService = async (data: BookTourPayload, token: string, authToken: string) => {
  const response = await privateAxios.post(
    "/tour/book-tour",
    data,
  );
  console.log("Book Tour Response:", response.data);
  return response.data;
};
