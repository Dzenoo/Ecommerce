import React from 'react';

export const SearchResults: React.FC<{ query: string }> = ({ query }) => (
  <div className="p-2">
    {query ? (
      <div>Search results for: {query}</div>
    ) : (
      <div className="text-muted-foreground">Start typing to search...</div>
    )}
  </div>
);
