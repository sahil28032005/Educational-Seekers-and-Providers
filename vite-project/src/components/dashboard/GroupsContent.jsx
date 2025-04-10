import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, Plus, UsersRound } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const GroupsContent = ({ 
  groups, 
  userGroups, 
  groupSuggestions, 
  onCreateGroup, 
  onJoinGroup, 
  onRefreshGroups 
}) => {
  const [activeTab, setActiveTab] = useState("my-groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    category: "",
    isPublic: true
  });

  // Handle input change for create group form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGroupData({
      ...newGroupData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle select change for category
  const handleCategoryChange = (value) => {
    setNewGroupData({
      ...newGroupData,
      category: value
    });
  };

  // Handle form submission for creating a group
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup(newGroupData);
    setIsCreateDialogOpen(false);
    setNewGroupData({
      name: "",
      description: "",
      category: "",
      isPublic: true
    });
  };

  // Filter groups based on search query
  const filterGroups = (groupsList) => {
    if (!searchQuery) return groupsList;
    
    return groupsList.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.delete(
        `http://localhost:4000/api/groups/${groupId}/leave`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Left group successfully");
        onRefreshGroups();
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast.error(error.response?.data?.message || "Failed to leave group");
    }
  };

  // Render group card
  const renderGroupCard = (group, isMember = false) => {
    return (
      <Card key={group.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          {group.imageUrl ? (
            <img 
              src={group.imageUrl} 
              alt={group.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <UsersRound size={48} className="text-white" />
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
              <Badge variant="outline" className="mb-2">{group.category}</Badge>
            </div>
            <Badge variant={group.isPublic ? "secondary" : "outline"}>
              {group.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-1" />
            <span>{group._count?.members || 0} members</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {isMember ? (
            <div className="w-full flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => handleLeaveGroup(group.id)}>
                Leave
              </Button>
              <Button className="flex-1">
                View
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => onJoinGroup(group.id)}>
              Join Group
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {/* Header Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Groups</h2>
              <p className="text-blue-100">Join groups, create communities, and collaborate with peers</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-blue-50">
                  <Plus size={16} className="mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Group</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create your new group. Groups help you connect with people who share your interests.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Group Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newGroupData.name}
                        onChange={handleInputChange}
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        onValueChange={handleCategoryChange} 
                        value={newGroupData.category}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming">Programming</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newGroupData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your group"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={newGroupData.isPublic}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isPublic">Make this group public</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="Search groups by name, description or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-groups" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>

        {/* My Groups Tab */}
        <TabsContent value="my-groups">
          {userGroups && userGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGroups(userGroups).map(group => renderGroupCard(group, true))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10">
                  <UsersRound size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Groups Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't joined any groups yet. Discover groups or create your own!</p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setActiveTab("discover")}>
                      Discover Groups
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      Create Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover">
          {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGroups(groups).map(group => {
                const isMember = userGroups.some(userGroup => userGroup.id === group.id);
                return renderGroupCard(group, isMember);
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10">
                  <UsersRound size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Groups Available</h3>
                  <p className="text-gray-500 mb-4">There are no groups available at the moment. Be the first to create one!</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Suggested Tab */}
        <TabsContent value="suggested">
          {groupSuggestions && groupSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGroups(groupSuggestions).map(group => {
                const isMember = userGroups.some(userGroup => userGroup.id === group.id);
                return renderGroupCard(group, isMember);
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10">
                  <UsersRound size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Suggestions Yet</h3>
                  <p className="text-gray-500 mb-4">We don't have any group suggestions for you yet. Try exploring all groups!</p>
                  <Button variant="outline" onClick={() => setActiveTab("discover")}>
                    Explore All Groups
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupsContent;