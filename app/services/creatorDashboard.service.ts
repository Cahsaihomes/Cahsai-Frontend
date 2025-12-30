import { multipartPrivateAxios, privateAxios } from "./axiosInstance";

export interface CreatorDashboardStats {
  totalPosts: number;
  videoPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalSaves: number;
  totalComments: number;
  totalEarnings: number;
  engagementScore: number;
  payouts: Array<{
    upcomingPayout: number;
    payoutDate: string;
  }>;
}

export interface GetCreatorDashboardStatsResponse {
  success: boolean;
  message?: string;
  data: CreatorDashboardStats;
}

export const getCreatorDashboardStats = async (): Promise<GetCreatorDashboardStatsResponse> => {
  const response = await privateAxios.get("/dashboard/creator-dashboard/stats");
  console.log("Creator Dashboard Stats Response: ", response.data);
  return response.data;
};


// video analysis
export interface CreatorVideoAnalyticsResponse {
  success: boolean;
  message?: string;
  data: {
    viewType: string;
    year: string;
    data: Record<string, number>;
  };
}

export const getCreatorVideoAnalytics = async (
  viewType: string = "month",
  year: string = new Date().getFullYear().toString()
): Promise<CreatorVideoAnalyticsResponse> => {
  const response = await privateAxios.get(
    `/dashboard/creator-dashboard/video-analytics?viewType=${viewType}&year=${year}`
  );
  console.log("Creator Video Analytics Response: ", response.data);
  return response.data;
};

//creator clip analytics
export interface CreatorClipStatsResponse {
  success: boolean;
  message?: string;
  data: {
    totalVideos: number;
    totalViews: number;
    totalEarning: number;
    engagementScore: number;
    totalLikes: number;
    totalShares: number;
    totalSaves: number;
  };
}

export const getCreatorClipStats = async (): Promise<CreatorClipStatsResponse> => {
  const response = await privateAxios.get("/dashboard/creator-dashboard/clip-stats");
  console.log("Creator Clip Stats Response: ", response.data);
  return response.data;
};