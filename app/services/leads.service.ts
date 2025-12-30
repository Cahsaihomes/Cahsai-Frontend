import { multipartPrivateAxios, privateAxios } from "./axiosInstance";


export interface GetLeadsParams {
	startDate: string;
	endDate: string;
	
}

export interface GetLeadsResponse {
	status: string;
	message?: string;
	data: any[];
}

export interface GetToursResponse {
	status: string;
	message?: string;
	data: any[];
}

// Get leads for agent tours in a week
export const getLeads = async ({ startDate, endDate }: GetLeadsParams): Promise<GetLeadsResponse> => {
	const response = await multipartPrivateAxios.get(
		`/tour/agent-tours/week`,
		{ params: { startDate, endDate } }
	);
	console.log("Get Leads Response: ", response.data);
	return response.data;
};


export const getTours = async (): Promise<GetToursResponse> => {
	const response = await multipartPrivateAxios.get("/tour/get-tours");
	console.log("Get Tours Response: ", response.data);
	return response.data;
};

export const getAllTours = async (): Promise<GetToursResponse> => {
	const response = await multipartPrivateAxios.get("/tour/get-all-tours");
	console.log("Get Tours Response: ", response.data);
	return response.data;
};

// Claim a tour/lead
export const claimLead = async (leadId: string) => {
	const response = await privateAxios.patch(`/tour/claim-tour/${leadId}`);
	console.log("Claim Lead Response: ", response.data);
	return response.data;
}

// cancel a lead

// Cancel (reject) a lead
export const cancelLead = async (leadId: string) => {
	const response = await privateAxios.post(`/tour/reject-tour/${leadId}`);
	console.log("Cancel Lead Response: ", response.data);
	return response.data;
}


export const updateLeadStatus = async (leadId: string, status: string) => {
  const response = await privateAxios.patch(
    `/tour/update-status/${leadId}`,
    { status }
  );
  return response.data;
};

