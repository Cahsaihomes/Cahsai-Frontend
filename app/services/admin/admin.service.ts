import { privateAxios } from '@/app/services/axiosInstance';

export interface AdminRole {
  id: number;
  name: string;
  description: string;
  permissions?: any[];
}

export interface AdminData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role: AdminRole;
  is_admin?: boolean;
  admin_status?: 'active' | 'inactive';
  userRoles?: any[];
}

export interface AdminResponseData {
  currentAdmin: AdminData;
  allOtherAdmins: AdminData[];
  totalAdminsCount: number;
  totalFinanceAndCreators?: number;
  financeAndCreators?: any[];
}

export interface AdminResponse {
  success: boolean;
  data?: AdminData;
  message?: string;
  admin?: AdminData;
}

export interface AdminsListResponse {
  success: boolean;
  data: AdminResponseData;
  message?: string;
}

/**
 * Fetch all admins from backend - calls GET /api/admin/{userId}
 */
export const fetchAllAdmins = async (userId: number | string): Promise<AdminResponseData> => {
  try {
    const response = await privateAxios.get<AdminsListResponse>(`/admin/${userId}`);
    return response.data.data || { currentAdmin: null, allOtherAdmins: [], totalAdminsCount: 0 };
  } catch (error: any) {
    console.error('Error fetching admins:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch admins');
  }
};

/**
 * Create a new admin
 */
export const createAdmin = async (adminData: {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Finance Admin' | 'Content Moderator' | 'Super Admin';
  sendEmail?: boolean;
}): Promise<AdminData> => {
  try {
    const response = await privateAxios.post<AdminResponse>('/admin/create-admin', adminData);
    if (response.data.admin) {
      return response.data.admin;
    }
    return response.data.data as AdminData;
  } catch (error: any) {
    console.error('Error creating admin:', error);
    throw new Error(error.response?.data?.message || 'Failed to create admin');
  }
};

/**
 * Update admin details
 */
export const updateAdmin = async (
  adminId: number,
  adminData: Partial<AdminData>
): Promise<AdminData> => {
  try {
    const response = await privateAxios.put<AdminResponse>(
      `/admin/update-admin/${adminId}`,
      adminData
    );
    return response.data.data || response.data.admin || adminData as AdminData;
  } catch (error: any) {
    console.error('Error updating admin:', error);
    throw new Error(error.response?.data?.message || 'Failed to update admin');
  }
};

/**
 * Delete/Remove admin
 */
export const deleteAdmin = async (adminId: number): Promise<AdminResponse> => {
  try {
    const response = await privateAxios.delete<AdminResponse>(
      `/admin/${adminId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting admin:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete admin');
  }
};

/**
 * Get available roles
 */
export const fetchRoles = async (): Promise<any[]> => {
  try {
    const response = await privateAxios.get('/admin/roles');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch roles');
  }
};

/**
 * Assign role to user
 */
export const assignRoleToUser = async (
  userId: number,
  roleId: number
): Promise<AdminResponse> => {
  try {
    const response = await privateAxios.post<AdminResponse>(
      `/admin/assign-role/${userId}`,
      { roleId }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error assigning role:', error);
    throw new Error(error.response?.data?.message || 'Failed to assign role');
  }
};
