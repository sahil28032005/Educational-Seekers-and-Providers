import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 text-center">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Discover Endless Possibilities
        </h1>
        <p className="text-lg sm:text-xl mb-10">
          Explore the world's most innovative projects, connect with inspiring people, and fuel your creativity.
        </p>
        <Button
          className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 px-6 rounded-full shadow-lg"
          onClick={() => {}}
        >
          Start Exploring
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;