"use client";

import Carousel from "./components/Carousel";
import StaticBanners from "./components/StaticBanners";
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
          <Carousel />
          <StaticBanners />
        </div>
      </div>

      {/* Middle Section - Pokemon Grid */}
      <div className="middle-section">
        <PokemonGrid
          pokemon={filteredPokemon}
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loadMore={loadMore}
          loading={loading}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
