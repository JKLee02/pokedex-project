"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./PokemonGrid.css";
import { typeColours } from "../utils/typeColours";

const POKEMON_TYPES = [
  "grass",
  "poison",
  "fire",
  "flying",
  "electric",
  "water",
  "bug",
  "normal",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ghost",
  "ice",
  "dragon",
  "dark",
  "steel",
  "ground",
];

export default function PokemonGrid({
  pokemon,
  handleSearch,
  searchQuery,
  setSearchQuery,
  loadMore,
  loading,
  initialLoad,
  hasMore,
  selectedTypes = [],
  toggleType,
  clearTypes,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempSelectedTypes, setTempSelectedTypes] = useState([]);

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      setTempSelectedTypes([...selectedTypes]);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTypeToggle = (type) => {
    setTempSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleApply = () => {
    const toAdd = tempSelectedTypes.filter((t) => !selectedTypes.includes(t));
    const toRemove = selectedTypes.filter(
      (t) => !tempSelectedTypes.includes(t),
    );
    toAdd.forEach(toggleType);
    toRemove.forEach(toggleType);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setTempSelectedTypes([]);
    clearTypes();
    setIsDropdownOpen(false);
  };

  return (
    <div className="pokemon-section">
      <div className="search-container">
        <h1 className="pokedex-title">Pokédex</h1>
        <div className="search-wrapper">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search Pokemon by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <button
            type="button"
            className="filter-toggle-btn"
            onClick={handleDropdownToggle}
          >
            <span className="filter-label">Advanced Search</span>
            <svg
              className={`filter-arrow ${isDropdownOpen ? "open" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className={`type-dropdown ${isDropdownOpen ? "open" : ""}`}>
            <p className="type-title">Filter by Types</p>
            <div className="type-grid">
              {POKEMON_TYPES.map((type) => (
                <label
                  key={type}
                  className={`type-checkbox ${tempSelectedTypes.includes(type) ? "selected" : ""}`}
                  style={{ backgroundColor: typeColours[type] || "#f3f4f6" }}
                >
                  <input
                    type="checkbox"
                    checked={tempSelectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
            <div className="dropdown-actions">
              <button type="button" className="clear-btn" onClick={handleClear}>
                Clear
              </button>
              <button type="button" className="apply-btn" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {initialLoad && (
        <div className="loading-container">
          <p className="loading-text">Loading all Pokemon...</p>
        </div>
      )}

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
                    loading="lazy"
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

      {!initialLoad &&
        !hasMore &&
        searchQuery.trim() === "" &&
        selectedTypes.length === 0 &&
        pokemon.length > 0 && <p className="message">All Pokemon loaded!</p>}

      {!initialLoad && pokemon.length === 0 && (
        <p className="message">No Pokémon found</p>
      )}
    </div>
  );
}
