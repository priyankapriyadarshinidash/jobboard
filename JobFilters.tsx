import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface JobFiltersProps {
  allJobs: any[];
  onFiltersChange: (filtered: any[]) => void;
}

type SortOption = "newest" | "salary-high" | "salary-low" | "relevance";

export default function JobFilters({ allJobs, onFiltersChange }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    allJobs.forEach((job) => {
      if (job.location) locations.add(job.location);
    });
    return Array.from(locations).sort();
  }, [allJobs]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    allJobs.forEach((job) => {
      if (job.skills) {
        job.skills.split(",").forEach((skill: string) => {
          skills.add(skill.trim());
        });
      }
    });
    return Array.from(skills).sort();
  }, [allJobs]);

  const maxSalary = useMemo(() => {
    return Math.max(...allJobs.map((job) => job.salaryMax || 0), 500000);
  }, [allJobs]);

  // Apply filters
  const filteredJobs = useMemo(() => {
    let result = allJobs.filter((job) => {
      // Search filter
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation = !selectedLocation || job.location === selectedLocation;

      // Skills filter
      const jobSkills = job.skills?.split(",").map((s: string) => s.trim().toLowerCase()) || [];
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((skill) => jobSkills.includes(skill.toLowerCase()));

      // Salary filter
      const jobMinSalary = job.salaryMin || 0;
      const jobMaxSalary = job.salaryMax || maxSalary;
      const matchesSalary =
        (jobMinSalary >= salaryRange[0] || jobMaxSalary >= salaryRange[0]) &&
        (jobMinSalary <= salaryRange[1] || jobMaxSalary <= salaryRange[1]);

      return matchesSearch && matchesLocation && matchesSkills && matchesSalary;
    });

    // Sort
    switch (sortBy) {
      case "salary-high":
        result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;
      case "salary-low":
        result.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "relevance":
        // Simple relevance: prioritize title matches
        result.sort((a, b) => {
          const aMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bMatch - aMatch;
        });
        break;
    }

    return result;
  }, [allJobs, searchQuery, selectedLocation, selectedSkills, salaryRange, sortBy, maxSalary]);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedSkills([]);
    setSalaryRange([0, maxSalary]);
    setSortBy("newest");
  };

  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedLocation ? 1 : 0,
    selectedSkills.length,
    salaryRange[0] > 0 || salaryRange[1] < maxSalary ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search by job title or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="salary-high">Salary: High to Low</option>
          <option value="salary-low">Salary: Low to High</option>
          <option value="relevance">Most Relevant</option>
        </select>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-4 border border-slate-200">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {allLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
            </label>
            <Slider
              min={0}
              max={maxSalary}
              step={10000}
              value={salaryRange}
              onValueChange={(value) => setSalaryRange([value[0], value[1]])}
              className="w-full"
            />
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleToggleSkill(skill)}
                >
                  {skill}
                  {selectedSkills.includes(skill) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="w-full text-slate-600"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredJobs.length} of {allJobs.length} jobs
      </div>
    </div>
  );
}
