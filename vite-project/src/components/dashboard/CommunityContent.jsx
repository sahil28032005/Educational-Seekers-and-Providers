import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, MessageSquare } from "lucide-react";
import FiltersPage from "../FiltersPage";
import ConnectionsGrid from "../ConnectionsGrid";

const CommunityContent = ({ connections, userId, defaultProfileImage, onConnect, onFilterApply }) => {
  const [activeTab, setActiveTab] = useState("discover");

  // Sample connected users data (in a real app, this would come from an API)
  const connectedUsers = [
    { id: 1, name: "Alex Johnson", role: "Web Developer", status: "online", lastActive: "Just now" },
    { id: 2, name: "Sarah Miller", role: "UX Designer", status: "offline", lastActive: "2 hours ago" },
    { id: 3, name: "Michael Brown", role: "Data Scientist", status: "online", lastActive: "Just now" },
  ];

  // Sample groups data
  const groups = [
    { id: 1, name: "JavaScript Enthusiasts", members: 245, category: "Programming" },
    { id: 2, name: "UI/UX Design Community", members: 189, category: "Design" },
    { id: 3, name: "Data Science Network", members: 312, category: "Data Science" },
  ];

  return (
    <div className="p-6">
      {/* Header Card */}
      <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Community Hub</h2>
              <p className="text-indigo-100">Connect with peers, join groups, and expand your network</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-indigo-100">
                <UserPlus className="mr-2 h-4 w-4" /> Find Connections
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="discover">Discover People</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        {/* Discover People Tab */}
        <TabsContent value="discover" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find New Connections</CardTitle>
              <CardDescription>
                Discover people with similar interests and expand your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <FiltersPage onFilterApply={onFilterApply} />
              </div>
              
              <ConnectionsGrid 
                connections={connections}
                userId={userId}
                defaultProfileImage={defaultProfileImage}
                onConnect={onConnect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Connections Tab */}
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>My Connections</CardTitle>
              <CardDescription>
                People you've connected with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search your connections..." className="pl-8" />
              </div>
              
              <div className="space-y-4">
                {connectedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={defaultProfileImage} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={user.status === "online" ? "success" : "secondary"} className="mr-4">
                        {user.status === "online" ? "Online" : "Offline"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Community Groups</CardTitle>
              <CardDescription>
                Join groups based on your interests and connect with like-minded people
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search groups..." className="pl-8" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map(group => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.members} members</p>
                        </div>
                      </div>
                      <Badge className="mb-3">{group.category}</Badge>
                      <div className="mt-3">
                        <Button variant="outline" className="w-full">Join Group</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityContent;