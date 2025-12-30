import { multipartPrivateAxios } from "./axiosInstance";

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export interface TourAppointment {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: "Pending" | "Confirmed";
  role: string;
  timeAgo: string;
  avatar?: string | null;
  date: string; 
  time: string;
}

export interface GroupedTours {
  date: string;
  appointments: TourAppointment[];
}

const mapTour = (t: any): TourAppointment => ({
  id: t.id,
  name: `${t.buyer.first_name} ${t.buyer.last_name}`,
  phone: t.buyer.contact,
  email: t.buyer.email,
  address: "Unknown address",
  status: t.status.includes("Confirmed") ? "Confirmed" : "Pending",
  role: "Buyer",
  timeAgo: getTimeAgo(t.createdAt),
  avatar: t.buyer.avatarUrl,
  date: t.date,
  time: t.time,
});

const groupByDate = (tours: any[]): GroupedTours[] => {
  const grouped: Record<string, TourAppointment[]> = {};

  tours.forEach((t) => {
    const mapped = mapTour(t);
    if (!grouped[mapped.date]) {
      grouped[mapped.date] = [];
    }
    grouped[mapped.date].push(mapped);
  });

  return Object.entries(grouped).map(([date, appointments]) => ({
    date,
    appointments,
  }));
};

export const getDayTours = async (date: string): Promise<TourAppointment[]> => {
  const res = await multipartPrivateAxios.get(`/tour/agent-tours/day`, {
    params: { date },
  });
  return res.data?.data.map(mapTour) || [];
};


export const getWeekTours = async (
  startDate: string,
  endDate: string
): Promise<GroupedTours[]> => {
  const res = await multipartPrivateAxios.get(`/tour/agent-tours/week`, {
    params: { startDate, endDate },
  });
  return groupByDate(res.data?.data || []);
};


export const getMonthTours = async (
  month: number,
  year: number
): Promise<GroupedTours[]> => {
  const res = await multipartPrivateAxios.get(`/tour/agent-tours/month`, {
    params: { month, year },
  });
  return groupByDate(res.data?.data || []);
};
