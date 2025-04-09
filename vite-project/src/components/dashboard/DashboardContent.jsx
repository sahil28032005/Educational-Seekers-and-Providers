import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";

const DashboardContent = ({ userName }) => {
  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Introduction to React",
      progress: 75,
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format",
      instructor: "Sarah Miller"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      progress: 45,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&auto=format",
      instructor: "Michael Brown"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      progress: 30,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format",
      instructor: "Emily Chen"
    },
    {
      id: 4,
      title: "Node.js Fundamentals",
      progress: 60,
      image: "https://images.unsplash.com/photo-1648737963540-306235c8170e?w=500&auto=format",
      instructor: "David Wilson"
    }
  ];
  
  // Sample announcements
  const announcements = [
    {
      id: 1,
      title: "New Course Available",
      message: "Check out our new course on Machine Learning Fundamentals!",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "Upcoming Webinar",
      message: "Join us for a live webinar on Career Opportunities in Tech this Friday.",
      date: "1 day ago"
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
          <p>Continue your learning journey today. You have 3 courses in progress.</p>
        </CardContent>
      </Card>
      
      {/* My Courses Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Courses</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      
      {/* Announcements Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
        <div className="space-y-4">
          {announcements.map(announcement => (
            <Card key={announcement.id}>
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <span className="text-sm text-gray-500">{announcement.date}</span>
                </div>
                <p className="text-gray-600">{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;