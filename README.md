# Pokedex Project

This is a Next.js Pokedex website that uses a Node.js/Express backend API that fetches Pokémon data from the PokéAPI.

## Features

- **Search By Name** - Search Pokémon by name
- **Advanced Type Filter** - Filter Pokémon by type(s) with the "Advanced Search" dropdown
- **Load More Pagination** - Load Pokémon progressively with "Load More" button
- **Responsive UI** - Mobile-friendly design with carousel and static banners
- **Pokémon Details** - View each Pokémon info including name, types, height, weight, and abilities

## Screenshots

### Desktop View

![pokedex desktop view](./screenshots/pokedex-desktop-view.PNG)

### Mobile View

<p align="center">
  <img src="./screenshots/pokedex-mobile-view.PNG" alt="pokedex mobile view" width="400">
</p>

### Individual Pokemon Page

![pokedex individual pokemon page](./screenshots/pokedex-individual-pokemon-page.PNG)

## Prerequisites

- **Git** - for cloning the repository
- **Node.js** (v18 or higher) - includes npm

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/JKLee02/pokedex-project.git
cd pokedex-project
```

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

The backend will run on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Documentation

### Overview

The Pokedex backend API provides Pokémon data fetched from the [PokéAPI](https://pokeapi.co/). It supports pagination and returns Pokémon details including name, image, types, height, weight, and abilities.

**Base URL**: `http://localhost:3001/api`

---

### GET /pokemons

Fetch a list of Pokémon with pagination.

**Query Parameters**

| Parameter | Type    | Default | Description                |
| --------- | ------- | ------- | -------------------------- |
| `page`    | integer | 1       | Page number to fetch       |
| `limit`   | integer | 36      | Number of Pokémon per page |

**Example Request**

```bash
GET http://localhost:3001/api/pokemons?page=1&limit=36
```

**Successful Response**

```json
{
  "pokemon": [
    {
      "name": "bulbasaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      "types": ["grass", "poison"],
      "height": 7,
      "weight": 69,
      "abilities": [
        { "name": "overgrow", "is_hidden": false },
        { "name": "chlorophyll", "is_hidden": true }
      ]
    }
  ],
  "page": 1,
  "limit": 36,
  "hasMore": true
}
```

**Response Fields**

| Field               | Type    | Description                                      |
| ------------------- | ------- | ------------------------------------------------ |
| `pokemon`           | array   | List of Pokémon objects                          |
| `pokemon.name`      | string  | Pokémon's name                                   |
| `pokemon.image`     | string  | URL to Pokémon sprite image                      |
| `pokemon.types`     | array   | Pokémon types (may have multiple)                |
| `pokemon.height`    | integer | Height of Pokémon (in decimeters)                |
| `pokemon.weight`    | integer | Weight of Pokémon (in hectograms)                |
| `pokemon.abilities` | array   | Abilities of Pokémon (includes hidden abilities) |
| `page`              | integer | Current page number                              |
| `limit`             | integer | Number of Pokémon per page                       |
| `hasMore`           | boolean | Indicates if more Pokémon are available to fetch |

---

### GET /pokemon/:name

Fetch details for a single Pokémon by name.

**Example Request**

```bash
GET http://localhost:3001/api/pokemon/bulbasaur
```

**Successful Response**

```json
{
  "id": 1,
  "name": "bulbasaur",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  "types": ["grass", "poison"],
  "height": 7,
  "weight": 69,
  "abilities": [
    { "name": "overgrow", "is_hidden": false },
    { "name": "chlorophyll", "is_hidden": true }
  ]
}
```

**Response Fields**

| Field       | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| `id`        | integer | Pokémon's ID number                   |
| `name`      | string  | Pokémon's name                        |
| `image`     | string  | URL to Pokémon official artwork       |
| `types`     | array   | Pokémon types (may have multiple)     |
| `height`    | integer | Height of Pokémon (in decimeters)     |
| `weight`    | integer | Weight of Pokémon (in hectograms)     |
| `abilities` | array   | Abilities (includes hidden abilities) |

---

### Error Response

```json
{
  "error": "Failed to fetch Pokémon"
}
```

### Example Usage (in JavaScript)

```javascript
async function getPokemon() {
  try {
    const response = await fetch(
      "http://localhost:3001/api/pokemons?page=1&limit=36",
    );
    const data = await response.json();
    console.log(data.pokemon);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}
getPokemon();
```

## Demo

**Live Demo**: https://pokedex-project123.vercel.app/

> **Note**: The Pokémon data may take a few minutes to appear on first load due to Render's free tier cold start.
