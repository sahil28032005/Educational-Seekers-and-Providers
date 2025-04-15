import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, BookOpen, Users, Award } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getDefaultAvatar } from "../utils/avatarUtils";
import Navbar from './dashboard/Navbar';
import Sidebar from './dashboard/Sidebar';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const defaultAvatar = getDefaultAvatar();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // In your fetchUserProfile function, add more debugging
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');
      
      console.log("User ID from localStorage:", userId);
      console.log("Auth token available:", !!authToken);
      
      if (!userId || !authToken) {
        toast.error("You must be logged in to view your profile");
        navigate('/login');
        return;
      }
  
      console.log("Fetching profile for user:", userId);
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
  
      console.log("Profile data:", response.data);
      setProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(`Error: ${error.response.data.message || "Failed to load profile"}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("Server did not respond. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request error:", error.message);
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div>
        <Navbar onMenuToggle={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex justify-center items-center h-screen w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar onMenuToggle={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="text-center p-8 w-full">
            <h2 className="text-2xl font-bold text-gray-700">Profile not found</h2>
            <p className="text-gray-500 mt-2">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onMenuToggle={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="container mx-auto p-6 max-w-5xl">
          {/* Profile Header */}
          <Card className="mb-6 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.profileImg || defaultAvatar} />
                  <AvatarFallback>{profile.name ? profile.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-gray-600">{profile.title || "Student"}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {profile.expertise && profile.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="md:ml-auto mt-4 md:mt-0">
                  <Button variant="outline" className="flex items-center">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Bio</h3>
                      <p className="mt-1 text-gray-600">{profile.bio || "No bio information available."}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Location</h3>
                      <p className="mt-1 text-gray-600">{profile.location || "No location specified."}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Email</h3>
                      <p className="mt-1 text-gray-600">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.interests && profile.interests.length > 0 ? 
                          profile.interests.map((interest, index) => (
                            <Badge key={index} variant="outline">{interest}</Badge>
                          )) : 
                          <p className="text-gray-600">No interests specified.</p>
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs implementation... */}
            {/* Education Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.education && profile.education.length > 0 ? (
                    <div className="space-y-6">
                      {profile.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
                          <h3 className="font-semibold text-lg">{edu.institution}</h3>
                          <p className="text-gray-600">{edu.degree}</p>
                          <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                          {edu.description && <p className="mt-2 text-gray-600">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No education information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" /> My Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.connections && profile.connections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.connections.map((connection, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={connection.profileImg || defaultAvatar} />
                                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{connection.name}</h3>
                                <p className="text-sm text-gray-500">{connection.title || "Student"}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">You haven't connected with anyone yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" /> Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <div className="space-y-4">
                      {profile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-4">
                            <Award className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-gray-500">{achievement.date}</p>
                            <p className="mt-1 text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No achievements added yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;