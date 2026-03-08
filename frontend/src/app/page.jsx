"use client";

import Carousel from "./components/Carousel";
import StaticBanners from "./components/StaticBanners";
import SideImage from "./components/SideImage";
import PokemonGrid from "./components/PokemonGrid";
import { usePokemon } from "./components/PokemonContext";

export default function PokedexPage() {
  const {
    filteredPokemon,
    searchQuery,
    setSearchQuery,
    loading,
    hasMore,
    handleSearch,
    loadMore,
  } = usePokemon();

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
            src="/images/pokecards2.jpg"
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
