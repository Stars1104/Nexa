import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import ReactDOM from "react-dom";

interface CreatorNavbarProps {
  title: string;
}

const CreatorNavbar = ({ title }: CreatorNavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
          {showNotifications && ReactDOM.createPortal(
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
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarFallback className="text-sm sm:text-base">LC</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium leading-none">Luiza Costa</span>
            <span className="text-xs text-muted-foreground">Content Creator</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CreatorNavbar;