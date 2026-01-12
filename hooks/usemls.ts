import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { publicAxios } from "@/app/services/axiosInstance";

/* ================= TYPES ================= */

export interface MlsTokenRequest {
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  scope?: string;
  MLS_GRANT_TYPE?: string;
  MLS_CLIENT_ID?: string;
  MLS_CLIENT_SECRET?: string;
  MLS_SCOPE?: string;
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
  agentId?: string | number;
  agentName?: string;
  agentImage?: string;
  agentPhone?: string;
  agentEmail?: string;
  raw?: Record<string, any>;
  [key: string]: any;
};

/* =============== CONFIG ==================== */
const TOKEN_ENDPOINT = "/properties/token";
const PROPERTIES_ENDPOINT = "/properties";
const SAVED_PROPERTIES_ENDPOINT = "/properties/saved";
const IMPORT_ENDPOINT = "/properties/saved";
export const STORAGE_KEY = "mlstoken";

/* =============== HOOK ==================== */

// Helper to safely get nested values and check multiple field names
const getField = (obj: Record<string, any>, ...fieldNames: string[]): any => {
  for (const field of fieldNames) {
    if (obj[field] !== undefined && obj[field] !== null && obj[field] !== "") return obj[field];
  }
  return undefined;
};

const normalizeProperty = (raw: Record<string, any>): Property => {
  console.log("🔍 Raw property data received:", raw);
  
  // Get ID - try multiple variations
  const id = getField(raw, 
    "ListingKey", "listingKey", "listing_key",
    "ListingId", "listingId", "listing_id",
    "id", "_id"
  )?.toString() || `${raw.ListingKeyNumeric || raw.listingKeyNumeric || Math.random()}`;

  // Get address components - try multiple case variations
  const streetNumber = getField(raw, "StreetNumber", "streetNumber", "street_number");
  const streetName = getField(raw, "StreetName", "streetName", "street_name");
  const city = getField(raw, "City", "city");
  const stateOrProvince = getField(raw, "StateOrProvince", "stateOrProvince", "state", "State");
  const postalCode = getField(raw, "PostalCode", "postalCode", "postal_code", "PostalCodePlus4", "zip");
  
  const street = [streetNumber, streetName].filter(Boolean).join(" ");
  const addressParts = [street, city, stateOrProvince, postalCode].filter(Boolean);
  const address = addressParts.join(", ");

  // Photos - try multiple variations
  const photos: string[] = [];
  const photoArrays = [raw.Photos, raw.photos, raw.PhotoUrls, raw.photo_urls];
  for (const photoArray of photoArrays) {
    if (Array.isArray(photoArray)) {
      photoArray.forEach((p: any) => {
        if (typeof p === "string" && p.trim()) photos.push(p);
        else if (p && (p.URL || p.url)) photos.push(p.URL || p.url);
      });
    }
  }
  if (raw.photo && typeof raw.photo === "string") photos.push(raw.photo);
  if (raw.image && typeof raw.image === "string") photos.push(raw.image);

  // Extract agent details
  const agentDetail = raw.agentDetail || raw.agent_detail || raw.agent || {};
  const agentFirstName = getField(agentDetail, "firstName", "first_name", "FirstName");
  const agentLastName = getField(agentDetail, "lastName", "last_name", "LastName");
  const agentFullName = agentFirstName && agentLastName 
    ? `${agentFirstName} ${agentLastName}` 
    : agentFirstName || agentLastName || undefined;
  const agentImage = getField(agentDetail, "image", "Image", "photo", "Photo", "avatar", "Avatar");
  const agentPhone = getField(agentDetail, "contact", "Contact", "phone", "Phone", "phoneNumber", "phone_number");
  const agentEmail = getField(agentDetail, "email", "Email");

  return {
    id: id?.toString() ?? "",
    listingId: getField(raw, "ListingId", "listingId", "listing_id"),
    listingKey: getField(raw, "ListingKey", "listingKey", "listing_key"),
    listingKeyNumeric: getField(raw, "ListingKeyNumeric", "listingKeyNumeric", "listing_key_numeric"),
    address: address || getField(raw, "address", "Address", "fullAddress", "full_address") || undefined,
    streetNumber: streetNumber,
    streetName: streetName,
    city: city,
    state: stateOrProvince,
    postalCode: postalCode,
    latitude: Number(getField(raw, "Latitude", "latitude", "lat")) || undefined,
    longitude: Number(getField(raw, "Longitude", "longitude", "lon")) || undefined,
    listPrice: getField(raw, "ListPrice", "listPrice", "list_price", "ListPriceNumeric", "listPriceNumeric", "price", "Price"),
    closePrice: getField(raw, "ClosePrice", "closePrice", "close_price", "ClosePriceNumeric", "closePriceNumeric"),
    beds: getField(raw, "BedroomsTotal", "bedroomsTotal", "bedrooms_total", "Bedrooms", "bedrooms", "beds"),
    baths: getField(raw, "BathroomsTotalInteger", "bathroomsTotalInteger", "bathrooms_total_integer", "BathroomsTotal", "bathroomsTotal", "bathrooms_total", "BathroomsFull", "bathroomsFull", "baths"),
    livingArea: getField(raw, "LivingArea", "livingArea", "living_area", "livingAreaSqFt", "living_area_sqft", "Total_SqFt", "total_sqft", "AboveGradeFinishedArea", "above_grade_finished_area", "sqft", "squareFeet"),
    yearBuilt: Number(getField(raw, "YearBuilt", "yearBuilt", "year_built", "YearConstructed")) || undefined,
    photos,
    image: photos[0] || getField(raw, "image", "Image", "thumbnail", "Thumbnail") || undefined,
    mlsStatus: getField(raw, "MlsStatus", "mlsStatus", "mls_status", "StandardStatus", "standardStatus", "status", "Status"),
    agentId: getField(raw, "agentId", "agent_id", "AgentId"),
    agentName: agentFullName,
    agentImage: agentImage,
    agentPhone: agentPhone,
    agentEmail: agentEmail,
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
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(false);
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

      // Build MLS-specific payload keys expected by backend (MLS_GRANT_TYPE, MLS_CLIENT_ID, MLS_CLIENT_SECRET, MLS_SCOPE)
      const mappedPayload: Record<string, any> = {
        MLS_GRANT_TYPE: (payload as any)?.MLS_GRANT_TYPE ?? (payload as any)?.grant_type ?? (payload as any)?.grantType ?? "client_credentials",
        MLS_CLIENT_ID: (payload as any)?.MLS_CLIENT_ID ?? (payload as any)?.client_id,
        MLS_CLIENT_SECRET: (payload as any)?.MLS_CLIENT_SECRET ?? (payload as any)?.client_secret,
        MLS_SCOPE: (payload as any)?.MLS_SCOPE ?? (payload as any)?.scope ?? "OData",
      };

      const params = new URLSearchParams();
      Object.entries(mappedPayload || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.append(k, String(v));
      });

      let res: any;
      try {
        res = await publicAxios.post(TOKEN_ENDPOINT, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      } catch (err) {
        // If server rejects form-encoded requests (e.g. 415), retry as JSON
        if ((err as any)?.response?.status === 415) {
          res = await publicAxios.post(TOKEN_ENDPOINT, mappedPayload);
        } else {
          throw err;
        }
      }

      const data: MlsTokenResponse = res.data;

      // Accept multiple response shapes: { access_token } or { token: { access_token } }
      const accessToken = (data as any)?.access_token ?? (data as any)?.token?.access_token ?? (data as any)?.token;

      if (!accessToken) {
        const msg = (data as any)?.error || "Token generation failed";
        setError(msg);
        toast.error(msg);
        return null;
      }

      setToken(String(accessToken));
      persistToken(String(accessToken));
      toast.success("MLS token acquired");
      return String(accessToken);
    } catch (err) {
      const m = (err as any)?.message || "Token request failed";
      setError(m);
      toast.error(m);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProperties = useCallback(async (authToken?: string, agentId?: number) => {
    const useToken = authToken ?? token;
    if (!useToken) return { ok: false, error: "No token" };
    setLoadingProperties(true);

    try {
      const url = agentId 
        ? `${PROPERTIES_ENDPOINT}?agentId=${agentId}` 
        : PROPERTIES_ENDPOINT;
      
      console.log("📡 Fetching properties from:", url, "with agentId:", agentId);
      
      const res = await publicAxios.get(url, {
        headers: { Authorization: `Bearer ${useToken}` },
      });

      const data = res.data;
      console.log("📥 Raw fetchProperties API response:", data);

      // The backend returns { success: true, fetched: X, saved: Y, properties: [...] }
      let rawList: any[] = [];
      
      if (Array.isArray(data)) {
        rawList = data;
      } else if (data?.properties && Array.isArray(data.properties)) {
        // ✅ This is the main case for the backend response
        rawList = data.properties;
        console.log(`✅ Found properties in response.properties: ${data.properties.length} items`);
      } else if (Array.isArray(data.results)) {
        rawList = data.results;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      } else if (Array.isArray(data.items)) {
        rawList = data.items;
      } else if (data && typeof data === "object" && !data.success) {
        rawList = [data];
      }

      console.log("📋 Parsed properties list:", rawList.length, "items");

      const mapped = rawList.map(normalizeProperty);
      setProperties(mapped);
      console.log("✅ Mapped properties:", mapped.length, "items");

      return { ok: true, properties: mapped };
    } catch (err) {
      const isNetworkError = (err as any)?.message === "Network Error";
      const m = (err as any)?.response?.data?.error || (err as any)?.response?.data?.message || (err as any)?.message || "Error fetching properties";
      console.error("❌ fetchProperties error:", m);
      if (isNetworkError) {
        console.error("Network error fetching properties:", err);
        toast.error("Network error contacting API. Check API base URL and CORS.");
      } else {
        toast.error(m);
      }
      return { ok: false, error: m };
    } finally {
      setLoadingProperties(false);
    }
  }, [token]);

  const importProperties = useCallback(async (agentId: number) => {
    if (!agentId) return { ok: false, error: "Agent ID required" };
    if (!token) return { ok: false, error: "Not connected" };
    setImporting(true);
    try {
      console.log("Saving properties with agentId:", agentId);
      const res = await publicAxios.post(
        IMPORT_ENDPOINT,
        { agentId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      const data = res.data;
      console.log("Save response:", data);
      toast.success((data as any)?.message || "Saved successfully");
      return { ok: true, data };
    } catch (err) {
      console.error("Save error:", err);
      const m = (err as any)?.response?.data?.error || (err as any)?.message || "Save failed";
      toast.error(m);
      return { ok: false, error: m };
    } finally {
      setImporting(false);
    }
  }, [token]);

  // Fetch saved properties (GET /properties/saved?page=1&limit=1000&agentId={agentId})
  const fetchSavedProperties = useCallback(async (agentId?: number) => {
    setLoadingSaved(true);

    try {
      const url = agentId 
        ? `${SAVED_PROPERTIES_ENDPOINT}?page=1&limit=1000&agentId=${agentId}`
        : SAVED_PROPERTIES_ENDPOINT;
      
      console.log("📡 Fetching saved properties from:", url);
      const res = await publicAxios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;
      console.log("📦 Raw API response:", data);

      // Accept both array and wrapped responses
      let rawList: any[] = [];
      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data.properties)) {
        rawList = data.properties;
      } else if (Array.isArray(data.results)) {
        rawList = data.results;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      } else if (Array.isArray(data.items)) {
        rawList = data.items;
      } else if (data && typeof data === "object" && !data.success) {
        rawList = [data];
      }
      // If it's a success response with no data array, assume empty
      else if (data.success === true) {
        rawList = [];
      }

      console.log("📋 Raw list to normalize:", rawList);
      const mapped = rawList.map(normalizeProperty);
      setSavedProperties(mapped);
      console.log("✅ Saved properties loaded:", mapped);

      return { ok: true, properties: mapped };
    } catch (err) {
      const isNetworkError = (err as any)?.message === "Network Error";
      const m = (err as any)?.response?.data?.error || (err as any)?.message || "Error fetching saved properties";
      if (isNetworkError) {
        console.error("Network error fetching saved properties:", err);
        toast.error("Network error contacting API. Check API base URL and CORS.");
      } else {
        console.error("Error fetching saved properties:", err);
      }
      return { ok: false, error: m };
    } finally {
      setLoadingSaved(false);
    }
  }, [token]);

  const disconnect = useCallback(() => {
    setToken(null);
    setProperties([]);
    setSavedProperties([]);
    setError(null);
    persistToken(null);
    toast.success("Disconnected from MLS");
  }, []);

  const fetchPropertyById = useCallback(async (id: string, authToken?: string) => {
    const useToken = authToken ?? token;
    if (!useToken) return { ok: false, error: "No token" };
    try {
      const res = await publicAxios.get(`${PROPERTIES_ENDPOINT}/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${useToken}` },
      });
      const data = res.data;
      let raw: any = null;
      if (Array.isArray(data)) raw = data[0];
      else if (data && (data.property || data.data || data.result)) raw = data.property || data.data || data.result;
      else raw = data;

      if (!raw) return { ok: false, error: "Property not found" };
      const prop = normalizeProperty(raw);

      setProperties((prev) => {
        const exists = prev.find((p) => p.id === prop.id);
        if (exists) return prev.map((p) => (p.id === prop.id ? prop : p));
        return [prop, ...prev];
      });

      return { ok: true, property: prop };
    } catch (err) {
      const isNetworkError = (err as any)?.message === "Network Error";
      const m = (err as any)?.response?.data?.error || (err as any)?.message || "Error fetching property";
      if (isNetworkError) {
        console.error("Network error fetching property:", err);
      }
      return { ok: false, error: m };
    }
  }, [token]);

  return {
    token,
    loading,
    error,
    generateToken,
    properties,
    fetchProperties,
    fetchPropertyById, // <-- new export
    loadingProperties,
    savedProperties,
    fetchSavedProperties,
    loadingSaved,
    importProperties,
    importing,
    disconnect,
  };
};

export default useMlsToken;
