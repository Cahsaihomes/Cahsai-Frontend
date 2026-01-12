"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useMlsToken from "@/hooks/usemls";

export default function PropertiesPage() {
  const router = useRouter();
  const { token, properties, fetchProperties, loadingProperties } = useMlsToken();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">MLS Properties</h1>
        <div className="flex gap-2">
          <button onClick={() => fetchProperties()} disabled={!token || loadingProperties} className="px-3 py-2 rounded bg-slate-100">
            {loadingProperties ? "Fetching..." : "Refresh"}
          </button>
        </div>
      </div>

      { !token ? (
        <div className="text-sm text-gray-600">You must connect MLS first from Connect MLS panel.</div>
      ) : loadingProperties ? (
        <div className="py-8 text-center text-sm text-gray-500">Loading properties...</div>
      ) : properties.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <Link key={p.id} href={`/agentdashboard/connectmls/properties/${encodeURIComponent(p.id)}`}>
              <a className="block group">
                <div role="link" tabIndex={0} onClick={() => router.push(`/agentdashboard/connectmls/properties/${encodeURIComponent(p.id)}`)} onKeyDown={(e) => { if ((e as unknown as KeyboardEvent).key === 'Enter') router.push(`/agentdashboard/connectmls/properties/${encodeURIComponent(p.id)}`) }} className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-150">
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-500">
                    <div className="text-sm">Listing</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{p.mlsStatus ? p.mlsStatus.toUpperCase() : "LISTING"}</div>
                    <div className="font-semibold mb-1">{p.address || p.id}</div>
                    <div className="text-sm text-gray-700 mb-2">{p.listPrice ? `$${p.listPrice.toLocaleString()}` : "Price N/A"}</div>
                    <div className="text-xs text-gray-500">{p.beds ?? "-"} beds • {p.baths ?? "-"} baths {p.livingArea ? `• ${p.livingArea} sqft` : ""}</div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-500">No properties found. Connect MLS and fetch properties to see listings.</div>
      )}
    </div>
  );
}