import { Search } from 'lucide-react';

interface GameFiltersProps {
  platforms: string[];
  selectedPlatform: string;
  searchQuery: string;
  onPlatformChange: (platform: string) => void;
  onSearchChange: (query: string) => void;
}

export default function GameFilters({
  platforms,
  selectedPlatform,
  searchQuery,
  onPlatformChange,
  onSearchChange,
}: GameFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onPlatformChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedPlatform === ''
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Platforms
        </button>
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => onPlatformChange(platform)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedPlatform === platform
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}