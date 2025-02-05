'use client';

import React from 'react';

type SearchStateProps = {
  children: (state: SearchState, actions: SearchActions) => React.ReactNode;
};

export type SearchState = {
  query: string;
};

export type SearchActions = {
  setQuery: (query: string) => void;
};

export const SearchStateProvider: React.FC<SearchStateProps> = ({
  children,
}) => {
  const [query, setQuery] = React.useState('');

  const state: SearchState = { query };
  const actions: SearchActions = { setQuery };

  return <>{children(state, actions)}</>;
};
