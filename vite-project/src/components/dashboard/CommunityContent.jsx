import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, MessageSquare, Check, X } from "lucide-react";
import FiltersPage from "../FiltersPage";
import ConnectionsGrid from "../ConnectionsGrid";
import axios from "axios";
import { toast } from "react-toastify";

const CommunityContent = ({ connections, userId, defaultProfileImage, onConnect, onFilterApply }) => {
  const [activeTab, setActiveTab] = useState("discover");
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState({
    accepted: false,
    pending: false
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch accepted connections
  const fetchAcceptedConnections = async () => {
    setLoading(prev => ({ ...prev, accepted: true }));
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:4000/connections/accepted", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAcceptedConnections(response.data.data);
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
      toast.error("Failed to load your connections");
    } finally {
      setLoading(prev => ({ ...prev, accepted: false }));
    }
  };

  // Fetch pending connection requests
  const fetchPendingRequests = async () => {
    setLoading(prev => ({ ...prev, pending: true }));
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:4000/connections/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(prev => ({ ...prev, pending: false }));
    }
  };

  // Accept connection request
  const handleAcceptConnection = async (connectionId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://localhost:4000/connections/accept", 
        { connectionId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success("Connection accepted successfully");
      
      // Refresh both lists
      fetchPendingRequests();
      fetchAcceptedConnections();
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection");
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "connections") {
      fetchAcceptedConnections();
    } else if (activeTab === "pending") {
      fetchPendingRequests();
    }
  }, [activeTab]);

  // Filter connections based on search term
  const filteredConnections = acceptedConnections.filter(connection => 
    connection.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="discover">Discover People</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
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
                <Input 
                  placeholder="Search your connections..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {loading.accepted ? (
                <div className="text-center py-8">Loading your connections...</div>
              ) : filteredConnections.length > 0 ? (
                <div className="space-y-4">
                  {filteredConnections.map(connection => (
                    <div key={connection.connectionId} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={connection.user.profileImg || defaultProfileImage} />
                          <AvatarFallback>{connection.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{connection.user.name}</h3>
                          <p className="text-sm text-gray-500">{connection.user.expertise || "No expertise listed"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className="mr-4">Connected</Badge>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  You don't have any connections yet. Discover people to connect with!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Connection Requests</CardTitle>
              <CardDescription>
                People who want to connect with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.pending ? (
                <div className="text-center py-8">Loading pending requests...</div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={request.requester.profileImg || defaultProfileImage} />
                          <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{request.requester.name}</h3>
                          <p className="text-sm text-gray-500">{request.requester.expertise || "No expertise listed"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          onClick={() => handleAcceptConnection(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        >
                          <X className="h-4 w-4 mr-1" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  You don't have any pending connection requests.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab - Keep your existing groups tab */}
        <TabsContent value="groups">
          {/* Your existing groups tab content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityContent;