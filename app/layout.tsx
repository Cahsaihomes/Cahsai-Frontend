import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "sonner";
import StripeProviderWrapper from "./components/StripeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cahsai",
  description: "Cahsai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Toaster closeButton position="top-center" richColors />

        <Providers>
          <StripeProviderWrapper>
            <div className="h-full flex bg-[#f9f7f3] rounded-lg overflow-hidden">
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </StripeProviderWrapper>
        </Providers>

      </body>
    </html>
  );
}
