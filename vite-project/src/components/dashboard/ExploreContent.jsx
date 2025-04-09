import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BookOpen, TrendingUp, Clock, Star, Filter } from "lucide-react";

const ExploreContent = () => {
  const [activeTab, setActiveTab] = useState("trending");

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "Advanced Machine Learning",
      instructor: "Dr. Emily Chen",
      rating: 4.8,
      students: 3245,
      level: "Advanced",
      duration: "10 weeks",
      category: "Data Science",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format",
      featured: true
    },
    {
      id: 2,
      title: "Full-Stack Web Development",
      instructor: "Michael Johnson",
      rating: 4.7,
      students: 5120,
      level: "Intermediate",
      duration: "12 weeks",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Williams",
      rating: 4.9,
      students: 2890,
      level: "All Levels",
      duration: "8 weeks",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format",
      featured: true
    },
    {
      id: 4,
      title: "Mobile App Development with React Native",
      instructor: "David Lee",
      rating: 4.6,
      students: 3780,
      level: "Intermediate",
      duration: "10 weeks",
      category: "Mobile Development",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format"
    },
    {
      id: 5,
      title: "Blockchain Fundamentals",
      instructor: "Alex Thompson",
      rating: 4.5,
      students: 1950,
      level: "Beginner",
      duration: "6 weeks",
      category: "Blockchain",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=500&auto=format"
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      instructor: "Jessica Miller",
      rating: 4.7,
      students: 4120,
      level: "All Levels",
      duration: "8 weeks",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500&auto=format"
    }
  ];

  // Sample categories
  const categories = [
    { id: 1, name: "Web Development", count: 120, icon: "🌐" },
    { id: 2, name: "Data Science", count: 85, icon: "📊" },
    { id: 3, name: "Design", count: 64, icon: "🎨" },
    { id: 4, name: "Business", count: 92, icon: "💼" },
    { id: 5, name: "Marketing", count: 78, icon: "📱" },
    { id: 6, name: "Personal Development", count: 56, icon: "🚀" }
  ];

  // Featured course component
  const FeaturedCourse = ({ course }) => (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-blue-50">{course.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">By {course.instructor}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-3 mb-3">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {course.duration}
          </span>
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" /> {course.level}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Explore Course</Button>
      </CardFooter>
    </Card>
  );

  // Regular course card
  const CourseCard = ({ course }) => (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
      <div className="h-40 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-blue-50">{course.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">By {course.instructor}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <span>{course.level}</span>
          <span>•</span>
          <span>{course.duration}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );

  // Category card
  const CategoryCard = ({ category }) => (
    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
      <CardContent className="p-4 flex items-center">
        <div className="text-3xl mr-4">{category.icon}</div>
        <div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.count} courses</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      {/* Hero Section */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
          <div className="relative p-8 md:p-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Next Learning Adventure</h1>
            <p className="text-lg mb-6 max-w-2xl">
              Explore thousands of courses taught by expert instructors to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search for courses, topics, or skills..." 
                  className="pl-10 h-12 bg-white/90 text-gray-800 border-0 focus-visible:ring-2 focus-visible:ring-white"
                />
              </div>
              <Button className="h-12 px-6 bg-white text-blue-700 hover:bg-blue-50">
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Featured Courses */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Button variant="ghost" className="text-blue-600">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.filter(course => course.featured).map(course => (
            <FeaturedCourse key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Browse by Category */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* All Courses */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explore Courses</h2>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" /> Trending
            </TabsTrigger>
            <TabsTrigger value="newest">
              <Clock className="h-4 w-4 mr-2" /> Newest
            </TabsTrigger>
            <TabsTrigger value="popular">
              <Star className="h-4 w-4 mr-2" /> Popular
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newest" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...courses].reverse().map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...courses].sort((a, b) => b.students - a.students).map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Ready to start learning?</h2>
              <p className="text-purple-100">Join thousands of students already learning on our platform.</p>
            </div>
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExploreContent;