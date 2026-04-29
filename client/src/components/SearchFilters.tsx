import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  search: string;
  author: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export default function SearchFilters({
  search,
  author,
  sort,
  onSearchChange,
  onAuthorChange,
  onSortChange,
  onReset,
}: SearchFiltersProps) {
  const hasActiveFilters = search || author || sort !== "recent";

  return (
    <div className="space-y-4 p-6 border-2 border-[#FF00FF] shadow-[0_0_20px_#FF00FF] bg-black/50">
      <h2 className="text-xl font-bold text-[#FF00FF]">Recherche & Filtres</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-[#FF00FF] font-bold mb-2">
            Rechercher par titre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#00FFFF]" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Titre du morceau..."
              className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF] pl-10"
            />
          </div>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-[#FF00FF] font-bold mb-2">
            Filtrer par auteur
          </label>
          <Input
            type="text"
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="Nom de l'auteur..."
            className="bg-black border-2 border-[#00FFFF] text-white placeholder-gray-500 focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[#FF00FF] font-bold mb-2">
            Trier par
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-black border-2 border-[#00FFFF] text-white px-3 py-2 rounded focus:border-[#FF00FF] focus:shadow-[0_0_10px_#FF00FF]"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus populaires</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          onClick={onReset}
          className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-bold"
        >
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
