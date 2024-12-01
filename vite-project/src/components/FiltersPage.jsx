import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const FiltersPage = ({ onFilterApply }) => {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [username, setUsername] = useState(""); // State for username

  const handleFilterSubmit = () => {
    // Prepare the filters object
    const filters = {
      ...(role && { role }),
      ...(location && { location }),
      ...(minBudget && { minBudget }),
      ...(maxBudget && { maxBudget }),
      ...(username && { username }), // Add username to filters
    };

    // Pass the filters to the parent component
    onFilterApply(filters);
  };

  return (
    <div className="filter-container p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

      {/* Username Filter */}
      <div className="mb-4">
        <Label>Username:</Label>
        <Input
          className="mt-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>

      {/* Role Filter */}
      <div className="mb-4">
        <Label>Role:</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Designer">Designer</SelectItem>
            <SelectItem value="Data Scientist">Data Scientist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <Label>Location:</Label>
        <Input
          className="mt-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>

      {/* Budget Filters */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <Label>Min Budget:</Label>
          <Input
            className="mt-2"
            type="number"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            placeholder="Minimum"
          />
        </div>
        <div>
          <Label>Max Budget:</Label>
          <Input
            className="mt-2"
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="Maximum"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Apply Filters Button */}
      <div className="mt-4">
        <Button onClick={handleFilterSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FiltersPage;
