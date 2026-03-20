import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// In-memory cache configuration
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Helper to delay between batches
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to fetch Pokemon details in batches
async function fetchPokemonDetailsBatched(
  results,
  batchSize = 20,
  delayMs = 50,
) {
  const allDetails = [];

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);

    const batchDetails = await Promise.all(
      batch.map(async (poke) => {
        try {
          const { data } = await axios.get(poke.url);
          return {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            types: data.types.map((t) => t.type.name),
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((a) => ({
              name: a.ability.name,
              is_hidden: a.is_hidden,
            })),
          };
        } catch (err) {
          console.error(`Error fetching ${poke.name}:`, err.message);
          return null;
        }
      }),
    );

    allDetails.push(...batchDetails.filter((p) => p !== null));

    // Add delay between batches (except for last batch)
    if (i + batchSize < results.length) {
      await delay(delayMs);
    }
  }

  return allDetails;
}

// GET API endpoint - List of Pokemons
app.get("/api/pokemons", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 36;
  const cacheKey = `pokemons:page:${page}:limit:${limit}`;

  // Check cache first
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return res.json(cachedData);
  }

  const offset = (page - 1) * limit;

  try {
    // Fetch the PokeAPI list
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    );

    const results = response.data.results;

    // Fetch full details for each Pokémon in batches
    const pokemonDetails = await fetchPokemonDetailsBatched(results, 20, 100);

    // Return as a merged JSON response
    const responseData = {
      pokemon: pokemonDetails,
      page,
      limit,
      hasMore: !!response.data.next,
    };

    // Store in cache
    setCache(cacheKey, responseData);
    console.log(`Cache set for ${cacheKey}`);

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching Pokémon:", error.message);
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

// GET API endpoint - Single Pokemon details
app.get("/api/pokemon/:name", async (req, res) => {
  const { name } = req.params;
  const cacheKey = `pokemon:${name}`;

  // Check cache first
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return res.json(cachedData);
  }

  try {
    // Fetch Pokemon details from PokeAPI
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`,
    );

    const data = response.data;

    // Format the Pokemon data
    const pokemonDetails = {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other?.["official-artwork"]?.front_default ??
        data.sprites.front_default,
      types: data.types.map((t) => t.type.name),
      height: data.height, // in decimeters
      weight: data.weight, // in hectograms
      abilities: data.abilities.map((a) => ({
        name: a.ability.name,
        is_hidden: a.is_hidden,
      })),
    };

    // Store in cache
    setCache(cacheKey, pokemonDetails);
    console.log(`Cache set for ${cacheKey}`);

    res.json(pokemonDetails);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error.message);
    res.status(500).json({ error: "Failed to fetch Pokemon details" });
  }
});

// Port listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`),
);
