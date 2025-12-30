export const specializationsList = [
  "Luxury Homes",
  "First-Time Buyers",
  "Condos",
  "New Construction",
  "Relocations",
  "Mini Fridge",
  "Shared Kitchen Access",
];

export interface RoleCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
}

export const roles: RoleCardProps[] = [
  {
    id: "buyer",
    title: "Discover",
    description: "Immerse yourself in homes worth swooning over.",
    path: "/welcome?role=buyer",
  },
  {
    id: "agent",
    title: "Feature",
    description: "Highlight unique spaces and connect with future fans.",
    path: "/welcome?role=agent",
  },
  {
    id: "creator",
    title: "Creator",
    description:
      "Share beautiful spaces, and shape the way the next generation dreams about home.",
    path: "/welcome?role=creator",
  },
];

// ✅ Updated MenuItem type
export type MenuItem = {
  id?: string;
  icon: string;
  activeIcon?: string;
  label: string;
  path?: string;
  isLogout?: boolean;
  subItems?: MenuItem[];
};

type Role = "agent" | "creator" | "buyer";

// ---------------- Agent Menu ----------------
export const agentMenu: MenuItem[] = [
  { icon: "/icons/home.svg", label: "Home", path: "/agentdashboard/home" },
  {
    icon: "/icons/video.svg",
    label: "Clips & Edit",
    path: "/agentdashboard/clips-edit",
  },
  {
    icon: "/icons/target.svg",
    label: "Leads Management",
    path: "/agentdashboard/leads-managements",
  },
  {
    icon: "/icons/book.svg",
    label: "Calendar",
    path: "/agentdashboard/calendar",
  },
  {
    icon: "/icons/bell.svg",
    label: "Notifications",
    path: "/agentdashboard/notifications",
  },
  {
    icon: "/icons/settings.svg",
    label: "Setting",
    path: "/agentdashboard/setting",
    subItems: [
      {
        icon: "/icons/profile-circle.svg",
        label: "My Profile",
        path: "/agentdashboard/my-profile",
      },
      {
        icon: "/icons/lock.svg",
        label: "Security",
        path: "/agentdashboard/security",
      },
      {
      id: "notifications",
      label: "Notification Preferences",
      icon: "/icons/notification.svg",
      path: "/agentdashboard/notification-preferences",
    },
    {
      id: "dryvin-ai",
      label: "Dryvin AI",
      icon: "/icons/dri-AI.svg",
      path: "/agentdashboard/dryvin-ai",
    },
    ],
  },
  {
    icon: "/icons/logout.svg",
    label: "Logout",
    path: "/login",
    isLogout: true,
  },
];

// ---------------- Creator Menu ----------------
const creatorItems: MenuItem[] = [
  { icon: "/icons/home.svg", label: "Home", path: "/creatordashboard/home" },
  {
    icon: "/icons/video.svg",
    label: "Clips",
    path: "/creatordashboard/clips",
  },

  {
    id: "messages",
    icon: "/icons/message.png",
    activeIcon: "/icons/message-active.png",
    label: "Messages",
    path: "/creatordashboard/messages",
  },
   {
    icon: "/icons/bell.svg",
    label: "Notifications",
    path: "/creatordashboard/notifications-page",
  },
  {
    icon: "/icons/performance-2.svg",
    label: "Performance & Earnings",
    path: "/creatordashboard/performance-earnings",
  },
  {
    icon: "/icons/payout-2.svg",
    label: "Payout",
    path: "/creatordashboard/payout",
  },
  {
    icon: "/icons/settings.svg",
    label: "Setting",
    path: "/creatordashboard/setting",
    subItems: [
      {
        icon: "/icons/profile-circle.svg",
        label: "My Profile",
        path: "/creatordashboard/setting/profile",
      },
      {
        icon: "/icons/lock.svg",
        label: "Security",
        path: "/creatordashboard/setting/security",
      },
    ],
  },
  {
    icon: "/icons/logout.svg",
    label: "Logout",
    path: "/login",
  },
];

// ---------------- Buyer Menu ----------------
const buyerItems: MenuItem[] = [
  {
    icon: "/icons/home.svg",
    label: "Home",
    path: "/buyerdashboard/home-screen",
  },
  {
    icon: "/icons/heart.svg",
    label: "Dreamboard",
    path: "/buyerdashboard/moodboards",
  },
  {
    icon: "/icons/book.svg",
    label: "Booking",
    path: "/buyerdashboard/booking",
  },

  {
    id: "messages",
    icon: "/icons/message.png",
    activeIcon: "/icons/message-active.png",
    label: "Messages",
    path: "/buyerdashboard/messages",
  },
  {
    icon: "/icons/bell.svg",
    label: "Notifications",
    path: "/buyerdashboard/notificationcard",
  },
  {
    icon: "/icons/settings.svg",
    label: "Setting",
    path: "/buyerdashboard/setting",
    subItems: [
      {
        icon: "/icons/profile-circle.svg",
        label: "My Profile",
        path: "/buyerdashboard/setting/profile",
      },
      {
        icon: "/icons/lock.svg",
        label: "Security",
        path: "/buyerdashboard/setting/security",
      },
    ],
  },
  {
    icon: "/icons/logout.svg",
    label: "Logout",
    path: "/login",
    isLogout: true,
  },
];

// ---------------- Role Menus ----------------
export const roleMenus: Record<Role, MenuItem[]> = {
  agent: agentMenu,
  creator: creatorItems,
  buyer: buyerItems,
};
