"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch backend API
  const fetchPokemon = async (pageNum) => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_BASE_URL}/api/pokemons?page=${pageNum}&limit=36`,
      );
      const data = await response.json();

      if (data.pokemon && data.pokemon.length > 0) {
        setPokemon((prev) =>
          pageNum === 1 ? data.pokemon : [...prev, ...data.pokemon],
        );
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount (only once)
  useEffect(() => {
    if (!isInitialized) {
      fetchPokemon(page);
      setIsInitialized(true);
    }
  }, [page, isInitialized]);

  // Fetch more when page changes
  useEffect(() => {
    if (page > 1 && isInitialized) {
      fetchPokemon(page);
    }
  }, [page, isInitialized]);

  // Search Query for Pokemons
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPokemon(filtered);
    }
  }, [searchQuery, pokemon]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Load More button for pagination
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const value = {
    pokemon,
    filteredPokemon,
    searchQuery,
    setSearchQuery,
    page,
    loading,
    hasMore,
    handleSearch,
    loadMore,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
}
