
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { RefObject } from "react";

interface SermonSearchProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const SermonSearch = ({ 
  searchQuery, 
  onChange,
  onClear,
  inputRef
}: SermonSearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search sermons by title, preacher, or keywords..."
        value={searchQuery}
        onChange={onChange}
        className="pl-10 pr-10 py-6 h-auto"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={onClear}
        >
          ✕
        </Button>
      )}
    </div>
  );
};

export default SermonSearch;
