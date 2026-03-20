"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

const PokemonContext = createContext();
const DISPLAY_INCREMENT = 24;

export function PokemonProvider({ children }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayCount, setDisplayCount] = useState(DISPLAY_INCREMENT);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Initial load - fetch Pokemon for display
  useEffect(() => {
    const fetchInitialPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_BASE_URL}/api/pokemons?limit=1050`);

        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon");
        }

        const data = await response.json();
        setAllPokemon(
          (data.pokemon || []).map((p) => ({
            ...p,
            nameLower: p.name.toLowerCase(),
          })),
        );
        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching initial Pokemon:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPokemon();
  }, []);

  useEffect(() => {
    setDisplayCount(DISPLAY_INCREMENT);
  }, [searchQuery, selectedTypes]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearTypes = () => {
    setSelectedTypes([]);
  };

  const filteredPokemon = useMemo(() => {
    let results = allPokemon;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter((p) => p.nameLower.includes(query));
    }

    if (selectedTypes.length > 0) {
      results = results.filter((p) =>
        selectedTypes.every((type) => p.types?.includes(type)),
      );
    }

    return results;
  }, [allPokemon, searchQuery, selectedTypes]);

  const pokemonToDisplay =
    searchQuery.trim() === "" && selectedTypes.length === 0
      ? allPokemon.slice(0, displayCount)
      : filteredPokemon.slice(0, displayCount);

  const hasMore =
    searchQuery.trim() === "" && selectedTypes.length === 0
      ? displayCount < allPokemon.length
      : displayCount < filteredPokemon.length;

  const loadMore = () => {
    if (hasMore) {
      setDisplayCount((prev) => prev + DISPLAY_INCREMENT);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const value = {
    pokemon: pokemonToDisplay,
    allPokemonCount: allPokemon.length,
    filteredCount: filteredPokemon.length,
    searchQuery,
    setSearchQuery,
    loading,
    initialLoad,
    error,
    hasMore,
    handleSearch,
    loadMore,
    selectedTypes,
    toggleType,
    clearTypes,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error("usePokemon must be used within PokemonProvider");
  }
  return context;
}
