import { privateAxios, publicAxios } from "./axiosInstance";

export interface BookTourPayload {
  postId: number;
  agentId: number;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm:ss
  consent?: any;
  paymentMethodId?: string;
}

export interface BookTourResponse {
  status: string;
  message?: string;
  data?: any;
}

export const bookTourService = async (data: BookTourPayload, token: string, authToken: string) => {
  // Convert time format from "HH:mm AM/PM" to "HH:mm:ss"
  const convertTimeFormat = (timeStr: string): string => {
    if (!timeStr) return "00:00:00";
    
    const [time, period] = timeStr.split(" ");
    if (!time) return "00:00:00";
    
    let [hours, minutes] = time.split(":").map(Number);
    
    // Convert 12-hour to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  };

  // Filter only required fields for backend
  const filteredData = {
    postId: data.postId,
    agentId: data.agentId,
    date: data.date,
    time: convertTimeFormat(data.time),
    paymentMethodId: data.paymentMethodId,
  };

  // Validate all required fields are present
  if (!filteredData.postId || !filteredData.agentId || !filteredData.date || !filteredData.time || !filteredData.paymentMethodId) {
    console.error("Missing required fields:", filteredData);
    throw new Error(`Missing required fields: postId=${filteredData.postId}, agentId=${filteredData.agentId}, date=${filteredData.date}, time=${filteredData.time}, paymentMethodId=${filteredData.paymentMethodId}`);
  }

  console.log("Sending to backend:", filteredData);
  
  const response = await privateAxios.post(
    "/tour/book-tour",
    filteredData,
  );
  console.log("Book Tour Response:", response.data);
  return response.data;
};
