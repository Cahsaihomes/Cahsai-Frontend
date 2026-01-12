"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useMlsToken from "@/hooks/usemls";
import type { Property } from "@/hooks/usemls";

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyDetailClient id={params.id} />;
}

function PropertyDetailClient({ id }: { id: string }) {
  const { token, properties, fetchProperties, loadingProperties } = useMlsToken();
  const decodedId = decodeURIComponent(id);
  // helper to match a property by multiple possible keys
  const findInList = (val: string) => properties.find((p) => p.id === val || p.listingId === val || p.listingKey === val) ?? null;
  const [localProperty, setLocalProperty] = useState<Property | null>(() => findInList(decodedId));

  useEffect(() => {
    // if list empty but token exists, fetch list
    if (!properties.length && token) fetchProperties();
    // keep localProperty updated from list using multiple id keys
    const p = findInList(decodedId);
    if (p) setLocalProperty(p);
  }, [token, properties.length, properties, decodedId, fetchProperties]);

  if (!token) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-600 mb-4">Not connected to MLS. Please connect first to view property details.</div>
        <Link href="/agentdashboard/connectmls/properties" className="text-blue-600 underline">Back</Link>
      </div>
    );
  }

  if (loadingProperties && !localProperty) {
    return <div className="p-6 text-center text-sm text-gray-600">Loading property...</div>;
  }

  if (!localProperty) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-600 mb-4">Property not found. Try refreshing properties.</div>
        <button onClick={() => fetchProperties()} className="px-3 py-2 rounded bg-slate-100">Refresh</button>
        <div className="mt-4"><Link href="/agentdashboard/connectmls/properties" className="text-blue-600 underline">Back</Link></div>
      </div>
    );
  }

  const property = localProperty;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/agentdashboard/connectmls/properties" className="text-sm text-blue-600 underline">Back to Listings</Link>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="w-full h-72 flex items-center justify-center bg-gray-100 text-gray-500 rounded">
              <div className="text-sm">Images removed from preview</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">{property.address || property.id}</h2>
            <div className="text-lg text-gray-700 mb-2">{property.listPrice ? `$${property.listPrice.toLocaleString()}` : "Price N/A"}</div>
            <div className="text-sm text-gray-500 mb-4">{property.mlsStatus ? property.mlsStatus.toUpperCase() : ""} • MLS: {property.listingId || property.listingKey || property.id}</div>

            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Beds:</strong> {property.beds ?? "-"}</div>
              <div><strong>Baths:</strong> {property.baths ?? "-"}</div>
              <div><strong>Area:</strong> {property.livingArea ? `${property.livingArea} sqft` : "-"}</div>
              <div><strong>Year:</strong> {property.yearBuilt ?? "-"}</div>
              <div><strong>Coordinates:</strong> {property.latitude && property.longitude ? `${property.latitude}, ${property.longitude}` : "N/A"}</div>
              {property.raw?.description && <div className="mt-2"><strong>Description:</strong> <div className="text-sm text-gray-600">{property.raw.description}</div></div>}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <h3 className="font-medium mb-2">Raw data</h3>
          <pre className="text-xs text-gray-700 max-h-64 overflow-auto">{JSON.stringify(property.raw, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}