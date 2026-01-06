import { multipartPrivateAxios } from "./axiosInstance";

export interface RentalApplicationPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  currentAddress: string;
  desiredMoveInDate: string;
  monthlyIncome: string;
  employmentStatus: string;
  employerName: string;
  lengthOfEmployment: string;
  numAdults: string;
  numMinors: string;
  hasPets: boolean;
  petType?: string;
  petBreed?: string;
  petWeight?: string;
}

export interface RentalApplicationDocuments {
  governmentId: File;
  proofOfIncomeType: string;
  proofOfIncomeFile: File;
  studentLetter?: File;
  guarantorDocs?: File;
  petVaccinationRecords?: File;
}

export interface RentalApplication extends RentalApplicationPayload, RentalApplicationDocuments {
  id?: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Submit a new rental application with documents
 */
export const submitRentalApplication = async (
  formData: RentalApplicationPayload,
  documents: RentalApplicationDocuments
) => {
  const payload = new FormData();

  // Add form data
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      payload.append(key, String(value));
    }
  });

  // Add files
  if (documents.governmentId) {
    payload.append('governmentId', documents.governmentId);
  }
  if (documents.proofOfIncomeFile) {
    payload.append('proofOfIncomeFile', documents.proofOfIncomeFile);
  }
  payload.append('proofOfIncomeType', documents.proofOfIncomeType);

  if (documents.studentLetter) {
    payload.append('studentLetter', documents.studentLetter);
  }
  if (documents.guarantorDocs) {
    payload.append('guarantorDocs', documents.guarantorDocs);
  }
  if (documents.petVaccinationRecords) {
    payload.append('petVaccinationRecords', documents.petVaccinationRecords);
  }

  try {
    const response = await multipartPrivateAxios.post('/rental-applications/submit', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get current user's rental applications
 */
export const getUserRentalApplications = async () => {
  try {
    const response = await multipartPrivateAxios.get('/rental-applications/user/my-applications');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get rental application by ID
 */
export const getRentalApplicationById = async (id: number) => {
  try {
    const response = await multipartPrivateAxios.get(`/rental-applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update rental application
 */
export const updateRentalApplication = async (
  id: number,
  formData: Partial<RentalApplicationPayload>
) => {
  try {
    const response = await multipartPrivateAxios.put(`/rental-applications/${id}`, formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete rental application
 */
export const deleteRentalApplication = async (id: number) => {
  try {
    const response = await multipartPrivateAxios.delete(`/rental-applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get application status
 */
export const getApplicationStatus = async (id: number) => {
  try {
    const response = await multipartPrivateAxios.get(`/rental-applications/${id}`);
    return response.data.status;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all rental applications (admin only)
 */
export const getAllRentalApplications = async () => {
  try {
    const response = await multipartPrivateAxios.get('/rental-applications');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all rental applications:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Update rental application status (admin only)
 */
export const updateApplicationStatus = async (
  id: number,
  status: 'pending' | 'approved' | 'rejected'
) => {
  try {
    const response = await multipartPrivateAxios.patch(
      `/rental-applications/${id}/status`,
      { status }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating application status:', error);
    throw error.response?.data || error.message;
  }
};
