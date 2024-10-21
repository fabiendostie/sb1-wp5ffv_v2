import React, { useState } from 'react';
import { Search as SearchIcon, File, Folder } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
}

const mockSearchResults: SearchResult[] = [
  { id: '1', name: 'report.pdf', type: 'file', path: '/Documents/Work' },
  { id: '2', name: 'Images', type: 'folder', path: '/Personal' },
  { id: '3', name: 'budget_2023.xlsx', type: 'file', path: '/Documents/Finance' },
  { id: '4', name: 'presentation.pptx', type: 'file', path: '/Documents/Work/Projects' },
  { id: '5', name: 'vacation_photos', type: 'folder', path: '/Personal/Photos' },
];

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would be an API call
    const results = mockSearchResults.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Search</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <ul className="space-y-2">
              {searchResults.map((result) => (
                <li key={result.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                  {result.type === 'file' ? (
                    <File className="mr-2" size={20} />
                  ) : (
                    <Folder className="mr-2" size={20} />
                  )}
                  <div>
                    <p className="font-semibold">{result.name}</p>
                    <p className="text-sm text-gray-600">{result.path}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;