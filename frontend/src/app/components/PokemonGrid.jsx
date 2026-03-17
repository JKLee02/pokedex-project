"use client";

import Image from "next/image";
import Link from "next/link";
import "./PokemonGrid.css";
import { typeColours } from "../utils/typeColours";

export default function PokemonGrid({
  pokemon,
  handleSearch,
  searchQuery,
  setSearchQuery,
  loadMore,
  loading,
  initialLoad,
  hasMore,
}) {
  return (
    <div className="pokemon-section">
      {/* Search bar*/}
      <div className="search-container">
        <h1 className="pokedex-title">Pokédex</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search Pokemon by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      {/* Initial loading state */}
      {initialLoad && (
        <div className="loading-container">
          <p className="loading-text">Loading all Pokemon...</p>
        </div>
      )}

      {/* Pokemon grid */}
      {!initialLoad && (
        <div className="pokemon-grid">
          {pokemon.map((poke) => (
            <Link
              href={`/pokemon/${poke.name}`}
              key={poke.name}
              className="pokemon-card-link"
              prefetch={false}
            >
              <div className="pokemon-card">
                <div className="pokemon-content">
                  <Image
                    src={poke.image || "/images/placeholder.svg"}
                    alt={poke.name}
                    width={80}
                    height={80}
                    unoptimized
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
            </Link>
          ))}
        </div>
      )}

      {/* Load More button */}
      {!initialLoad && hasMore && pokemon.length > 0 && (
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
      {!initialLoad && !hasMore && searchQuery.trim() === "" && pokemon.length > 0 && (
        <p className="message">All Pokemon loaded!</p>
      )}

      {!initialLoad && pokemon.length === 0 && (
        <p className="message">No Pokémon found</p>
      )}
    </div>
  );
}
