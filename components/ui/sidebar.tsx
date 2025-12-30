"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "@/app/redux/slices/authSlice";
import { RootState } from "@/app/redux";
import ConfirmModal from "@/app/components/Modal/ConfirmModal";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { MenuItem, roleMenus } from "@/app/Utils/types";
type Role = "agent" | "buyer" | "creator";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const [openSubMenu, setOpenSubMenu] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const menuItems: MenuItem[] = user?.role ? roleMenus[user.role as Role] : [];
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  }
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const toggleSidebar = () => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem("sidebar-expanded", JSON.stringify(newState));
  };

  useEffect(() => {
    const storedState = localStorage.getItem("sidebar-expanded");
    if (storedState !== null) {
      setExpanded(JSON.parse(storedState));
    }
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      dispatch(logout());
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.success("Logged out Failed!");
    } finally {
      // document.cookie =
      //   "token=; Max-Age=0; path=/; domain=" + window.location.hostname;
      // document.cookie =
      //   "role=; Max-Age=0; path=/; domain=" + window.location.hostname;

      // dispatch(logout());
      // toast.success("Logged out successfully!");
      // router.push("/login");
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 999;
      setExpanded(!isSmallScreen);
      localStorage.setItem("sidebar-expanded", JSON.stringify(!isSmallScreen));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // ✅ Add Messages item for buyer and creator only
  if (user?.role === "buyer" || user?.role === "creator") {
    const messagesItem = {
      id: "messages",
      label: "Messages",
      icon: "/icons/messages.svg", // 👈 non-active icon
      activeIcon: "/icons/messages-active.svg", // 👈 active icon
      path: "/messages",
    };

    // prevent duplicates
    const hasMessages = menuItems.some((item) => item.id === "messages");
    if (!hasMessages) {
      // insert where you want (e.g., after 2nd item)
      menuItems.splice(2, 0, messagesItem);
    }
  }

  return (
    <>
      <div className="lg:py-4 py-0">
        <aside
          className={`relative py-0 lg:py-2 flex rounded-lg flex-col h-full bg-white border-r shadow-sm transition-all duration-300 ease-in-out ${
            expanded ? "w-80 flex-shrink-0 shadow-lg overflow-y-auto" : "w-16"
          }  `}
        >
          {" "}
          {/* Header with Toggle */}
          <div className="flex justify-between items-center p-4">
            {expanded && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 relative" onClick={handleLogout}>
                  <Image
                    src={user?.avatarUrl || "/images/avatar.jpg"}
                    alt="Avatar"
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}
            {/* Toggle button inside header */}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 p-1 hidden lg:block"
            >
              <Image
                src="/icons/frame.svg"
                alt="Toggle Button"
                width={18}
                height={18}
                className={`transition-transform ${
                  !expanded ? "rotate-180 ml-2" : ""
                }`}
              />
            </button>
          </div>
          <nav className="flex-1 mt-4 flex flex-col gap-1 lg:px-2 px-0">
            {menuItems.map((item, idx) => {
              const isSetting = item.label === "Setting";
              const isLogout = item.label === "Logout";
              const isActive = item.path
                ? pathname.startsWith(item.path)
                : item.subItems
                  ? item.subItems.some((sub) => pathname === sub.path)
                  : false;

              const iconPath = isActive
                ? item.activeIcon || item.icon.replace(".svg", "-active.svg")
                : item.icon;

              return (
                <div key={idx}>
                  {/* --- ✅ Settings for mobile (Popover) --- */}
                  {isSetting && isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`group relative flex items-center gap-3 px-3 py-4 w-full rounded-md ${
                            isActive
                              ? "text-black font-semibold"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Image
                            src={iconPath}
                            alt={item.label}
                            width={22}
                            height={22}
                            className={`transition-all ${
                              isActive ? "text-black" : "text-gray-500"
                            } ${!expanded ? "ml-2" : ""}`}
                          />
                          {expanded && <span>{item.label}</span>}
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="p-2 w-56 bg-white shadow-lg rounded-md"
                      >
                        {item.subItems?.map((sub, subIdx) => {
                          const subActive = pathname === sub.path;
                          return (
                            <button
                              key={subIdx}
                              className={`group relative flex items-center gap-3 px-2 py-2 w-full rounded-md ${
                                subActive
                                  ? "text-black font-semibold"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                              onClick={() => {
                                if (sub.path) router.push(sub.path);
                              }}
                            >
                              <div
                                className="w-10 h-10 flex items-center justify-center p-2 rounded-lg bg-[#0000001A]
                          [box-shadow:0px_0px_1px_0px_#9191911A_inset,
                          1px_1px_2px_0px_#91919117_inset,
                          3px_3px_2px_0px_#9191910D_inset,
                          5px_5px_3px_0px_#91919103_inset,
                          8px_8px_3px_0px_#91919100_inset]"
                              >
                                <Image
                                  src={sub.icon}
                                  alt={sub.label}
                                  width={22}
                                  height={22}
                                  className="object-contain"
                                />
                              </div>
                              {sub.label}
                            </button>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <>
                      <button
                        className={`group relative flex items-center gap-3 px-3 py-4 w-full rounded-md ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          if (isSetting && expanded) {
                            setExpanded(true);
                            setOpenSubMenu((prev) => !prev);
                          } else if (isLogout) {
                            setOpen(true);
                          } else if (item.path) {
                            router.push(item.path);
                          }
                        }}
                      >
                        <Image
                          src={iconPath}
                          alt={item.label}
                          width={22}
                          height={22}
                          className={`transition-all ${
                            isActive ? "text-black" : "text-gray-500"
                          } ${!expanded ? "ml-2" : ""}`}
                        />
                        {expanded ? (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            {isSetting && (
                              <ChevronDown
                                size={16}
                                className={`${
                                  isActive ? "text-black" : "text-gray-500"
                                } transition-transform ${
                                  openSubMenu ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        ) : (
                          !expanded && (
                            <span className="absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-black px-2 py-2 text-xs text-white opacity-0 group-hover:opacity-100 z-10 shadow-lg">
                              {item.label}
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-black rotate-45"></span>
                            </span>
                          )
                        )}
                      </button>

                      {/* Desktop sub-items */}
                      {expanded &&
                        isSetting &&
                        openSubMenu &&
                        item.subItems && (
                          <div className="ml-4 space-y-1 mt-1">
                            {item.subItems.map((sub, subIdx) => {
                              const subActive = pathname === sub.path;
                              return (
                                <button
                                  key={subIdx}
                                  className={`group relative flex items-center gap-3 px-2 py-2 w-full rounded-md ${
                                    subActive
                                      ? "text-black font-semibold"
                                      : "text-gray-500 hover:text-gray-700"
                                  }`}
                                  onClick={() => {
                                    if (sub.path) router.push(sub.path);
                                  }}
                                >
                                  <div
                                    className="w-10 h-10 flex items-center justify-center p-2 rounded-lg bg-[#0000001A]
                            [box-shadow:0px_0px_1px_0px_#9191911A_inset,
                            1px_1px_2px_0px_#91919117_inset,
                            3px_3px_2px_0px_#9191910D_inset,
                            5px_5px_3px_0px_#91919103_inset,
                            8px_8px_3px_0px_#91919100_inset]"
                                  >
                                    <Image
                                      src={sub.icon}
                                      alt={sub.label}
                                      width={22}
                                      height={22}
                                      className="object-contain"
                                    />
                                  </div>
                                  {sub.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>
      </div>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Logout from Account"
        description="Are you sure you want to log out? You'll need to sign in again to access your account."
        cancelLabel="Cancel"
        confirmLabel="Logout"
        onCancel={() => console.log("Cancel from parent")}
        onConfirm={handleLogout}
        loading={loading}
        // disableCloseOnOutsideClick // uncomment if you want strict modal
      />
    </>
  );
}
