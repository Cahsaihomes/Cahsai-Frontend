import { multipartPrivateAxios, privateAxios } from "../axiosInstance";

// ==================== TYPES ====================
export interface MonthlyChange {
  buyers: string;
  agents: string;
  creators: string;
  earning: string;
}

export interface AdminDashboardStats {
  totalBuyers: number;
  totalAgents: number;
  totalCreators: number;
  totalEarning: number;
  monthlyChange: MonthlyChange;
}

export interface AdminStatsResponse {
  status: string;
  message?: string;
  data?: AdminDashboardStats;
}

// Agent Activity Types
export interface ActivityData {
  leads: number;
  tours: number;
  conversions: number;
}

export interface AgentActivityWeekly {
  weekly: ActivityData;
  total: ActivityData;
}

// Top Performers Types
export interface TopPerformer {
  name: string;
  totalVideos: number;
  totalViews: number;
  totalSaves: number;
  totalShares: number;
  leads: number;
  earning: number;
}

export interface TopPerformersResponse {
  topCreators: TopPerformer[];
  topAgents: TopPerformer[];
}

// Agent Management Types
export interface LeadPerformance {
  leadsClaimed: number;
  conversionRate: string;
  avgResponseTime: string;
}

export interface FinancialOverview {
  totalEarnings: string;
  pendingPayout: string;
}

export interface Agent {
  name: string;
  email: string;
  license: string;
  leads: number;
  subscription: string;
  status: string;
  leadPerformance: LeadPerformance;
  financialOverview: FinancialOverview;
}

export interface AgentsResponse {
  agents: Agent[];
  totalAgents: number;
}

// Buyer Management Types
export interface CommunicationHistory {
  type: string;
  timeAgo: string;
}

export interface AssignedAgent {
  name: string;
  email: string;
  phone: string;
}

export interface Buyer {
  name: string;
  email: string;
  signupDate: string;
  toursBooked: number;
  dreamBoards: number;
  status: string;
  clipsWatched: number;
  homesSaved: number;
  assignedAgent: AssignedAgent | null;
  communicationHistory: CommunicationHistory[];
}

export interface BuyersResponse {
  buyers: Buyer[];
  totalBuyers: number;
}

// Creator Management Types
export interface CreatorStats {
  videosUploaded: number;
  leadsGenerated: number;
  totalEarnings: string;
}

export interface PerformanceGraph {
  totalViews: number;
  monthlyData: any[];
}

export interface CreatorEngagement {
  avgEngagementRate: string;
  avgVideoLength: string;
  uploadFrequency: string;
}

export interface CreatorPayout {
  totalPaid: string;
  pendingPayout: string;
}

export interface Creator {
  name: string;
  email: string;
  videos: number;
  leads: number;
  earnings: string;
  status: string;
  creatorSince: string;
  stats: CreatorStats;
  performanceGraph: PerformanceGraph;
  engagement: CreatorEngagement;
  payout: CreatorPayout;
}

export interface CreatorsResponse {
  creators: Creator[];
  totalCreators: number;
}

// Lead Management Types
export interface Lead {
  leadId: string;
  source: string;
  buyerName: string;
  agentName: string;
  status: string;
  amount: string;
}

export interface LeadStats {
  totalLeads: number;
  completed: number;
  pending: number;
  unclaimed: number;
}

export interface LeadsResponse {
  leads: Lead[];
  totalLeads: number;
  stats: LeadStats;
}

// Payout Management Types
export interface PayoutStats {
  totalPayouts: number;
  completed: number;
  successfullyPaid: number;
  pending: number;
  onHold: number;
}

export interface Payout {
  id: string;
  recipient: string;
  type: string;
  amount: string;
  method: string;
  status: string;
  date: string;
  details: string;
}

export interface PayoutsResponse {
  stats: PayoutStats;
  data: Payout[];
}

// Admin Settings Types
export interface AdminConfig {
  tourPrice?: number;
  LeadClaimPrice?: number;
  creatorCommission: number;
  agentCommission: number;
}

export interface AdminConfigResponse {
  tourPrice?: number;
  LeadClaimPrice?: number;
  creatorCommission: number;
  agentCommission: number;
}

// Clips Management Types
export interface ClipStats {
  totalClips: number;
  published: number;
  pendingReview: number;
  totalViews: number;
}

export interface Clip {
  id: number;
  clip: string;
  creator: string;
  views: number;
  likes: number;
  status: string;
  date: string;
  duration: string;
  imagesUrl: string[];
  videoUrl: string | null;
}

export interface ClipsResponse {
  posts: Clip[];
  stats: ClipStats;
}

// ==================== API CALLS ====================

/**
 * Fetch admin dashboard statistics
 * @returns Promise with dashboard stats data
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  try {
    const response = await multipartPrivateAxios.get<AdminDashboardStats>(
      "/admin-dashboard/stats"
    );
    console.log("Admin Dashboard Stats Response: ", response.data); 
    
    // API returns data directly, not wrapped
    if (response.data && response.data.totalBuyers !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching admin dashboard stats:", error.message);
    throw error;
  }
};

/**
 * Fetch agent activity weekly data
 * @returns Promise with weekly and total activity data
 */
export const getAgentActivityWeekly = async (): Promise<AgentActivityWeekly> => {
  try {
    const response = await multipartPrivateAxios.get<AgentActivityWeekly>(
      "/admin-dashboard/agent-activity-weekly"
    );
    console.log("Agent Activity Weekly Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.weekly !== undefined && response.data.total !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching agent activity weekly:", error.message);
    throw error;
  }
};

/**
 * Fetch top performers (creators and agents)
 * @returns Promise with top creators and agents data
 */
export const getTopPerformers = async (): Promise<TopPerformersResponse> => {
  try {
    const response = await multipartPrivateAxios.get<TopPerformersResponse>(
      "/admin-dashboard/top-performers-this-month"
    );
    console.log("Top Performers Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.topCreators !== undefined && response.data.topAgents !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching top performers:", error.message);
    throw error;
  }
};

/**
 * Fetch all agents for admin dashboard
 * @returns Promise with agents list and total count
 */
export const getAgents = async (): Promise<AgentsResponse> => {
  try {
    const response = await multipartPrivateAxios.get<AgentsResponse>(
      "/admin-dashboard/agents"
    );
    console.log("Agents Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.agents !== undefined && response.data.totalAgents !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching agents:", error.message);
    throw error;
  }
};

/**
 * Fetch all buyers for admin dashboard
 * @returns Promise with buyers list and total count
 */
export const getBuyers = async (): Promise<BuyersResponse> => {
  try {
    const response = await multipartPrivateAxios.get<BuyersResponse>(
      "/admin-dashboard/buyers"
    );
    console.log("Buyers Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.buyers !== undefined && response.data.totalBuyers !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching buyers:", error.message);
    throw error;
  }
};

/**
 * Fetch all creators for admin dashboard
 * @returns Promise with creators list and total count
 */
export const getCreators = async (): Promise<CreatorsResponse> => {
  try {
    const response = await multipartPrivateAxios.get<CreatorsResponse>(
      "/admin-dashboard/creators"
    );
    console.log("Creators Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.creators !== undefined && response.data.totalCreators !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching creators:", error.message);
    throw error;
  }
};

/**
 * Fetch all leads for admin dashboard
 * @returns Promise with leads list, total count, and stats
 */
export const getLeads = async (): Promise<LeadsResponse> => {
  try {
    const response = await multipartPrivateAxios.get<LeadsResponse>(
      "/admin-dashboard/leads"
    );
    console.log("Leads Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.leads !== undefined && response.data.totalLeads !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching leads:", error.message);
    throw error;
  }
};

/**
 * Fetch all payouts for admin dashboard
 * @returns Promise with payouts list and stats
 */
export const getPayouts = async (): Promise<PayoutsResponse> => {
  try {
    const response = await multipartPrivateAxios.get<PayoutsResponse>(
      "/admin-dashboard/total-payout"
    );
    console.log("Payouts Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.stats !== undefined && response.data.data !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching payouts:", error.message);
    throw error;
  }
};

/**
 * Fetch all clips for admin dashboard
 * @returns Promise with clips list and stats
 */
export const getClips = async (): Promise<ClipsResponse> => {
  try {
    const response = await multipartPrivateAxios.get<ClipsResponse>(
      "/admin-dashboard/posts"
    );
    console.log("Clips Response: ", response.data);
    
    // API returns data directly, not wrapped
    if (response.data && response.data.posts !== undefined && response.data.stats !== undefined) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching clips:", error.message);
    throw error;
  }
};

/**
 * Delete a clip by ID
 * @param id - The clip ID to delete
 * @returns Promise with deletion response
 */
export const deleteClip = async (id: number): Promise<{ message: string; deletedPostId: string }> => {
  try {
    const response = await multipartPrivateAxios.delete<{ message: string; deletedPostId: string }>(
      `/admin-dashboard/posts/${id}`
    );
    console.log("Delete Clip Response: ", response.data);
    
    if (response.data && response.data.deletedPostId) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error deleting clip:", error.message);
    throw error;
  }
};

/**
 * Fetch admin configuration settings
 * @returns Promise with admin config data
 */
export const getAdminConfig = async (): Promise<AdminConfig> => {
  try {
    const response = await multipartPrivateAxios.get<AdminConfigResponse>(
      "/admin-dashboard/config"
    );
    console.log("Admin Config Response: ", response.data);
    
    // API returns data directly - check for either tourPrice or LeadClaimPrice
    if (response.data && (response.data.tourPrice !== undefined || response.data.LeadClaimPrice !== undefined)) {
      return response.data;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching admin config:", error.message);
    throw error;
  }
};

/**
 * Update admin configuration settings
 * @param config - Updated config object
 * @returns Promise with updated config
 */
export const updateAdminConfig = async (config: {
  tourPrice?: number;
  creatorCommission?: number;
  agentCommission?: number;
}): Promise<AdminConfig> => {
  try {
    const response = await privateAxios.put<{ message: string; config: AdminConfig }>(
      "/admin-dashboard/config",
      config
    );
    console.log("Update Admin Config Response: ", response.data);
    
    // Check if we have a valid response - check for either tourPrice or LeadClaimPrice
    if (response.data && response.data.config && (response.data.config.tourPrice !== undefined || response.data.config.LeadClaimPrice !== undefined)) {
      return response.data.config;
    }
    
    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error updating admin config:", error.message);
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format currency with commas and dollar sign
 */
export const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString()}`;
};

/**
 * Extract numeric value from percentage string
 */
export const extractPercentage = (percentString: string): string => {
  const match = percentString.match(/([+-]?\d+\.?\d*%)/);
  return match ? match[0] : "0%";
};

/**
 * Check if change is positive
 */
export const isPositiveChange = (changeString: string): boolean => {
  return changeString.startsWith("+");
};
