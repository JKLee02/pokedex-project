"use client";

import { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import StaticBanners from "./components/StaticBanners";
import SideImage from "./components/SideImage";
import PokemonGrid from "./components/PokemonGrid";

export default function PokedexPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Carousel images auto rotation
  const carouselImages = [{ id: 1 }, { id: 2 }, { id: 3 }];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  // Fetch backend API
  const fetchPokemon = async (pageNum) => {
    setLoading(true);
    try {
      // Express.js backend endpoint from server.js
      const response = await fetch(
        `http://localhost:3001/api/pokemons?page=${pageNum}&limit=36`
      );
      const data = await response.json();

      if (data.pokemon && data.pokemon.length > 0) {
        setPokemon((prev) =>
          pageNum === 1 ? data.pokemon : [...prev, ...data.pokemon]
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

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  // Search Query for Pokemons
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="pokedex-container">
      {/* Top Section - Carousel and Static Banners */}
      <div className="top-section">
        <div className="top-grid">
          {/* Carousel and static banners components */}
          <Carousel />
          <StaticBanners />
        </div>
      </div>

      {/* Middle Section with Persistent Layout */}
      <div className="middle-section">
        <div className="middle-grid">
          {/* Left Static Image */}
          <SideImage
            src="/images/placeholder.svg"
            alt="Left side of static image"
          />

          {/* Center - Scrollable Pokemon List */}
          <PokemonGrid
            pokemon={filteredPokemon}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            loadMore={loadMore}
            loading={loading}
            hasMore={hasMore}
          />

          {/* Right Static Image */}
          <SideImage
            src="/images/pikachu.png"
            alt="right side of static image"
          />
        </div>
      </div>
    </div>
  );
}
