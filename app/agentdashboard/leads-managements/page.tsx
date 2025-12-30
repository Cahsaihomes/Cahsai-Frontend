"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActiveLeadCard from "@/components/ui/activeleadcard";
import FallbackLeadCard from "@/components/ui/fallbackleadcard";
import LeadDetailModal from "@/components/ui/leaddetailmodal";
import { cancelLead, claimLead, updateLeadStatus } from "./../../services/leads.service";
import { toast } from "sonner";
import { getTourLeadsService } from "@/app/services/getTourLeads.service";
import { format, parseISO, formatDistanceToNow } from "date-fns";

// Types matching your actual API response
interface Lead {
  id: number;
  postId: number;
  buyerId: number;
  agentId: number;
  date: string;
  time: string;
  status: string;
  bookingStatus: string;
  activeLead: boolean;
  timerExpiresAt: string; // ✅ This is the timer expiration timestamp from API
  expiredStatus: string;
  createdAt: string; // ✅ camelCase, not snake_case
  updatedAt: string; // ✅ camelCase, not snake_case
  buyer: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
  post: {
    price: number;
    location: string;
    title?: string;
    description?: string;
  };
}

function parseLeadDateTime(date: string, time: string) {
  if (!date || !time) return null;
  const [rawTime, period] = time.split(" ");
  let [hour, minute] = rawTime.split(":");
  let hourNum = parseInt(hour, 10);
  if (period === "PM" && hourNum !== 12) hourNum += 12;
  if (period === "AM" && hourNum === 12) hourNum = 0;
  const isoTime = `${hourNum.toString().padStart(2, "0")}:${minute}:00`;
  return `${date}T${isoTime}`;
}

// Calculate remaining time using timerExpiresAt from API
function calculateRemainingTime(timerExpiresAt: string | null | undefined): number {
  if (!timerExpiresAt) {
    console.warn("No timerExpiresAt found");
    return 0;
  }

  try {
    const expiryDate = new Date(timerExpiresAt);
    const now = new Date();
    const remainingMs = expiryDate.getTime() - now.getTime();
    const remainingSeconds = Math.floor(remainingMs / 1000);

    return Math.max(0, remainingSeconds);
  } catch (error) {
    console.error("Error calculating remaining time:", error);
    return 0;
  }
}

// Get human-readable time ago using createdAt
function getTimeAgo(createdAt?: string): string {
  if (!createdAt) {
    return "Recently";
  }
  
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } catch (error) {
    console.error("Error calculating time ago:", error);
    return "Recently";
  }
}

export default function LeadManagementPage() {
  const [activeTab, setActiveTab] = useState<"active" | "fallback">("active");
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const timerRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const [leadTimers, setLeadTimers] = useState<{ [key: number]: number }>({});
  const [claimingId, setClaimingId] = useState<string | number | null>(null);

  // Fetch leads
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agentTourLeads"],
    queryFn: () => getTourLeadsService(),
  });

  const leads: Lead[] = data?.leads ?? [];
  const activeLeads = leads.filter((l) => l && l.activeLead);
  const fallbackLeads = leads.filter((l) => l && !l.activeLead);
  const leadsToDisplay = activeTab === "active" ? activeLeads : fallbackLeads;

  // Initialize timers based on timerExpiresAt from API
  useEffect(() => {
    // Clear all existing timers
    Object.values(timerRefs.current).forEach(clearInterval);
    timerRefs.current = {};

    const displayLeads = activeTab === "active" ? activeLeads : fallbackLeads;
    
    // Initialize timers for leads based on their timerExpiresAt timestamp
    const newTimers: { [key: number]: number } = {};
    displayLeads.forEach((lead) => {
      if (leadTimers[lead.id] === undefined) {
        // Use timerExpiresAt from API to calculate remaining time
        const remainingTime = calculateRemainingTime(lead.timerExpiresAt);
        newTimers[lead.id] = remainingTime;
      }
    });

    // Set initial timers if there are new leads
    if (Object.keys(newTimers).length > 0) {
      setLeadTimers((prev) => ({ ...prev, ...newTimers }));
    }

    // Start countdown intervals
    displayLeads.forEach((lead) => {
      timerRefs.current[lead.id] = setInterval(() => {
        setLeadTimers((prev) => {
          const currentValue = prev[lead.id];
          
          // If timer doesn't exist or is already 0, stop
          if (currentValue === undefined || currentValue <= 0) {
            if (timerRefs.current[lead.id]) {
              clearInterval(timerRefs.current[lead.id]);
            }
            return prev;
          }

          const newValue = currentValue - 1;

          // When timer reaches 0, refresh data
          if (newValue <= 0) {
            clearInterval(timerRefs.current[lead.id]);
            queryClient.invalidateQueries({ queryKey: ["agentTourLeads"] });
            return { ...prev, [lead.id]: 0 };
          }

          return { ...prev, [lead.id]: newValue };
        });
      }, 1000);
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, [activeTab, activeLeads.length, fallbackLeads.length]);

  // Cancel Lead Mutation
  const { mutate: cancelLeadMutation } = useMutation({
    mutationFn: async (leadId: number | string) => {
      const res = await cancelLead(String(leadId));
      if (res.status !== "success") {
        throw new Error(res.message || "Failed to cancel lead.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Lead cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["agentTourLeads"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel lead.");
    },
  });

  // Claim Lead Mutation
  const { mutate: claimLeadMutation } = useMutation({
    mutationFn: async (leadId: number | string) => {
      setClaimingId(leadId);
      const res = await claimLead(String(leadId));
      if (res.status !== "success") {
        throw new Error(res.message || "Failed to claim lead.");
      }
      return res;
    },
    onSuccess: (_, leadId) => {
      queryClient.setQueryData(["agentTourLeads"], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.leads)) return oldData;
        return {
          ...oldData,
          leads: oldData.leads.map((lead: Lead) =>
            lead.id === leadId ? { ...lead, activeLead: true } : lead
          ),
        };
      });
      toast.success("Lead claimed successfully!");
      setClaimingId(null);
      setActiveTab("active");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to claim lead.");
      setClaimingId(null);
    },
  });

  // Update Status Mutation
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: (variables: { leadId: number | string; status: string }) =>
      updateLeadStatus(String(variables.leadId), variables.status),
    onSuccess: (_, variables) => {
      const { leadId, status } = variables;
      queryClient.setQueryData(["agentTourLeads"], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.leads)) return oldData;
        return {
          ...oldData,
          leads: oldData.leads.map((lead: Lead) =>
            lead.id === leadId ? { ...lead, status } : lead
          ),
        };
      });
      toast.success("Status updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status.");
    },
  });

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCallBuyer = (lead: Lead) => {
    if (lead.buyer.phone) {
      window.location.href = `tel:${lead.buyer.phone}`;
    } else {
      toast.info(`Calling ${lead.buyer.first_name}...`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 flex items-center justify-center">
        <p className="text-gray-500">Loading leads...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 flex items-center justify-center">
        <p className="text-red-500">Failed to load leads.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1">
      {/* Header */}
      <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
        Lead Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 mt-4">
        <div className="inline-flex items-center bg-white border border-gray-100 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "active"
                ? "bg-[#6F8375] text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Active Leads ({activeLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("fallback")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "fallback"
                ? "bg-[#6F8375] text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Fallback Leads ({fallbackLeads.length})
          </button>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {leadsToDisplay.length > 0 ? (
          leadsToDisplay.map((lead) => {
            // Format date and time
            let formattedDate = lead.date;
            let formattedTime = lead.time;
            const dateTimeString = parseLeadDateTime(lead.date, lead.time);
            if (dateTimeString) {
              try {
                const parsedDate = parseISO(dateTimeString);
                formattedDate = format(parsedDate, "EEE, MMM d");
                formattedTime = format(parsedDate, "h:mm a");
              } catch (error) {
                console.error("Date parsing error:", error);
              }
            }

            // Calculate time ago from createdAt (camelCase)
            const timeAgo = getTimeAgo(lead.createdAt);

            // Timer display
            const timerValue = leadTimers[lead.id];
            let timerDisplay = "Expired";
            
            if (timerValue !== undefined && timerValue > 0) {
              const min = Math.floor(timerValue / 60);
              const sec = timerValue % 60;
              timerDisplay = `${min.toString().padStart(2, "0")}:${sec
                .toString()
                .padStart(2, "0")}`;
            }

            return activeTab === "active" ? (
              <ActiveLeadCard
                key={lead.id}
                leadId={String(lead.id)}
                name={`${lead.buyer.first_name} ${lead.buyer.last_name}`}
                price={`$${lead.post.price.toLocaleString()}`}
                address={lead.post?.location || "Unknown Address"}
                date={formattedDate}
                time={formattedTime}
                timeAgo={timeAgo}
                status={lead.status}
                timer={timerDisplay}
                onStatusChange={(newStatus) =>
                  updateStatusMutation({ leadId: lead.id, status: newStatus })
                }
                onViewDetails={() => handleViewDetails(lead)}
                onCallBuyer={() => handleCallBuyer(lead)}
              />
            ) : (
              <FallbackLeadCard
                key={lead.id}
                name={`${lead.buyer.first_name} ${lead.buyer.last_name}`}
                price={`$${lead.post.price.toLocaleString()}`}
                address={lead.post?.location || "Unknown Address"}
                date={formattedDate}
                time={formattedTime}
                timer={timerDisplay}
                claimPrice=""
                dateTime={dateTimeString || ""}
                onCancel={() => cancelLeadMutation(lead.id)}
                onClaim={() => claimLeadMutation(lead.id)}
                claimLoading={claimingId === lead.id}
              />
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center h-40 text-gray-500 font-medium">
            No {activeTab === "active" ? "Active" : "Fallback"} Leads Found
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedLead(null);
          }}
          lead={selectedLead}
        />
      )}
    </div>
  );
}