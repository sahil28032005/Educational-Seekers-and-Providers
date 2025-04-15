import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Search, LogOut, User, Settings, Check, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from "../../context/NotificationContext";
import { format } from "date-fns";

const Navbar = ({ onMenuClick, userAvatar, userName }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    // Redirect to login page
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Handle different notification types
    if (notification.data?.type === 'connection_request') {
      navigate('/pending');
    } else if (notification.data?.type === 'group_invite') {
      navigate(`/groups/${notification.data.groupId}`);
    } else if (notification.data?.type === 'message') {
      navigate(`/messages/${notification.data.conversationId}`);
    }
    
    setNotificationOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold text-blue-600">EduSeek</h1>
        </div>
        
        <div className="hidden md:flex items-center w-1/3 mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search courses..." className="pl-8" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
           
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} title="Mark all as read">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAll} title="Clear all">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;