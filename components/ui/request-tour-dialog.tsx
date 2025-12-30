"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Phone,
  Mail,
  DollarSign,
  User,
  Link,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { bookTourService } from "@/app/services/bookTour.service";

interface RequestTourDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  post?: any;
}

// Stripe Card Element Options
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

// Payment Form Component (uses Stripe hooks)
function PaymentFormContent({
  post,
  selectedDate,
  selectedTime,
  consentChecked,
  onSuccess,
  onCancel,
}: {
  post: any;
  selectedDate: Date | null;
  selectedTime: string;
  consentChecked: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const handleBookTour = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet");
      return;
    }

    if (!cardComplete) {
      toast.error("Please complete your card details");
      return;
    }

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder name");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Payment Method with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card element not found");
        setLoading(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        toast.error(error.message || "Payment method creation failed");
        setLoading(false);
        return;
      }

      // Step 2: Get user IP address
      let userIp = "";
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        userIp = data.ip || "";
      } catch {
        console.log("Could not fetch IP");
      }

      const consentDetails = {
        consentChecked,
        consentDate: new Date().toISOString(),
        userIp,
        disclosureText: `By submitting this form, you consent to be contacted by ${
          post?.name || "the agent/company"
        } at the number/email you provide. Your consent is not required to buy property. You may opt out at any time.`,
      };

      // Step 3: Prepare payload for backend
      const payload = {
        postId: post?.id,
        agentId: post?.agentId || post?.userId || post?.agent?.id,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        consent: consentDetails,
        paymentMethodId: paymentMethod.id, // Send payment method ID to backend
      };

      // Step 4: Send to backend (backend will confirm payment and create tour)
      const response = await bookTourService(payload, "", "");

      if (response.status === "success") {
        toast.success("Tour booked and payment successful!");
        onSuccess();
      } else {
        toast.error(response.message || "Failed to book tour");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-[#181D27] font-medium mb-2">Property Location</p>
          <p className="text-gray-600">
            {post?.location || "123 Main Street, Austin, TX"}
          </p>
        </div>

        <div>
          <p className="text-[#181D27] font-medium mb-2">Agent Name</p>
          <p className="text-gray-600">{post?.name || "Full Name"}</p>
        </div>

        <div>
          <p className="text-[#181D27] font-medium mb-2">Tour Request</p>
          <p className="text-gray-600">
            {selectedDate?.toDateString()} - {selectedTime}
          </p>
        </div>

        <p className="inline-flex items-center text-[#064E3B] bg-[#ECFDF5] rounded-md p-1 font-semibold text-lg">
          $2.00
        </p>

        {/* Stripe Payment Form */}
        <div className="space-y-4 mb-6 border-t pt-3">
          <div className="space-y-2">
            <Label>Cardholder Name</Label>
            <Input
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Card Details</Label>
            <div className="border rounded-md p-3 bg-white">
              <CardElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(event) => {
                  setCardComplete(event.complete);
                }}
              />
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg
                className="w-4 h-4"
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
              Secured by Stripe • Your payment information is encrypted
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-col gap-2 mt-4 w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="w-full bg-[#6F8375] hover:bg-[#5b6c62] text-white"
          onClick={handleBookTour}
          disabled={loading || !stripe || !cardComplete}
        >
          {loading ? "Processing Payment..." : "Book a Tour"}
        </Button>
      </DialogFooter>
    </>
  );
}

// Main Dialog Component
export function RequestTourDialog({
  isOpen,
  onClose,
  post,
}: RequestTourDialogProps) {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [startIndex, setStartIndex] = useState(0);

  // Consent checkbox and storage
  const [consentChecked, setConsentChecked] = useState(false);

  // Step management
  const [openRequest, setOpenRequest] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openAgentDialog, setOpenAgentDialog] = useState(false);

  // Generate dates
  const generateDates = (numDays: number) => {
    const today = new Date();
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return { day, date: dateStr };
    });
  };

  const [dates] = useState(() => generateDates(14));
  const visibleDates = dates.slice(startIndex, startIndex + 3);

  const handlePrev = () => setStartIndex((p) => Math.max(p - 1, 0));
  const handleNext = () =>
    setStartIndex((p) => Math.min(p + 1, dates.length - 3));

  // Handle Apply button (open Agent Details modal)
  const handleApply = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    setOpenAgentDialog(true);
  };

  // Reset state when dialogs close
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedTime("");
      setIsTimePickerOpen(false);
      setConsentChecked(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* ---------------- MAIN TOUR REQUEST FORM ---------------- */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-full h-[95vh] rounded-lg hide-scrollbar"
          style={{
            maxHeight: "95vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 text-left">
              Request a Tour
            </DialogTitle>
          </DialogHeader>

          {/* Property Info */}
          <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 p-0 lg:p-4">
            <Image
              src={post?.image || "/images/tour.png"}
              alt="House"
              width={150}
              height={100}
              className="rounded-md w-full sm:w-[150px] h-[150px] sm:h-[100px] object-cover"
            />
            <div className="grid gap-1 text-sm flex-1">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{post?.location}</span>
              </div>
              <div className="text-gray-500">{post?.city}</div>
              <div className="flex items-center gap-2 pt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={post?.profile_pic || "/images/agent.png"}
                    alt="Agent"
                  />
                  <AvatarFallback>
                    {`${post?.first_name?.[0] || ""}${
                      post?.last_name?.[0] || ""
                    }`}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">{post?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 pt-2">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" /> {post?.bedrooms}
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {post?.bathrooms}
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" /> 400
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
            <Lightbulb className="h-4 w-4 flex-shrink-0 mt-1" />
            <span>
              Tip: Selecting multiple times helps schedule your tour faster
            </span>
          </div>

          {/* Date Selection */}
          <div className="grid gap-2 mt-4">
            <Label className="text-sm font-medium text-gray-700">
              Select Date
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                disabled={startIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-3 justify-center flex-1 overflow-x-auto sm:overflow-visible">
                {visibleDates.map((dateItem) => {
                  const isSelected =
                    selectedDate?.toDateString() ===
                    new Date(dateItem.date).toDateString();
                  return (
                    <Button
                      key={dateItem.date}
                      variant="outline"
                      className={cn(
                        "flex-shrink-0 flex flex-col items-center justify-center h-20 w-28 rounded-lg border",
                        isSelected
                          ? "border-[#6B8E6E] bg-[#F0F4F0]"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedDate(new Date(dateItem.date))}
                    >
                      <span className="text-xs font-semibold">
                        {dateItem.day}
                      </span>
                      <span className="text-sm">{dateItem.date}</span>
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={startIndex + 3 >= dates.length}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Time Picker */}
          <div className="grid gap-2 mt-4 relative">
            <Label className="text-sm font-medium text-gray-700">
              Select Time
            </Label>
            <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="selectTime"
                    placeholder="09:00 AM"
                    value={selectedTime}
                    readOnly
                    className="border-gray-300 pr-10 cursor-pointer"
                    onClick={() => setIsTimePickerOpen(true)}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </PopoverTrigger>

              <PopoverContent className="p-3 w-[220px] space-y-2">
                <TimePicker
                  value={selectedTime}
                  onTimeChange={setSelectedTime}
                />
                <Button
                  type="button"
                  size="sm"
                  className="w-full bg-[#6B8E6E] text-white hover:bg-[#5b6c62]"
                  onClick={() => setIsTimePickerOpen(false)}
                >
                  OK
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-[#6B8E6E] text-white hover:bg-[#5b6c62]"
              onClick={handleApply}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- AGENT DETAILS POPUP ---------------- */}
      <Dialog open={openAgentDialog} onOpenChange={setOpenAgentDialog}>
        <DialogContent className="max-w-md w-full rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Agent Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post?.profile_pic || "/images/agent.png"}
                  alt="Agent"
                />
                <AvatarFallback>{`${post?.first_name?.[0] || ""}${
                  post?.last_name?.[0] || ""
                }`}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-gray-800 text-lg">
                {post?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span>{post?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span>{post?.email || "N/A"}</span>
            </div>
            {/* Opt-in Checkbox for U.S. law compliance */}
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="accent-[#6F8375] w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  I agree to receive calls and/or SMS from{" "}
                  {post?.name || "the agent/company"} about this property and
                  real-estate services.
                </span>
              </label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-[#6F8375] hover:bg-[#5b6c62] text-white"
              onClick={() => {
                setOpenAgentDialog(false);
                setOpenRequest(true);
              }}
              disabled={!consentChecked}
            >
              Continue to Book Tour
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setOpenAgentDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- REQUEST PAYMENT MODAL (WITH STRIPE) ---------------- */}
      <Dialog open={openRequest} onOpenChange={setOpenRequest}>
        <DialogContent
          className="w-full h-[95vh] rounded-lg hide-scrollbar"
          style={{
            maxHeight: "95vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            background: "#fff",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Request Tour
            </DialogTitle>
          </DialogHeader>

          {/* Payment Form Component with Stripe */}
          <PaymentFormContent
            post={post}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            consentChecked={consentChecked}
            onSuccess={() => {
              setOpenRequest(false);
              setOpenSuccess(true);
            }}
            onCancel={() => setOpenRequest(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ---------------- SUCCESS MODAL ---------------- */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent className="w-full max-w-[95%] sm:max-w-md rounded-lg text-center">
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle2 className="text-green-600 w-12 h-12" />
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Payment Successful Tour Booked
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              Congratulations! This tour booking is now yours exclusively. Check
              your Active Tours screen for next steps.
            </p>
          </div>

          <div className="border rounded-lg p-4 mt-4 text-left text-sm space-y-3">
            <div className="space-y-3">
              <p className="font-semibold text-[#434342] mb-2">
                Agent Details
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{post?.name || "John Slame"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{post?.phone || "+92 1221 0291"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{post?.email || "sarah.johnson@gmail.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>2.00</span>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[#434342] mb-2">
                Property Information
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {post?.location || "123 Oak Street, Beverly Hills, CA"}
                </span>
              </div>
              <Button variant="link" className="text-gray-600 px-0">
                <Link className="w-3 h-3 mr-2" />
                View Property Details
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button className="w-full bg-[#6F8375] hover:bg-[#5b6c62] text-white">
              Call Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}