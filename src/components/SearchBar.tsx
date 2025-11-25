import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const SearchBar = ({ placeholder = "Search temples by name or district...", onSearch }: SearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-12 h-14 rounded-full border-2 shadow-card-custom focus-visible:ring-primary"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
