"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function PokedexPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const carouselImages = [{ id: 1 }, { id: 2 }, { id: 3 }];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  });

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

  // Colors for Different Pokemon Type
  const getTypeColor = (type) => {
    const colors = {
      grass: "#dcfce7",
      poison: "#f3e8ff",
      fire: "#fed7aa",
      flying: "#e0f2fe",
      electric: "#fef3c7",
      water: "#dbeafe",
      bug: "#ecfccb",
      normal: "#f3f4f6",
      fairy: "#fce7f3",
      fighting: "#fee2e2",
      psychic: "#fae8ff",
      rock: "#fafaf9",
      ghost: "#e0e7ff",
      ice: "#cffafe",
      dragon: "#ede9fe",
      dark: "#f4f4f5",
      steel: "#f1f5f9",
      ground: "#fef3c7",
    };
    return colors[type.toLowerCase()] || "#f3f4f6";
  };

  return (
    <div className="pokedex-container">
      {/* Top Section - Carousel and Static Banners */}
      <div className="top-section">
        <div className="top-grid">
          {/* Carousel Banner */}
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((img) => (
                <div key={img.id} className="carousel-slide">
                  <Image
                    src={
                      `/images/carousel${img.id}.jpg` ||
                      `/images/carousel${img.id}.png`
                    }
                    alt={`Carousel ${img.id}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="carousel-image"
                  />
                </div>
              ))}
            </div>

            {/* Carousel indicators */}
            <div className="carousel-indicators">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Two Static Banners */}
          <div className="static-banners">
            <div className="static-banner">
              <Image
                src={`/images/placeholder.svg`}
                alt={`Left side of static image`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="static-banner">
              <Image
                src={`/images/placeholder.svg`}
                alt={`Left side of static image`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section with Persistent Layout */}
      <div className="middle-section">
        <div className="middle-grid">
          {/* Left Static Image */}
          <div className="side-image left">
            <div className="side-image-content">
              <Image
                src={`/images/placeholder.svg`}
                alt={`Left side of static image`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Center - Scrollable Pokemon List */}
          <div className="pokemon-section">
            {/* Search Bar */}
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Pokemon Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </form>
            </div>

            {/* Pokemon Grid */}
            <div className="pokemon-grid">
              {filteredPokemon.map((poke, index) => (
                <div key={`${poke.id}-${index}`} className="pokemon-card">
                  <div className="pokemon-content">
                    <Image
                      src={poke.image || `./images/placeholder.svg`}
                      alt={poke.name}
                      width={80}
                      height={80}
                      className="pokemon-images"
                    />
                    <div className="pokemon-info">
                      <h3 className="pokemon-name">{poke.name}</h3>
                      <div className="pokemon-types">
                        {poke.types &&
                          poke.types.map((type, idx) => (
                            <span
                              key={idx}
                              className="type-badge"
                              style={{ backgroundColor: getTypeColor(type) }}
                            >
                              {type}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="load-more-container">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="load-more-button"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {!hasMore && filteredPokemon.length > 0 && (
              <p className="message">No more Pokémon to load</p>
            )}

            {filteredPokemon.length === 0 && !loading && (
              <p className="message">No Pokémon found</p>
            )}
          </div>

          {/* Right Static Image */}
          <div className="side-image right">
            <div className="side-image-content">
              <Image
                src={`/images/pikachu.png`}
                alt={`right side of static image`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
