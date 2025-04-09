import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, BookOpen, Compass, Users, Settings, UsersRound } from "lucide-react";

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", value: "dashboard" },
    { icon: <BookOpen size={20} />, label: "My Courses", value: "courses" },
    { icon: <Compass size={20} />, label: "Explore", value: "explore" },
    { icon: <Users size={20} />, label: "Community", value: "community" },
    { icon: <UsersRound size={20} />, label: "Groups", value: "groups" },
    { icon: <Settings size={20} />, label: "Settings", value: "settings" },
  ];

  const handleNavigation = (tabValue) => {
    setActiveTab(tabValue);
    onClose();
  };

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-16 z-40">
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.value}>
              <Button
                variant={activeTab === item.value ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === item.value ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                onClick={() => setActiveTab(item.value)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  // Mobile sidebar (sheet)
  return (
    <>
      <DesktopSidebar />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.value}>
                    <Button
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.value)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;