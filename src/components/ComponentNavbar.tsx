import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logoutUser } from "../store/thunks/authThunks";
import { useNavigate } from "react-router-dom";

interface CreatorNavbarProps {
  title: string;
}

const CreatorNavbar = ({ title }: CreatorNavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Get user data from Redux store and dispatch
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Use profile data if available, otherwise fall back to auth user data
  const userData = profile || user;

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(logoutUser()).unwrap();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to generate initials from name
  const getInitials = (name: string): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };
  }, []);

  // Mock notification data
  const notifications = [
    {
      id: 1,
      title: "New Campaign Available",
      message: "Brand X is looking for content creators",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      title: "Application Approved",
      message: "Your application for Campaign Y has been approved",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of $150 has been processed",
      time: "3 days ago",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-4">
        <span className="text-base sm:text-lg font-semibold md:block hidden">{title}</span>
      </div>
      {/* Right: Theme toggle and user info */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-[#E91E63] rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && typeof document !== 'undefined' && createPortal(
            <div className="fixed right-4 top-16 w-80 bg-background border rounded-lg shadow-lg z-[2147483647] dark:bg-[#171717]">
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div key={notification.id}>
                          <div className={`p-4 hover:bg-accent/50 cursor-pointer ${notification.unread ? 'bg-accent/20' : 'bg-background'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                          {index < notifications.length - 1 && <Separator />}
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t">
                      <button className="w-full text-sm text-primary hover:underline">
                        Mark all as read
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>,
            document.body
          )}
        </div>
        <ThemeToggle />
        <div className="flex items-center gap-2 relative" ref={userMenuRef}>
          <button
            className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              {(userData as any)?.avatar ? (
                <AvatarImage src={(userData as any).avatar} alt={userData.name} />
              ) : null}
              <AvatarFallback className="text-sm sm:text-base text-start">
                {userData?.name ? getInitials(userData.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-start">
              <span className="font-medium leading-none">
                {userData?.name || "User"}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 hidden sm:block" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg z-50 dark:bg-[#171717]">
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {(userData as any)?.avatar ? (
                          <AvatarImage src={(userData as any).avatar} alt={userData.name} />
                        ) : null}
                        <AvatarFallback className="text-base">
                          {userData?.name ? getInitials(userData.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{userData?.name || "User"}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-3 hover:bg-accent/50 text-left transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default CreatorNavbar;