import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { publicAxios } from "@/app/services/axiosInstance";

/* ================= TYPES ================= */

export interface MlsTokenRequest {
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  scope?: string;
}

export interface MlsTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  [key: string]: any;
}

export type Property = {
  id: string;
  listingId?: string;
  listingKey?: string;
  listingKeyNumeric?: number;
  address?: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  listPrice?: number;
  closePrice?: number;
  beds?: number;
  baths?: number;
  livingArea?: number;
  yearBuilt?: number;
  photos?: string[];
  image?: string;
  mlsStatus?: string;
  raw?: Record<string, any>;
  [key: string]: any;
};

/* =============== CONFIG ==================== */
const TOKEN_ENDPOINT = "/properties/token";
const PROPERTIES_ENDPOINT = "/properties";
const IMPORT_ENDPOINT = "/properties/saved";
export const STORAGE_KEY = "mlstoken";

/* =============== HOOK ==================== */

const normalizeProperty = (raw: Record<string, any>): Property => {
  const id = raw.ListingKey || raw.ListingId || raw.ListingKeyNumeric?.toString() || raw.Original_MLS_Number || raw.ListingKey || raw.ListingId || `${raw.ListingKeyNumeric ?? raw.ListingKey ?? raw.ListingId ?? raw.id}`;

  const street = [raw.StreetNumber, raw.StreetName].filter(Boolean).join(" ");
  const addressParts = [street, raw.City, raw.StateOrProvince, raw.PostalCode].filter(Boolean);
  const address = addressParts.join(", ");

  const photos: string[] = [];
  // backend may return a nested Photos array or media list
  if (Array.isArray(raw.Photos)) {
    raw.Photos.forEach((p: any) => {
      if (typeof p === "string") photos.push(p);
      else if (p && p.URL) photos.push(p.URL);
      else if (p && p.url) photos.push(p.url);
    });
  }
  if (raw.PhotoUrls && Array.isArray(raw.PhotoUrls)) photos.push(...raw.PhotoUrls);
  if (raw.photo && typeof raw.photo === "string") photos.push(raw.photo);

  return {
    id: id?.toString() ?? "",
    listingId: raw.ListingId,
    listingKey: raw.ListingKey,
    listingKeyNumeric: raw.ListingKeyNumeric,
    address: address || raw.address || raw.Address || undefined,
    streetNumber: raw.StreetNumber,
    streetName: raw.StreetName,
    city: raw.City,
    state: raw.StateOrProvince,
    postalCode: raw.PostalCode || raw.PostalCodePlus4,
    latitude: raw.Latitude ? Number(raw.Latitude) : undefined,
    longitude: raw.Longitude ? Number(raw.Longitude) : undefined,
    listPrice: raw.ListPrice ?? raw.ListPriceNumeric ?? raw.ListPrice ?? raw.System_Price,
    closePrice: raw.ClosePrice ?? raw.ClosePriceNumeric ?? raw.ClosePrice ?? raw.ClosePrice,
    beds: raw.BedroomsTotal ?? raw.Bedrooms ?? raw.BedroomsTotal ?? raw.BedroomsTotal,
    baths: raw.BathroomsTotalInteger ?? raw.BathroomsTotal ?? raw.BathroomsTotalInteger,
    livingArea: raw.LivingArea ?? raw.Total_SqFt ?? raw.AboveGradeFinishedArea,
    yearBuilt: raw.YearBuilt ? Number(raw.YearBuilt) : undefined,
    photos,
    image: photos[0] || raw.image || raw.Image || undefined,
    mlsStatus: raw.MlsStatus || raw.StandardStatus,
    raw,
  };
};

const useMlsToken = () => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  const persistToken = (t: string | null) => {
    try {
      if (t) localStorage.setItem(STORAGE_KEY, t);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
  };

  const generateToken = useCallback(async (payload: MlsTokenRequest): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(payload || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.append(k, String(v));
      });

      // prefer sending a URLSearchParams instance so axios sends a proper form body
      let res: any;
      try {
        res = await publicAxios.post(TOKEN_ENDPOINT, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      } catch (err) {
        // If server rejects form-encoded requests (e.g. 415), retry as JSON
        if ((err as any)?.response?.status === 415) {
          res = await publicAxios.post(TOKEN_ENDPOINT, payload);
        } else {
          throw err;
        }
      }

      const data: MlsTokenResponse = res.data;

      if (!res.status || !data.token?.access_token) {
        const msg = (data as any)?.error || "Token generation failed";
        setError(msg);
        toast.error(msg);
        return null;
      }

      setToken(data.access_token);
      persistToken(data.access_token);
      toast.success("MLS token acquired");
      return data.access_token;
    } catch (err) {
      const m = (err as any)?.message || "Token request failed";
      setError(m);
      toast.error(m);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProperties = useCallback(async (authToken?: string) => {
    const useToken = authToken ?? token;
    if (!useToken) return { ok: false, error: "No token" };
    setLoadingProperties(true);

    try {
      const res = await publicAxios.get(PROPERTIES_ENDPOINT, {
        headers: { Authorization: `Bearer ${useToken}` },
      });

      const data = res.data;

      // Accept both array and wrapped responses
      let rawList: any[] = [];
      if (Array.isArray(data)) rawList = data;
      else if (Array.isArray(data.properties)) rawList = data.properties;
      else if (Array.isArray(data.results)) rawList = data.results;
      else if (Array.isArray(data.data)) rawList = data.data;
      else if (data && typeof data === "object") rawList = [data];

      const mapped = rawList.map(normalizeProperty);
      setProperties(mapped);

      return { ok: true, properties: mapped };
    } catch (err) {
      const m = (err as any)?.response?.data?.error || (err as any)?.message || "Error fetching properties";
      toast.error(m);
      return { ok: false, error: m };
    } finally {
      setLoadingProperties(false);
    }
  }, [token]);

  const importProperties = useCallback(async (propertyIds: string[]) => {
    if (!propertyIds.length) return { ok: false, error: "No property ids" };
    if (!token) return { ok: false, error: "Not connected" };
    setImporting(true);
    try {
      const res = await publicAxios.post(
        IMPORT_ENDPOINT,
        { propertyIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      toast.success((data as any)?.message || "Imported successfully");
      return { ok: true, data };
    } catch (err) {
      const m = (err as any)?.response?.data?.error || (err as any)?.message || "Import failed";
      toast.error(m);
      return { ok: false, error: m };
    } finally {
      setImporting(false);
    }
  }, [token]);

  const disconnect = useCallback(() => {
    setToken(null);
    persistToken(null);
    setProperties([]);
    toast.success("Disconnected from MLS");
  }, []);

  useEffect(() => {
    if (token) fetchProperties(token);
  }, [fetchProperties, token]);

  return {
    token,
    loading,
    error,
    generateToken,
    properties,
    fetchProperties,
    loadingProperties,
    importProperties,
    importing,
    disconnect,
  };
};

export default useMlsToken;
