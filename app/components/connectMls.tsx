"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useMlsToken, { Property, STORAGE_KEY } from "@/hooks/usemls";

type Props = {};

const ConnectMls = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const {
    token,
    loading,
    generateToken,
    properties,
    fetchProperties,
    loadingProperties,
    importProperties,
    importing,
    disconnect,
  } = useMlsToken();

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // keep selection in sync when properties change
  const resetSelection = (propsList: Property[]) => {
    const map: Record<string, boolean> = {};
    propsList.forEach((p) => (map[p.id] = false));
    setSelected(map);
  };

  // update selection when properties change
  useEffect(() => {
    if (properties?.length) resetSelection(properties);
    if (!properties?.length) setSelected({});
  }, [properties]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);

  const handleConnect = async () => {
    if (!clientId || !clientSecret) return toast.error("Please provide both Client ID and Client Secret.");

    // many MLS token endpoints expect form-encoded client credentials
    const payload = {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "OData",
    };

    const tokenResult = await generateToken(payload);
    if (tokenResult) {
      try {
        localStorage.setItem(STORAGE_KEY, tokenResult as string);
      } catch {
        /* ignore */
      }
      setOpen(false);
      setClientId("");
      setClientSecret("");
      // fetchProperties is triggered automatically by the hook when token is set,
      // but we can call explicitly to ensure fresh data
      await fetchProperties(tokenResult as string);
    }
  };

  const handleImport = async (all = false) => {
    const idsToImport = all ? properties.map((p) => p.id) : selectedIds;
    if (!idsToImport.length) return toast.error("Select at least one property to import");

    const res = await importProperties(idsToImport);
    if (!res.ok) {
      toast.error(res.error || "Import failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top toolbar: Connect / Import */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)}>{token ? "Reconnect MLS" : "Connect MLS"}</Button>
          <Button onClick={() => fetchProperties()} variant={"outline" as any} disabled={!token || loadingProperties}>
            {loadingProperties ? "Fetching..." : "Refresh Properties"}
          </Button>
          <Button onClick={() => handleImport(false)} disabled={!selectedIds.length || importing}>
            {importing ? "Importing..." : `Import Selected (${selectedIds.length})`}
          </Button>
          <Button onClick={() => handleImport(true)} disabled={!properties.length || importing}>
            {importing ? "Importing..." : `Import All (${properties.length})`}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {token && <div className="text-sm text-green-600">Connected</div>}
          {token && (
            <Button variant={"ghost" as any} onClick={() => disconnect()}>
              Disconnect
            </Button>
          )}
        </div>
      </div>

      {/* Properties list */}
      <div>
        {loadingProperties ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading properties...</div>
        ) : properties.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <div key={p.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={!!selected[p.id]} onChange={() => toggleSelect(p.id)} className="mt-1" />
                  <div className="flex-1">
                    {(p.photos?.length || p.image) && <img src={p.photos?.[0] || p.image} alt={p.address} className="w-full h-36 object-cover rounded mb-2" />}
                    <div className="font-medium">{p.address || p.id}</div>
                    <div className="text-sm text-gray-600">List: {p.listPrice ? `$${p.listPrice.toLocaleString()}` : "N/A"} {p.closePrice ? <>• Sold: <span className="font-medium">${p.closePrice.toLocaleString()}</span></> : null}</div>
                    <div className="text-sm text-gray-500">{p.beds ?? "-"} beds • {p.baths ?? "-"} baths {p.livingArea ? `• ${p.livingArea} sqft` : ""}</div>
                    <div className="mt-2 text-xs text-gray-500">MLS: {p.listingId || p.listingKey || p.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">No properties found. Connect MLS and fetch properties to see listings.</div>
        )}
      </div>

      {/* Dialog for connecting */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[640px] lg:w-[640px] p-6 rounded-[12px]">
          <h3 className="text-lg font-semibold mb-4">Connect MLS</h3>

          <label className="text-sm text-gray-600">Client ID</label>
          <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Enter Client ID" className="mb-4" />

          <label className="text-sm text-gray-600">Client Secret</label>
          <Input value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Enter Client Secret" className="mb-4" type="password" />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={loading}>
              {loading ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectMls;