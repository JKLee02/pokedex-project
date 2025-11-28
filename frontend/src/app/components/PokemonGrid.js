"use client";

import Image from "next/image";
import "./PokemonGrid.css";
import { typeColours } from "../utils/typeColours";

export default function PokemonGrid({
  pokemon,
  handleSearch,
  searchQuery,
  setSearchQuery,
  loadMore,
  loading,
  hasMore,
}) {
  return (
    <div className="pokemon-section">
      {/* Search bar*/}
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

      {/* Pokemon grid */}
      <div className="pokemon-grid">
        {pokemon.map((poke) => (
          <div key={poke.name} className="pokemon-card">
            <div className="pokemon-content">
              <Image
                src={poke.image || "/images/placeholder.svg"}
                alt={poke.name}
                width={80}
                height={80}
              />
              <div className="pokemon-info">
                <h3 className="pokemon-name">{poke.name}</h3>

                <div className="pokemon-types">
                  {poke.types?.map((type, idx) => (
                    <span
                      key={idx}
                      className="type-badge"
                      style={{
                        backgroundColor: typeColours[type] || "#f3f4f6",
                      }}
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

      {/* Load More button */}
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

      {/* Messages */}
      {!hasMore && pokemon.length > 0 && (
        <p className="message">No more Pokémon to load</p>
      )}

      {pokemon.length === 0 && !loading && (
        <p className="message">No Pokémon found</p>
      )}
    </div>
  );
}
