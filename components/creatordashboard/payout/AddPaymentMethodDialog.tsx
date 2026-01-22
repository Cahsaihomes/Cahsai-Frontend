"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentMethodData) => Promise<void>;
}

export interface PaymentMethodData {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export default function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddPaymentMethodDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentMethodData>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for card number - allow only digits
    if (name === "cardNumber") {
      const sanitized = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
      return;
    }

    // Special handling for CVV - allow only digits
    if (name === "cvv") {
      const sanitized = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cardholderName.trim()) {
      setError("Cardholder name is required");
      return false;
    }
    if (!formData.cardNumber.trim() || formData.cardNumber.length < 13) {
      setError("Valid card number (13-16 digits) is required");
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      setError("Expiry date is required");
      return false;
    }
    const month = parseInt(formData.expiryMonth);
    if (month < 1 || month > 12) {
      setError("Invalid expiry month");
      return false;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError("Valid CVV (3-4 digits) is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData({
        cardholderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to Add Account");
    } finally {
      setLoading(false);
    }
  };

  // Generate year options (current year + 20 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <DialogTitle>Add Payment Card</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber
                  .replace(/\s/g, "")
                  .replace(/(\d{4})/g, "$1 ")
                  .trim()}
                onChange={handleChange}
                disabled={loading}
                autoComplete="cc-number"
                maxLength={19}
              />
              <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">13-16 digits</p>
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-3 gap-4">
            {/* Expiry Month */}
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Month</Label>
              <Input
                id="expiryMonth"
                name="expiryMonth"
                placeholder="MM"
                value={formData.expiryMonth}
                onChange={handleChange}
                disabled={loading}
                maxLength={2}
                autoComplete="cc-exp-month"
              />
            </div>

            {/* Expiry Year */}
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Year</Label>
              <select
                id="expiryYear"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expiryYear: e.target.value,
                  }))
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* CVV */}
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="•••"
                value={formData.cvv}
                onChange={handleChange}
                disabled={loading}
                maxLength={4}
                autoComplete="cc-csc"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-xs text-blue-800">
              🔒 Your card information is encrypted and secure. We use industry-standard SSL encryption to protect your data. Your card details are never stored on our servers.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#968470] hover:bg-[#7a6d5e]"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
