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
  agentId?: number | string,
  page: number = 1,
  limit: number = 10000
): Promise<GetTourLeadsResponse> => {
  // Get agentId from parameter
  const id = agentId;
  
  if (!id) {
    throw new Error("Agent ID is required to fetch leads");
  }

  const response = await privateAxios.get(`/tour/leads/${id}`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};
