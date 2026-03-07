"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { typeColours } from "@/app/utils/typeColours";

export default function PokemonDetailPage() {
  const params = useParams();
  const name = params.name;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!name) return;

      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_BASE_URL}/api/pokemon/${name}`);

        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon details");
        }

        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  // Convert height from decimeters to meters
  const convertHeight = (height) => {
    return (height / 10).toFixed(1);
  };

  // Convert weight from hectograms to kilograms
  const convertWeight = (weight) => {
    return (weight / 10).toFixed(1);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <Link href="/" className={styles.backLink}>
            Back to Pokedex
          </Link>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Pokemon not found</p>
          <Link href="/" className={styles.backLink}>
            Back to Pokedex
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back Link */}
      <Link href="/" className={styles.backLink}>
        ← Back to Pokedex
      </Link>

      {/* Top Section - Pokemon Name */}
      <h1 className={styles.pokemonName}>{pokemon.name}</h1>

      {/* Main Content - Left and Right Sections */}
      <div className={styles.content}>
        {/* Left Section - Pokemon Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Right Section - Details */}
        <div className={styles.detailsSection}>
          {/* Types */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Type</h2>
            <div className={styles.types}>
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={styles.typeBadge}
                  style={{
                    backgroundColor: typeColours[type] || "#f3f4f6",
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Height */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Height</h2>
            <p className={styles.statValue}>
              {convertHeight(pokemon.height)} m
            </p>
          </div>

          {/* Weight */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Weight</h2>
            <p className={styles.statValue}>
              {convertWeight(pokemon.weight)} kg
            </p>
          </div>

          {/* Abilities */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Abilities</h2>
            <div className={styles.abilities}>
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className={styles.ability}>
                  <span className={styles.abilityName}>{ability.name}</span>
                  {ability.is_hidden && (
                    <span className={styles.hiddenBadge}>Hidden Ability</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
