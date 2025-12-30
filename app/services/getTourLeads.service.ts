import { privateAxios } from "./axiosInstance";

export interface GetTourLeadsPayload {
  postId?: number;
  agentId?: number;
  date?: string; // Format: YYYY-MM-DD
  time?: string; // Format: HH:mm:ss
}

export interface GetTourLeadsResponse {
  status: string;
  leads: Array<any>;
  page?: number;
  limit?: number;
  message?: string;
  data?: any;
}

export const getTourLeadsService = async (
  params?: GetTourLeadsPayload
): Promise<GetTourLeadsResponse> => {
  const response = await privateAxios.get("/tour/leads", params ? { params } : undefined);
  return response.data;
};
