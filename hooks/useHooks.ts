import {
  buyerAllTours,
  buyerLikes,
  buyerPost,
  buyerSavedPost,
  buyerSavedTours,
} from "@/app/services/get.my-posts.service";
import { useQuery } from "@tanstack/react-query";

export const useBuyerPost = () => {
  const query = useQuery({
    queryKey: ["buyer-posts"],
    queryFn: () => buyerPost(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useBuyerSavedPost = () => {
  const query = useQuery({
    queryKey: ["buyer-saved-posts"],
    queryFn: () => buyerSavedPost(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useBuyerAllTours = (buyerId?: number) => {
  const query = useQuery({
    queryKey: ["buyer-tours"],
    queryFn: () => buyerAllTours(buyerId),
    enabled: !!buyerId,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useBuyerSavedTours = () => {
  const query = useQuery({
    queryKey: ["buyer-saved-tours"],
    queryFn: () => buyerSavedTours(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useBuyerLikes = () => {
  const query = useQuery({
    queryKey: ["buyer-likes"],
    queryFn: () => buyerLikes(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
