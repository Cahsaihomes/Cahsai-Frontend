'use client';

import React from 'react';
import { Sidebar } from '../../components/admin/sidebar';
import { ThemeProvider } from '../../components/admin/theme-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-[#f9f7f3]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
