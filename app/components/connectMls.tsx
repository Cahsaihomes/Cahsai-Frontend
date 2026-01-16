"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useMlsToken from "@/hooks/usemls";
import { ChevronRight, Check } from "lucide-react";
import { RootState } from "@/app/redux";
import DetailedListingCard from "@/components/ui/detailed-listing-card";

import type { Property } from "@/hooks/usemls";

type Props = {
  initialProperty?: Property | null;
};

const ConnectMls = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(props.initialProperty ?? null);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [showSavedTable, setShowSavedTable] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const agentId = user?.id || (user as any)?.user_id || (user as any)?._id;

  const {
    token,
    loading,
    generateToken,
    properties,
    fetchProperties,
    loadingProperties,
    savedProperties,
    fetchSavedProperties,
    loadingSaved,
    importProperties,
    importing,
    disconnect,
  } = useMlsToken();

  // Debug: Log agentId
  useEffect(() => {
    console.log("=== AGENT ID DEBUG ===");
    console.log("Full User Object:", user);
    console.log("User ID (user.id):", user?.id);
    console.log("Extracted Agent ID:", agentId);
    console.log("User Type:", typeof user);
    console.log("User Keys:", user ? Object.keys(user) : "No user");
    console.log("========================");
  }, [user, agentId]);

  // Initialize activeStep: if token exists, show step 4 (simplified view), otherwise show step 1
  useEffect(() => {
    if (token) {
      console.log("Token exists, showing simplified view (Step 4)");
      setActiveStep(4);
    } else {
      console.log("No token, showing token form (Step 1)");
      setActiveStep(1);
    }
  }, []);

  // Auto-load saved properties on mount or when agentId changes
  useEffect(() => {
    if (token && agentId) {
      console.log("Auto-loading saved properties for agentId:", agentId);
      fetchSavedProperties(agentId);
    }
  }, [token, agentId, fetchSavedProperties]);

  // Step 1: Get Token
  const handleGetToken = async () => {
    if (!clientId || !clientSecret) return toast.error("Please provide both Client ID and Client Secret.");

    const payload = {
      MLS_GRANT_TYPE: "client_credentials",
      MLS_CLIENT_ID: clientId,
      MLS_CLIENT_SECRET: clientSecret,
      MLS_SCOPE: "OData",
    };

    const tokenResult = await generateToken(payload);
    if (tokenResult) {
      setActiveStep(2);
      toast.success("Token acquired! Now fetch and save properties.");
    }
  };

  // Step 2: Fetch & Save Properties
  const handleFetchAndSave = async () => {
    setDebugError(null);
    console.log("=== STEP 2: Fetch & Save Properties ===");
    console.log("Token:", token ? "✓ Present" : "✗ Missing");
    console.log("AgentId:", agentId ? `✓ ${agentId}` : "✗ Missing");
    
    if (!token) {
      const msg = "No token. Get token first.";
      setDebugError(msg);
      toast.error(msg);
      return;
    }
    if (!agentId) {
      const msg = "User ID not found. Please log in again.";
      setDebugError(msg);
      toast.error(msg);
      console.error("Failed to extract agentId from user:", user);
      return;
    }
    
    try {
      // Fetch properties from MLS (backend also saves them to DB)
      console.log("Fetching properties from MLS with agentId:", agentId);
      setDebugError("Fetching properties from MLS and saving to database...");
      
      const result = await fetchProperties(token, agentId);
      console.log("Fetch result:", result);
      
      if (!result.ok) {
        const msg = `Failed to fetch properties: ${result.error}`;
        setDebugError(msg);
        toast.error(msg);
        return;
      }

      if (!result.properties || result.properties.length === 0) {
        const msg = "No properties found. Check your MLS credentials or API configuration.";
        setDebugError(msg);
        toast.warning(msg);
        return;
      }

      console.log(`✅ Success! Found and saved ${result.properties.length} properties`);
      setDebugError(null);
      
      // Move to step 3 - view saved properties
      setActiveStep(3);
      toast.success(`Properties fetched and saved! (${result.properties.length} listings)`);
    } catch (err) {
      const errMsg = (err as any)?.message || JSON.stringify(err);
      console.error("Error in handleFetchAndSave:", err);
      setDebugError(`Error: ${errMsg}`);
      toast.error("An unexpected error occurred. Check the debug message below.");
    }
  };

  // Step 3: View Saved Properties
  const handleViewSaved = async () => {
    const result = await fetchSavedProperties(agentId);
    if (result.ok) {
      setShowSavedTable(true);
      setActiveStep(4);
    } else {
      toast.error(result.error || "Failed to load saved properties");
    }
  };

  // Handle disconnect and reset everything
  const handleDisconnect = async () => {
    setReconnecting(true);
    try {
      disconnect();
      setClientId("");
      setClientSecret("");
      setActiveStep(1);
      setShowSavedTable(false);
      setSelectedProperty(null);
      toast.success("Disconnected. You can now reconnect.");
    } catch (err) {
      toast.error("Error during disconnect");
      console.error("Disconnect error:", err);
    } finally {
      setReconnecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* STEP-BY-STEP VIEW: Show until Step 4 is complete */}
      {activeStep < 4 && (
        <>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: "Get Token", icon: "1️⃣" },
            { step: 2, label: "Fetch & Save", icon: "2️⃣" },
            { step: 3, label: "View Saved", icon: "3️⃣" },
            { step: 4, label: "Done", icon: "4️⃣" },
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                  activeStep >= s.step
                    ? "bg-[#968470] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {activeStep >= s.step ? <Check size={24} /> : s.step}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm">{s.label}</p>
              </div>
              {idx < 3 && (
                <ChevronRight
                  size={24}
                  className={`ml-auto mr-4 ${
                    activeStep > s.step ? "text-[#968470]" : "text-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Get Token */}
      {activeStep >= 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">1️⃣</span>
            <h2 className="text-xl font-bold">Get Token</h2>
            {token && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Connected</span>}
          </div>

          {!token ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                <Input
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter your MLS Client ID"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                <Input
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Enter your MLS Client Secret"
                  type="password"
                  disabled={loading}
                />
              </div>

              <Button
                onClick={handleGetToken}
                disabled={loading || !clientId || !clientSecret}
                className="w-full bg-[#968470] hover:bg-[#7a6d5e] text-white"
              >
                {loading ? "Getting Token..." : "Get Token"}
              </Button>
            </div>
          ) : (
            <div className="bg-[#E8F1E8] border border-[#968470] rounded p-4">
              <p className="text-[#968470] text-sm">
                ✓ Token acquired successfully! Proceed to Step 2.
              </p>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={reconnecting}
                className="mt-4 w-full border-[#968470] text-[#968470] hover:bg-[#968470] hover:text-white"
              >
                {reconnecting ? "Disconnecting..." : "Disconnect & Start Over"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Fetch & Save Properties */}
      {activeStep >= 2 && token && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">2️⃣</span>
            <h2 className="text-xl font-bold">Fetch & Save Properties</h2>
            {activeStep > 2 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Complete</span>}
          </div>

          {activeStep === 2 ? (
            <div>
              <p className="text-gray-600 mb-4">
                Click below to fetch properties from MLS and save them to your database.
              </p>
              {!agentId && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-red-700 text-sm font-semibold">⚠️ Error: Agent ID not found</p>
                  <p className="text-red-600 text-xs mt-1">Please log out and log back in to refresh your session.</p>
                  <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-auto max-h-48">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
              {/* {agentId && (
                <div className="bg-[#E8F1E8] border border-[#968470] rounded p-3 mb-4">
                  <p className="text-[#968470] text-xs font-bold">✓ Agent ID: {agentId}</p>
                </div>
              )} */}
              <Button
                onClick={handleFetchAndSave}
                disabled={loadingProperties || !agentId || !token}
                className="w-full bg-[#968470] hover:bg-[#7a6d5e] text-white disabled:bg-gray-400"
              >
                {loadingProperties ? "Fetching & Saving..." : "Fetch & Save Properties"}
              </Button>
              {/* {debugError && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                  <p className="text-yellow-700 text-sm font-semibold">Debug Info:</p>
                  <p className="text-yellow-800 text-xs mt-1">{debugError}</p>
                </div>
              )} */}
              {loadingProperties && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700 text-sm">Fetching properties from MLS...</p>
                </div>
              )}
              {properties.length > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  Found {properties.length} properties
                </p>
              )}
            </div>
          ) : (
            <div className="bg-[#E8F1E8] border border-[#968470] rounded p-4">
              <p className="text-[#968470] text-sm">
                ✓ {properties.length} properties fetched and saved! Proceed to Step 3.
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: View Saved Properties */}
      {activeStep >= 3 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">3️⃣</span>
            <h2 className="text-xl font-bold">View Saved Properties</h2>
          </div>

          {!showSavedTable ? (
            <div>
              <p className="text-gray-600 mb-4">
                Click below to view all properties saved to your database.
              </p>
              <Button
                onClick={handleViewSaved}
                disabled={loadingSaved}
                className="w-full bg-[#968470] hover:bg-[#7a6d5e] text-white"
              >
                {loadingSaved ? "Loading..." : "View Saved Properties"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3">Address</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Beds</th>
                    <th className="text-left p-3">Baths</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {savedProperties.length > 0 ? (
                    savedProperties.map((p: Property) => (
                      <tr
                        key={p.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedProperty(p)}
                      >
                        <td className="p-3 font-medium">{p.address || p.id}</td>
                        <td className="p-3">
                          {p.listPrice ? `$${p.listPrice.toLocaleString()}` : "N/A"}
                        </td>
                        <td className="p-3">{p.beds ?? "-"}</td>
                        <td className="p-3">{p.baths ?? "-"}</td>
                        <td className="p-3">
                          <span className="text-xs bg-[#F0F4F0] text-[#968470] px-3 py-1 rounded-full font-semibold">
                            {p.mlsStatus ? p.mlsStatus.toUpperCase() : "LISTING"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-500">
                        No saved properties found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedProperty.address || selectedProperty.id}</h3>
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-bold text-gray-800">
                {selectedProperty.listPrice ? `$${selectedProperty.listPrice.toLocaleString()}` : "Price N/A"}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Beds:</strong> {selectedProperty.beds ?? "-"}
                </div>
                <div>
                  <strong>Baths:</strong> {selectedProperty.baths ?? "-"}
                </div>
                <div>
                  <strong>Area:</strong> {selectedProperty.livingArea ? `${selectedProperty.livingArea} sqft` : "-"}
                </div>
                <div>
                  <strong>Year:</strong> {selectedProperty.yearBuilt ?? "-"}
                </div>
                <div className="col-span-2">
                  <strong>Status:</strong> {selectedProperty.mlsStatus ? selectedProperty.mlsStatus.toUpperCase() : "LISTING"}
                </div>
                <div className="col-span-2">
                  <strong>MLS ID:</strong> {selectedProperty.listingId || selectedProperty.listingKey || selectedProperty.id}
                </div>
                {selectedProperty.latitude && selectedProperty.longitude && (
                  <div className="col-span-2">
                    <strong>Coordinates:</strong> {selectedProperty.latitude}, {selectedProperty.longitude}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* SIMPLIFIED VIEW: If already connected and completed all steps, just show listings and refresh */}
      {activeStep === 4 && token && (
        <div className="space-y-6">
          {/* Connected Header */}
          <div className="flex items-center justify-between bg-[#F0F4F0] border border-[#968470] rounded-lg p-4">
            <div>
              <h2 className="text-xl font-bold text-[#968470]"> MLS Connected</h2>
              {/* <p className="text-sm text-[#7a6d5e]">Agent ID: {agentId}</p> */}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fetchSavedProperties(agentId)}
                disabled={loadingSaved}
                className="bg-[#968470] hover:bg-[#7a6d5e] text-white"
              >
                {loadingSaved ? "Refreshing..." : "Refresh Properties"}
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={reconnecting}
                variant="outline"
                className="border-[#968470] text-[#968470] hover:bg-[#968470] hover:text-white"
              >
                {reconnecting ? "Disconnecting..." : "Disconnect"}
              </Button>
            </div>
          </div>

          {/* Properties Listing */}
          <div>
            {loadingSaved ? (
              <div className="py-12 text-center text-gray-500">Loading properties...</div>
            ) : savedProperties.length > 0 ? (
              <>
              
          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProperties.map((p: Property) => (
                  <div key={p.id} className="relative">
                    <DetailedListingCard
                      id={p.id}
                      images={ p.photos ? p.photos : ["/images/placeholder.jpg"]}
                      price={p.listPrice ? `$${p.listPrice.toLocaleString()}` : "Price N/A"}
                      tags={[p.mlsStatus || "LISTING"]}
                      agentName={p.agentName || "MLS Property"}
                      agentAvatarUrl={p.agentImage || "/images/agent-placeholder.png"}
                      bedrooms={p.beds ? p.beds.toString() : "-"}
                      bathrooms={p.baths ? p.baths.toString() : "-"}
                      area={p.livingArea ? `${p.livingArea.toLocaleString()} sqft` : "N/A"}
                      location={p.address || "Location N/A"}
                      description={`Year Built: ${p.yearBuilt || "N/A"}`}
                      topBadgeText={p.mlsStatus ? p.mlsStatus.toUpperCase() : "LISTING"}
                      onToggleSave={() => setSelectedProperty(p)}
                    />
                    {/* View Details Button Overlay */}
                    <Button
                      onClick={() => setSelectedProperty(p)}
                      className="absolute bottom-4 left-4 right-4 bg-[#968470] hover:bg-[#7a6d5e] text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>                </>            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <p>No properties found. Click refresh to load your listings.</p>
              </div>
            )}
          </div>

          {/* Property Detail Modal */}
          {selectedProperty && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedProperty.address || selectedProperty.id}</h3>
                  <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                    Close
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="text-lg font-bold text-gray-800">
                    {selectedProperty.listPrice ? `$${selectedProperty.listPrice.toLocaleString()}` : "Price N/A"}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Beds:</strong> {selectedProperty.beds ?? "-"}
                    </div>
                    <div>
                      <strong>Baths:</strong> {selectedProperty.baths ?? "-"}
                    </div>
                    <div>
                      <strong>Area:</strong> {selectedProperty.livingArea ? `${selectedProperty.livingArea} sqft` : "-"}
                    </div>
                    <div>
                      <strong>Year:</strong> {selectedProperty.yearBuilt ?? "-"}
                    </div>
                    <div className="col-span-2">
                      <strong>Status:</strong> {selectedProperty.mlsStatus ? selectedProperty.mlsStatus.toUpperCase() : "LISTING"}
                    </div>
                    <div className="col-span-2">
                      <strong>MLS ID:</strong> {selectedProperty.listingId || selectedProperty.listingKey || selectedProperty.id}
                    </div>
                    {selectedProperty.latitude && selectedProperty.longitude && (
                      <div className="col-span-2">
                        <strong>Coordinates:</strong> {selectedProperty.latitude}, {selectedProperty.longitude}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ConnectMls;