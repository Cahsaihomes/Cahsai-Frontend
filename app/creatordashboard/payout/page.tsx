"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Check,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PayoutHistoryTable from "@/app/components/creatordashboard/payout/payout-history";
import ConfirmModal from "@/app/components/Modal/ConfirmModal";

export default function DashboardPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const stats = [
    {
      title: "Pending Balance",
      value: "$125.00",
      badge: {
        text: "Processing",
        color: "bg-orange-100 text-orange-600",
        icon: Clock,
      },
    },
    {
      title: "Last Payout",
      value: "$300.00",
      badge: {
        text: "Feb 28, 2024",
        color: "bg-blue-100 text-blue-600",
        icon: CheckCircle,
      },
    },
    {
      title: "Next Payout",
      value: "Mar 15",
      badge: {
        text: "5 days left",
        color: "bg-purple-100 text-purple-600",
        icon: Calendar,
      },
    },
    {
      title: "Total Earnings",
      value: "$1,230",
      badge: {
        text: "This year",
        color: "bg-green-100 text-green-600",
        icon: DollarSign,
      },
    },
  ];

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
        <EarningsCardGrid stats={stats} />

        {/* Payment Methods Section */}
        <Card className="mt-6">
          <CardContent className="p-4 space-y-4 ">
            <h3 className="text-lg font-semibold text-[#414651]">
              Payment Methods
            </h3>

            {/* Payment Method Card */}
            <div className="p-4 border rounded-md flex items-center justify-between ">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/images/stripe.png"
                  alt="Stripe"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex-grow mx-4">
                <p className="font-medium text-[#414651]">Stripe</p>
                <p className="text-sm text-[#717680]">Bank Account •••• 4567</p>
                <div className="inline-flex items-center bg-green-100 p-2 rounded-md mt-1">
                  <Check className="w-4 h-4 text-green-700 mr-1" />
                  <span className="text-xs text-green-700">
                    Connected & Verified
                  </span>
                </div>
              </div>

              {/* Three Dots Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setShowConfirmDialog(true)}
                    className="text-black"
                  >
                    <Trash2 className="w-4 h-4 text-black mr-1" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Account Button */}
            <div className="flex justify-center border border-gray-300 rounded-md p-3">
              <Button className="inline-flex items-center justify-center bg-[#6F8375] hover:bg-[#5a6b61] text-white">
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <PayoutHistoryTable />
      </div>
      <ConfirmModal
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Remove Payment Method?"
        description="  Are you sure you want to remove this payment method? Once removed,
            you won't be able to receive payments through this account unless
            you reconnect it."
        cancelLabel="Cancel"
        confirmLabel="Remove"
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}
