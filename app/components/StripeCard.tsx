"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmModal from "./Modal/ConfirmModal";

const StripeCard = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  return (
    <>
      <>
        <Card>
          <CardContent className="lg:p-4 p-0 space-y-4">
            <h3 className="text-lg font-semibold text-[#414651]">
              Payment Methods
            </h3>
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
              {/* Remove Payment Confirmation Dialog */}
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
            <div className="flex justify-center border border-gray-300 rounded-md p-3">
              <Button className="inline-flex items-center justify-center bg-[#6F8375] hover:bg-[#5a6b61] text-white">
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>
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
    </>
  );
};

export default StripeCard;
