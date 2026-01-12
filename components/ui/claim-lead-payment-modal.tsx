"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ClaimLeadPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | number;
  propertyPrice: number;
  buyerName: string;
  address: string;
  agentId?: string | number;
  onPaymentSuccess: (leadId: string | number) => void;
  isLoading?: boolean;
}

export default function ClaimLeadPaymentModal({
  isOpen,
  onClose,
  leadId,
  propertyPrice,
  buyerName,
  address,
  agentId,
  onPaymentSuccess,
  isLoading = false,
}: ClaimLeadPaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate 0.02% of property price
  const claimFee = propertyPrice * 0.0002; // 0.02%
  const minClaimFee = 0.50; // Stripe minimum is $0.50
  const finalClaimFee = Math.max(claimFee, minClaimFee); // Use whichever is higher
  const claimFeeInCents = Math.round(finalClaimFee * 100); // Convert to cents for Stripe

  // Get agentId from prop or localStorage
  const finalAgentId = agentId || localStorage.getItem("agentId");

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setCardComplete(false);
      setCardholderName("");
      setProcessing(false);
    }
  }, [isOpen]);

  const handleCardChange = (event: any) => {
    setError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter cardholder name");
      return;
    }

    if (!cardComplete) {
      setError("Please enter valid card details");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found");
        setProcessing(false);
        return;
      }

      // Step 1: Create payment method
      const { error: methodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        });

      if (methodError) {
        setError(methodError.message || "Failed to create payment method");
        setProcessing(false);
        return;
      }

      // Validate all required fields before sending
      if (!leadId || !finalAgentId || !claimFeeInCents) {
        setError("Missing required information. Please refresh and try again.");
        console.error("Missing fields:", { leadId, agentId: finalAgentId, claimFeeInCents });
        setProcessing(false);
        return;
      }

      // Step 2: Send to backend to handle payment intent creation and confirmation
      const claimResponse = await fetch("/api/claim-lead-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: claimFeeInCents,
          leadId: leadId,
          agentId: finalAgentId,
          propertyPrice: propertyPrice,
          paymentMethodId: paymentMethod.id,
          cardholderName: cardholderName,
        }),
      });

      if (!claimResponse.ok) {
        const errorData = await claimResponse.json();
        throw new Error(errorData.error || "Failed to claim lead");
      }

      const claimData = await claimResponse.json();

      if (claimData.status === "success") {
        toast.success(
          `Payment successful! Claimed lead for $${finalClaimFee.toFixed(2)}`
        );
        onPaymentSuccess(leadId);
        onClose();
      } else {
        setError(claimData.error || "Payment failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={processing || isLoading}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          <X size={18} className="text-gray-500" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Claim Lead
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Complete payment to claim this lead
        </p>

        {/* Lead Details */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Buyer
            </p>
            <p className="text-sm font-medium text-gray-900 truncate">{buyerName}</p>
          </div>
          
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Address
            </p>
            <p className="text-xs font-medium text-gray-900 line-clamp-2">
              {address}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-600">Property Price:</p>
              <p className="text-xs font-semibold text-gray-900">
                ${propertyPrice.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600">Claim Fee (0.02%):</p>
              <p className="text-base font-bold text-[#6F8375]">
                ${finalClaimFee.toFixed(2)}
              </p>
            </div>
            {finalClaimFee > claimFee && (
              <p className="text-xs text-gray-500 mt-1">
                (Minimum payment: $0.50)
              </p>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-3">
          {/* Cardholder Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent text-sm"
              disabled={processing || isLoading}
            />
          </div>

          {/* Card Element */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-[#6F8375] focus-within:border-transparent bg-white">
              <CardElement
                onChange={handleCardChange}
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "13px",
                      color: "#424242",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Secured by Stripe
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Payment Button */}
          <button
            type="submit"
            disabled={processing || isLoading || !cardComplete || !cardholderName.trim()}
            className="w-full bg-[#6F8375] text-white rounded-lg py-2 font-medium hover:bg-[#5a6b60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {processing || isLoading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              `Pay $${finalClaimFee.toFixed(2)} to Claim`
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={processing || isLoading}
            className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
