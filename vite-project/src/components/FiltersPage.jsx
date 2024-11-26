// src/components/Filter.jsx

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";  // Corrected import path
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";  // Corrected import path
import { useState } from "react";

const Filter = ({ onFilterApply }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [isFree, setIsFree] = useState(false);

  const handleFilterSubmit = () => {
    onFilterApply({ searchText, category, isFree });
  };

  return (
    <div className="filter-container p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

      <div className="mb-4">
        <Label>Search:</Label>
        <Input
          className="mt-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by name or topic"
        />
      </div>

      <div className="mb-4">
        <Label>Category:</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex items-center">
        <Checkbox checked={isFree} onCheckedChange={(checked) => setIsFree(checked)} />
        <Label className="ml-2">Free Only</Label>
      </div>

      <Separator className="my-4" /> {/* Adding a separator between filter sections */}

      <div className="mt-4">
        <Button onClick={handleFilterSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Filter;
