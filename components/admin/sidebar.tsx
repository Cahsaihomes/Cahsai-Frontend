'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Clapperboard,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { logoutApi } from '@/app/services/auth.service';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Agent Management',
    href: '/admin/agent-management',
    icon: Users,
  },
  {
    title: 'Buyer Management',
    href: '/admin/buyer-management',
    icon: ShoppingCart,
  },
  {
    title: 'Creator Management',
    href: '/admin/creator-management',
    icon: Clapperboard,
  },
  {
    title: 'Lead Overview',
    href: '/admin/lead-overview',
    icon: TrendingUp,
  },
  {
    title: 'Payout Management',
    href: '/admin/payout-management',
    icon: DollarSign,
  },
  {
    title: 'Clips Management',
    href: '/admin/clip-management',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutApi();
      
      toast.success("Logged out successfully");
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to logout';
      toast.error(errorMessage);
      console.error('Error logging out:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={cn('flex h-screen flex-col border-r bg-white border-gray-200 transition-all duration-300', isCollapsed ? 'w-20' : 'w-64')}>
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        {!isCollapsed && <h1 className="text-lg font-bold text-gray-900">CAHSAI ADMIN</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-1.5 hover:bg-[#6F8375] text-black hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.title : ''}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#6F8375] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-3 py-4">
        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <button 
            onClick={() => setLogoutDialogOpen(true)}
            title={isCollapsed ? 'Logout' : ''}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5 flex-shrink-0" />
            )}
            {!isCollapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to login again to access the admin panel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
