// hooks/useAffiliateProducts.ts
import { useQuery } from "@tanstack/react-query";


export type IAProduct = {
  _id: string;
  mid: number;
  merchantname: string;
  linkid: string;
  sku: number;
  productname: string;
  price: {
    amount: number;
    currency: string;
  };
  saleprice?: {
    amount?: number;
    currency?: string;
  };
  keywords?: string[];
  linkurl: string;
  imageurl: string;
};

export const useAffiliateProducts = (keyword : string) => {
  return useQuery<IAProduct[]>({
    queryKey: ["affiliateProducts"],
    queryFn: async () => {
      const res = await fetch(`/api/rakuten/products${keyword}`);
      if (!res.ok) throw new Error("Failed to fetch affiliate products");
      return res.json();
    },
  });
};
