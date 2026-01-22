"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import EarningsCardGrid from "@/app/components/creatordashboard/payout/earningcard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Calendar,
  CheckCircle,
  DollarSign,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PayoutHistoryTable from "@/app/components/creatordashboard/payout/payout-history";
import ConfirmModal from "@/app/components/Modal/ConfirmModal";
import { getCreatorDashboardStats } from "@/app/services/creatorDashboard.service";
import AddPaymentMethodDialog, {
  PaymentMethodData,
} from "@/components/creatordashboard/payout/AddPaymentMethodDialog";

interface PaymentMethod {
  id: string;
  cardholderName: string;
  cardBrand: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export default function DashboardPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Pending Balance",
      value: "Loading...",
      badge: {
        text: "Fetching data",
        color: "bg-gray-100 text-gray-600",
        icon: Clock,
      },
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayoutStats();
    fetchPaymentMethods();
  }, []);

  const fetchPayoutStats = async () => {
    try {
      setLoading(true);
      const response = await getCreatorDashboardStats();
      const data = response.data;

      const upcomingPayout = data.payouts[0]?.upcomingPayout || 0;
      const payoutDate = data.payouts[0]?.payoutDate || "TBD";
      const nextPayoutDate = new Date(payoutDate);
      const daysUntilPayout = Math.ceil(
        (nextPayoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const newStats = [
        {
          title: "Pending Balance",
          value: `$${upcomingPayout.toLocaleString()}`,
          badge: {
            text: "Processing",
            color: "bg-orange-100 text-orange-600",
            icon: Clock,
          },
        },
        {
          title: "Total Earnings",
          value: `$${data.totalEarnings.toLocaleString()}`,
          badge: {
            text: "All time",
            color: "bg-blue-100 text-blue-600",
            icon: CheckCircle,
          },
        },
        {
          title: "Next Payout",
          value:'',
          badge: {
            text: `${daysUntilPayout} days left`,
            color: "bg-purple-100 text-purple-600",
            icon: Calendar,
          },
        },
        {
          title: "Engagement Score",
          value: `${data.engagementScore.toFixed(1)}%`,
          badge: {
            text: "Performance",
            color: "bg-green-100 text-green-600",
            icon: DollarSign,
          },
        },
      ];
      setStats(newStats);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch payout stats:", err);
      setError("Failed to load payout data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true);
      // Placeholder for API call - replace with actual endpoint when available
      // const response = await getPaymentMethods();
      // setPaymentMethods(response.data);

      // For now, showing empty state - will be populated when API is connected
      setPaymentMethods([]);
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
      setPaymentMethods([]);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handleAddPaymentMethod = async (data: PaymentMethodData) => {
    try {
      // Placeholder for API call
      // const response = await addPaymentMethod(data);
      // setPaymentMethods([...paymentMethods, response.data]);

      console.log("Adding payment card:", data);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Detect card brand
      const getCardBrand = (cardNumber: string) => {
        if (cardNumber.startsWith("4")) return "Visa";
        if (cardNumber.startsWith("5")) return "Mastercard";
        if (cardNumber.startsWith("3")) return "American Express";
        if (cardNumber.startsWith("6")) return "Discover";
        return "Card";
      };

      // This will be replaced with actual API response
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        cardholderName: data.cardholderName,
        cardBrand: getCardBrand(data.cardNumber),
        lastFour: data.cardNumber.slice(-4),
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        isDefault: paymentMethods.length === 0,
      };

      setPaymentMethods([...paymentMethods, newPaymentMethod]);
    } catch (err: any) {
      throw new Error(err.message || "Failed to add payment card");
    }
  };

  const handleRemovePaymentMethod = async () => {
    try {
      // Placeholder for API call
      // await removePaymentMethod(selectedPaymentMethodId);

      setPaymentMethods(
        paymentMethods.filter((pm) => pm.id !== selectedPaymentMethodId)
      );
      setShowConfirmDialog(false);
      setSelectedPaymentMethodId(null);
    } catch (err) {
      console.error("Failed to remove payment method:", err);
    }
  };

  if (error) {
    return (
      <div className="bg-white w-full border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto">
        <div className="p-4 lg:p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
            Payout Dashboard
          </h1>
        </div>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white w-full border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto">
        {/* Header */}
        <div className="p-4 lg:p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
            Payout Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <EarningsCardGrid stats={stats} loading={loading} />

        {/* Payment Methods Section */}
        <Card className="mt-6">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-[#414651]">
              Payment Cards
            </h3>

            {loadingPaymentMethods ? (
              <div className="text-center text-gray-500 py-4">
                Loading payment cards...
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No payment cards added yet
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between"
                >
                  {/* Card Chip */}
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-md">
                    <span className="text-white font-bold text-2xl">◆</span>
                  </div>

                  {/* Card Details */}
                  <div className="flex-grow mx-6">
                    <p className="font-semibold text-[#414651] text-lg">
                      {method.cardBrand}
                    </p>
                    <p className="text-sm text-[#717680] font-mono">
                      •••• •••• •••• {method.lastFour}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-600">
                        {method.cardholderName}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">
                        Exp: {method.expiryMonth}/{method.expiryYear}
                      </span>
                      {method.isDefault && (
                        <>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="inline-flex items-center bg-blue-100 px-2 py-0.5 rounded text-xs font-medium text-blue-700">
                            Default
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-300 transition">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPaymentMethodId(method.id);
                          setShowConfirmDialog(true);
                        }}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}

            {/* Add Account Button */}
            <div className="flex justify-center border border-gray-300 rounded-md p-3 mt-4">
              <Button
                onClick={() => setShowAddPaymentDialog(true)}
                className="inline-flex items-center justify-center bg-[#968470] hover:bg-[#7a6d5e] text-white"
              >
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <PayoutHistoryTable />
      </div>

      {/* Add Payment Card Dialog */}
      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        onSubmit={handleAddPaymentMethod}
      />

      {/* Confirm Remove Dialog */}
      <ConfirmModal
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Remove Payment Card?"
        description="Are you sure you want to remove this payment card? Once removed, you won't be able to receive payments through this card unless you add it again."
        cancelLabel="Cancel"
        confirmLabel="Remove"
        onCancel={() => {
          setShowConfirmDialog(false);
          setSelectedPaymentMethodId(null);
        }}
        onConfirm={handleRemovePaymentMethod}
      />
    </>
  );
}
