import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductSearchFormProps {
  onSearch: (query: string | undefined) => void;
}

export function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-lg">
      <Input
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="font-body"
      />
      <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

