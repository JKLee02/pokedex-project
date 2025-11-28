import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// GET API endpoint
app.get("/api/pokemons", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 36;
  const offset = (page - 1) * limit;

  try {
    // Fetch the PokeAPI list
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    const results = response.data.results;

    // Fetch full details for each Pokémon
    const pokemonDetails = await Promise.all(
      results.map(async (poke) => {
        const data = await axios.get(poke.url);

        return {
          name: data.data.name,
          image:
            data.data.sprites.other?.["official-artwork"]?.front_default ??
            data.data.sprites.front_default, // fallback image
          types: data.data.types.map((t) => t.type.name),
          height: data.data.height,
          weight: data.data.weight,
        };
      })
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

// Port listening
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
