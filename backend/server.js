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
    timestamp: Date.now()
  });
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

    // Fetch full details for each Pokémon
    const pokemonDetails = await Promise.all(
      results.map(async (poke, index) => {
        const data = await axios.get(poke.url);

        return {
          id: data.data.id,
          name: data.data.name,
          image:
            data.data.sprites.other?.["official-artwork"]?.front_default ??
            data.data.sprites.front_default, // fallback image
          types: data.data.types.map((t) => t.type.name),
          height: data.data.height,
          weight: data.data.weight,
          abilities: data.data.abilities.map((a) => ({
            name: a.ability.name,
            is_hidden: a.is_hidden,
          })),
        };
      }),
    );

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
