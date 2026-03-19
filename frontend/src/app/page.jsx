"use client";

import Carousel from "./components/Carousel";
import StaticBanners from "./components/StaticBanners";
import PokemonGrid from "./components/PokemonGrid";
import { usePokemon } from "./components/PokemonContext";

export default function PokedexPage() {
  const {
    pokemon,
    searchQuery,
    setSearchQuery,
    loading,
    initialLoad,
    hasMore,
    handleSearch,
    loadMore,
    selectedTypes,
    toggleType,
    clearTypes,
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
          pokemon={pokemon}
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loadMore={loadMore}
          loading={loading}
          initialLoad={initialLoad}
          hasMore={hasMore}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
          clearTypes={clearTypes}
        />
      </div>
    </div>
  );
}
