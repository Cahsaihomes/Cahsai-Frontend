"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Toaster } from "@/components/ui/toaster";

import { Provider as ReduxProvider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux";
import { SocketProvider } from "../context/SocketContext";
function AppLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#f9f7f3]">
      <div className="w-10 h-10 border-4 border-[#6F8375] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {/* <Toaster /> */}
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </SocketProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
