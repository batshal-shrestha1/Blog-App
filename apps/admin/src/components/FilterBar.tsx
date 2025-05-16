'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface FilterContextType {
  contentFilter: string;
  setContentFilter: (value: string) => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export function FilterProvider({ children }: { children: ReactNode }) {
  const [contentFilter, setContentFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  return (
    <FilterContext.Provider
      value={{
        contentFilter,
        setContentFilter,
        tagFilter,
        setTagFilter,
        dateFilter,
        setDateFilter,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Hook to use the filter context
export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

// FilterBar component
export default function FilterBar() {
  const {
    contentFilter,
    setContentFilter,
    tagFilter,
    setTagFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
  } = useFilter();

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="content-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Content:
          </label>
          <input
            type="text"
            id="content-filter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Tag:
          </label>
          <input
            type="text"
            id="tag-filter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date Created:
          </label>
          <input
            type="text"
            id="date-filter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="DDMMYYYY"
          />
        </div>
      </div>
      <div>
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By:
        </label>
        <select
          id="sort-by"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="date-desc">Date (Newest First)</option>
        </select>
      </div>
    </div>
  );
} 