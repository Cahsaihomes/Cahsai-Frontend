"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/components/StripeWrapper";
import { RootState } from "@/app/redux";
import ActiveLeadCard from "@/components/ui/activeleadcard";
import FallbackLeadCard from "@/components/ui/fallbackleadcard";
import LeadDetailModal from "@/components/ui/leaddetailmodal";
import ClaimLeadPaymentModal from "@/components/ui/claim-lead-payment-modal";
import { cancelLead, claimLeadWithPayment, updateLeadStatus } from "./../../services/leads.service";
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

// Calculate remaining time using timerExpiresAt from API (default: 15 minutes = 900 seconds)
function calculateRemainingTime(timerExpiresAt: string | null | undefined): number {
  if (!timerExpiresAt) {
    console.warn("No timerExpiresAt found, using default 15 minutes");
    return 900; // 15 minutes in seconds
  }

  try {
    const expiryDate = new Date(timerExpiresAt);
    const now = new Date();
    const remainingMs = expiryDate.getTime() - now.getTime();
    const remainingSeconds = Math.floor(remainingMs / 1000);

    return Math.max(900, remainingSeconds); // Minimum 15 minutes
  } catch (error) {
    console.error("Error calculating remaining time:", error);
    return 900; // Default 15 minutes on error
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

function LeadManagementPage() {
  const [activeTab, setActiveTab] = useState<"active" | "fallback">("active");
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();
  const timerRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const [leadTimers, setLeadTimers] = useState<{ [key: number]: number }>({});
  const [claimingId, setClaimingId] = useState<string | number | null>(null);
  const [claimedLeads, setClaimedLeads] = useState<Set<number>>(new Set());

  // Get agentId from Redux store (user.id)
  const user = useSelector((state: RootState) => state.auth.user);
  const agentId = user?.id;

  // Fetch leads
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agentTourLeads", agentId, page],
    queryFn: () => getTourLeadsService(agentId, page, 10000),
    enabled: !!agentId, // Only fetch when agentId is available
  });

  const leads: Lead[] = data && Array.isArray(data.leads) ? data.leads : [];
  
  // Debug: Log all received data
  useEffect(() => {
    if (data) {
      console.log("📊 Raw API Response Data:", data);
      console.log("📋 Total Leads:", leads.length);
      console.log("✅ Active Leads (activeLead === true):", leads.filter(l => l?.activeLead === true).length);
      console.log("❌ Fallback Leads (activeLead !== true):", leads.filter(l => l?.activeLead !== true).length);
      console.log("🔍 First Lead Sample:", leads[0]);
    }
  }, [data, leads]);
  
  // Filter leads by activeLead field
  const activeLeads = leads.filter((l) => l && l.activeLead === true);
  const fallbackLeads = leads.filter((l) => l && l.activeLead !== true);
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
        console.log(`⏱️ Lead ${lead.id}: timerExpiresAt=${lead.timerExpiresAt}, remainingTime=${remainingTime}s`);
      }
    });

    // Debug: Log timer initialization
    console.log("🕐 Timer Initialization:", {
      displayLeadsCount: displayLeads.length,
      activeTab: activeTab,
      newTimersCount: Object.keys(newTimers).length,
      newTimers: newTimers,
      sampleLead: displayLeads[0],
    });

    // Set initial timers if there are new leads
    if (Object.keys(newTimers).length > 0) {
      console.log("✅ Setting new timers:", newTimers);
      setLeadTimers((prev) => ({ ...prev, ...newTimers }));
    } else {
      console.log("⚠️ No new timers to set - timers already initialized");
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
      const res = await claimLeadWithPayment(String(leadId));
      if (res.status !== "success") {
        throw new Error(res.message || "Failed to claim lead.");
      }
      return res;
    },
    onSuccess: (_, leadId) => {
      // Mark lead as claimed to stop timer
      setClaimedLeads(prev => new Set(prev).add(leadId as number));
      
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

  const handleClaimWithPayment = (lead: Lead) => {
    setSelectedLeadForPayment(lead);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (leadId: string | number) => {
    claimLeadMutation(leadId);
    setShowPaymentModal(false);
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
                ? "bg-[#968470] text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Active Leads ({activeLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("fallback")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "fallback"
                ? "bg-[#968470] text-white shadow-sm"
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
            let formattedDate = lead.date || "Unknown Date";
            let formattedTime = lead.time || "Unknown Time";
            const dateTimeString = parseLeadDateTime(lead.date, lead.time);
            if (dateTimeString) {
              try {
                const parsedDate = parseISO(dateTimeString);
                if (parsedDate && !isNaN(parsedDate.getTime())) {
                  formattedDate = format(parsedDate, "EEE, MMM d");
                  formattedTime = format(parsedDate, "h:mm a");
                }
              } catch (error) {
                console.error("Date parsing error:", error);
              }
            }

            // Calculate time ago from createdAt (camelCase)
            const timeAgo = getTimeAgo(lead.createdAt);

            // Timer display
            const timerValue = leadTimers[lead.id];
            let timerDisplay = "Expired";
            
            // Don't show timer or expired status for:
            // 1. Leads that were just claimed (in claimedLeads Set)
            // 2. Leads already in Active tab (already claimed in database)
            if (claimedLeads.has(lead.id) || (activeTab === "active" && lead.activeLead)) {
              timerDisplay = "Claimed";
            } else if (timerValue !== undefined && timerValue > 0) {
              const min = Math.floor(timerValue / 60);
              const sec = timerValue % 60;
              timerDisplay = `${min.toString().padStart(2, "0")}:${sec
                .toString()
                .padStart(2, "0")}`;
            }
            
            // Debug: Log timer info
            console.log(`📍 Lead ${lead.id} Display:`, {
              timerExpiresAt: lead.timerExpiresAt,
              timerValue: timerValue,
              timerDisplay: timerDisplay,
              activeTab: activeTab,
              activeLead: lead.activeLead,
              isClaimed: claimedLeads.has(lead.id),
            });

            return activeTab === "active" ? (
              <ActiveLeadCard
                key={lead.id}
                leadId={String(lead.id)}
                name={`${lead.buyer.first_name} ${lead.buyer.last_name}`}
                price={`$${(lead.post?.price || 0).toLocaleString()}`}
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
                leadId={lead.id}
                name={`${lead.buyer.first_name} ${lead.buyer.last_name}`}
                price={`$${(lead.post?.price || 0).toLocaleString()}`}
                address={lead.post?.location || "Unknown Address"}
                date={formattedDate}
                time={formattedTime}
                claimPrice=""
                dateTime={dateTimeString || ""}
                onCancel={() => cancelLeadMutation(lead.id)}
                onClaim={() => handleClaimWithPayment(lead)}
                onClaimWithPayment={() => handleClaimWithPayment(lead)}
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

      {/* Claim Lead Payment Modal */}
      {selectedLeadForPayment && (
        <ClaimLeadPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLeadForPayment(null);
          }}
          leadId={selectedLeadForPayment.id}
          agentId={selectedLeadForPayment.agentId}
          propertyPrice={selectedLeadForPayment.post.price}
          buyerName={`${selectedLeadForPayment.buyer.first_name} ${selectedLeadForPayment.buyer.last_name}`}
          address={selectedLeadForPayment.post?.location || "Unknown Address"}
          onPaymentSuccess={handlePaymentSuccess}
          isLoading={claimingId === selectedLeadForPayment.id}
        />
      )}
    </div>
  );
}

function LeadManagementContent() {
  return <LeadManagementPage />;
}

export default function LeadManagementPageWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <LeadManagementContent />
    </Elements>
  );
}