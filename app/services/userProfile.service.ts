import { multipartPrivateAxios } from "./axiosInstance";

export interface GetUserProfileOverviewResponse {
  status: string;
  message?: string;
  data: any;
}

export const getUserProfileOverview = async (
  id: string | number
): Promise<GetUserProfileOverviewResponse> => {
  const response = await multipartPrivateAxios.get(`/users/${id}/overview`);
  console.log("API Response:", response.data);
  return response.data;
  
};
