'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../../components/admin/sidebar';
import { ThemeProvider } from '../../components/admin/theme-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isLoginPage ? (
        <main>{children}</main>
      ) : (
        <div className="flex h-screen bg-[#f9f7f3]">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}
