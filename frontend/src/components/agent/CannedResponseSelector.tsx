import React, { useState, useEffect } from 'react';
import { X, Search, FileText } from 'lucide-react';
import { getCannedResponses } from '../../services/api';
import type { CannedResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface CannedResponseSelectorProps {
  onSelect: (content: string) => void;
  onClose: () => void;
}

const CannedResponseSelector: React.FC<CannedResponseSelectorProps> = ({
  onSelect,
  onClose,
}) => {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadCannedResponses();
  }, []);

  useEffect(() => {
    filterResponses();
  }, [searchQuery, selectedCategory, responses]);

  const loadCannedResponses = async () => {
    try {
      const data = await getCannedResponses();
      setResponses(data);
    } catch (error) {
      console.error('Error loading canned responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResponses = () => {
    let filtered = responses;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query)
      );
    }

    setFilteredResponses(filtered);
  };

  const categories = ['All', ...new Set(responses.map((r) => r.category))];

  const groupedResponses = filteredResponses.reduce((acc, response) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {} as Record<string, CannedResponse[]>);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Canned Responses</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search responses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Responses list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No responses found</p>
          </div>
        ) : (
          Object.entries(groupedResponses).map(([category, categoryResponses]) => (
            <div key={category}>
              {selectedCategory === 'All' && (
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {category}
                </h4>
              )}
              <div className="space-y-2">
                {categoryResponses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => onSelect(response.content)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors group"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-blue-600 mb-1">
                      {response.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {response.content}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CannedResponseSelector;
