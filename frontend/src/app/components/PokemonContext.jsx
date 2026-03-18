"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PokemonContext = createContext();
const DISPLAY_INCREMENT = 24;

export function PokemonProvider({ children }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayCount, setDisplayCount] = useState(DISPLAY_INCREMENT);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [searchReady, setSearchReady] = useState(false);

  // Initial load - fetch first 36 Pokemon for instant display
  useEffect(() => {
    const fetchInitialPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_BASE_URL}/api/pokemons?limit=24`);

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

  // Background fetch - load all Pokemon for search
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_BASE_URL}/api/pokemons?limit=1050`);

        if (!response.ok) {
          throw new Error("Failed to fetch all Pokemon");
        }

        const data = await response.json();
        setAllPokemon(
          (data.pokemon || []).map((p) => ({
            ...p,
            nameLower: p.name.toLowerCase(),
          })),
        );
        setSearchReady(true);
      } catch (error) {
        console.error("Error fetching all Pokemon:", error);
      }
    };

    // Only run after initial load is complete
    if (!initialLoad) {
      fetchAllPokemon();
    }
  }, [initialLoad]);

  useEffect(() => {
    setDisplayCount(DISPLAY_INCREMENT);
  }, [searchQuery]);

  const filteredPokemon =
    searchQuery.trim() === ""
      ? allPokemon
      : allPokemon.filter((p) =>
          p.nameLower.includes(searchQuery.toLowerCase()),
        );

  const pokemonToDisplay =
    searchQuery.trim() === ""
      ? allPokemon.slice(0, displayCount)
      : filteredPokemon.slice(0, displayCount);

  const hasMore =
    searchQuery.trim() === ""
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
    searchReady,
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