
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
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
    <div className="relative mb-8 group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="text-muted-foreground/60 w-5 h-5 group-focus-within:text-pfcu-primary transition-colors duration-300" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search sermons by title, preacher, or keywords..."
        value={searchQuery}
        onChange={onChange}
        className="pl-12 pr-12 py-7 h-auto w-full bg-white/70 dark:bg-black/30 backdrop-blur-md border-border/50 rounded-2xl shadow-sm text-lg placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-pfcu-primary/20 focus-visible:border-pfcu-primary/50 transition-all duration-300"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClear}
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default SermonSearch;
