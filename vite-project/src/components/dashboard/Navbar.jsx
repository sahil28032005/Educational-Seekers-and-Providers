import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react";

const Navbar = ({ onMenuClick, userAvatar, userName }) => {
  return (
    // Update the header element in your Navbar component
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
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