import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// GET API endpoint - List of Pokemons
app.get("/api/pokemons", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 36;
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
    res.json({
      pokemon: pokemonDetails,
      page,
      limit,
      hasMore: !!response.data.next,
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error.message);
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

// GET API endpoint - Single Pokemon details
app.get("/api/pokemon/:name", async (req, res) => {
  const { name } = req.params;

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
