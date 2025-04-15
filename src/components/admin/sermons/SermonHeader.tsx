
import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SermonHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SermonHeader = ({ onAddClick, searchQuery, onSearchChange }: SermonHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold font-display">Sermon Library</h1>
        <p className="text-gray-600">Manage your sermon uploads and resources</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-9 w-full sm:w-64"
            placeholder="Search sermons..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          className="bg-pfcu-purple hover:bg-pfcu-dark"
          onClick={onAddClick}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Sermon
        </Button>
      </div>
    </div>
  );
};

export default SermonHeader;
