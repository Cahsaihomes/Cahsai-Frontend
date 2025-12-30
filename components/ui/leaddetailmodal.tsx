"use client";

import { X, User, MapPin, Clock, Phone, Mail, DollarSign, Calendar } from "lucide-react";
import { useEffect } from "react";

interface Lead {
  id: number;
  status: string;
  date: string;
  time: string;
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

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

export default function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
            type="button"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {lead.status}
            </span>
          </div>

          {/* Buyer Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User size={18} />
              Buyer Information
            </h3>
            <div className="space-y-2 ml-6">
              <div className="flex items-start">
                <span className="text-sm text-gray-500 w-24">Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {lead.buyer.first_name} {lead.buyer.last_name}
                </span>
              </div>
              {lead.buyer.phone && (
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-24">Phone:</span>
                  <a
                    href={`tel:${lead.buyer.phone}`}
                    className="text-sm font-medium text-[#6F8375] hover:underline flex items-center gap-1"
                  >
                    <Phone size={14} />
                    {lead.buyer.phone}
                  </a>
                </div>
              )}
              {lead.buyer.email && (
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-24">Email:</span>
                  <a
                    href={`mailto:${lead.buyer.email}`}
                    className="text-sm font-medium text-[#6F8375] hover:underline flex items-center gap-1"
                  >
                    <Mail size={14} />
                    {lead.buyer.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={18} />
              Property Details
            </h3>
            <div className="space-y-2 ml-6">
              {lead.post.title && (
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-24">Title:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {lead.post.title}
                  </span>
                </div>
              )}
              <div className="flex items-start">
                <span className="text-sm text-gray-500 w-24">Price:</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <DollarSign size={14} />
                  {lead.post.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-500 w-24">Location:</span>
                <span className="text-sm font-medium text-gray-900">
                  {lead.post.location}
                </span>
              </div>
              {lead.post.description && (
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-24">Description:</span>
                  <p className="text-sm text-gray-700 flex-1">
                    {lead.post.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tour Schedule */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={18} />
              Tour Schedule
            </h3>
            <div className="space-y-2 ml-6">
              <div className="flex items-start">
                <span className="text-sm text-gray-500 w-24">Date:</span>
                <span className="text-sm font-medium text-gray-900">{lead.date}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-500 w-24">Time:</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Clock size={14} />
                  {lead.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          {lead.buyer.phone && (
            <a
              href={`tel:${lead.buyer.phone}`}
              className="flex-1 bg-[#6F8375] text-white py-2.5 rounded-lg hover:bg-[#5a6b60] transition-colors font-medium text-center flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Call Buyer
            </a>
          )}
          {lead.buyer.email && (
            <a
              href={`mailto:${lead.buyer.email}`}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              Email Buyer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}