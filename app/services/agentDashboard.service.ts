import { multipartPrivateAxios } from "./axiosInstance";

export interface GetAgentDashboardStatsResponse {
  status: string;
  message?: string;
  data: any;
}
export interface GetAgentDashboardCustomersResponse {
  status: string;
  message?: string;
  data: any;
}

export interface Tour {
  id: number;
  name: string;
  avatar?: string;
  address: string;
  time: string;
  status: string;
  type?: string;
}
export interface ClaimedTour {
  id: number;
  month: string;
  primary: number;
  secondary: number;
}

export const getAgentDashboardStats =
  async (): Promise<GetAgentDashboardStatsResponse> => {
    const response = await multipartPrivateAxios.get("/dashboard/stats");
    console.log("Agent Dashboard Stats Response: ", response.data);
    return response.data;
  };

export const getAgentDashboardCustomers =
  async (): Promise<GetAgentDashboardCustomersResponse> => {
    const response = await multipartPrivateAxios.get("/dashboard/customers");
    console.log("Agent Dashboard Customers Response: ", response.data);
    return response.data;
  };

export const getUpcomingTours = async (): Promise<Tour[]> => {
  const res = await multipartPrivateAxios.get("/dashboard/upcoming-tours");

  if (res.data?.data) {
    return res.data.data.map((tour: any) => ({
      id: tour.id,
      name: tour.buyer?.first_name || "Unknown",
      avatar: tour.buyer?.avatarUrl || "/images/agent.png",
      address: `${tour.post?.city || ""}, ${tour.post?.location || ""}`,
      time: tour.time,
      status: tour.status,
      type: tour.bookingStatus,
    }));
  }

  return [];
};
export const getClaimedTours = async (): Promise<ClaimedTour[]> => {
  const response = await multipartPrivateAxios.get("/dashboard/claimed-tours");
  const data: Record<string, number> = response.data?.data || {};

  if (!data || typeof data !== "object") {
    return [];
  }

  return Object.keys(data).map((month, idx) => ({
    id: idx,
    month,
    primary: Number(data[month]) || 0,
    secondary: 0, // fallback since API doesn’t provide
  }));
};
