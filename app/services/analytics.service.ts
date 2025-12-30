import { log } from "console";
import { multipartPrivateAxios } from "./axiosInstance";

export const getVideoAnalytics = async (
  viewType: "month" | "week",
  year: number
) => {
  const response = await multipartPrivateAxios.get(
    `dashboard/video-analytics?viewType=${viewType}&year=${year}`
  );
  console.log("Video Analytics Response: ", response.data);
  return response.data;
};

export const getCustomers = async () => {
  const res = await multipartPrivateAxios.get("/dashboard/customers"); // ✅ no extra /api
  console.log("Customers API response:", res.data);

  if (res.data?.data) {
    return res.data.data.map((c: any) => ({
      id: c.id,
      name: c.user_name || `${c.first_name} ${c.last_name}`.trim(),
      avatar: c.avatarUrl,
      role: c.role,
      email: c.email,
    }));
  }
  return [];
};
