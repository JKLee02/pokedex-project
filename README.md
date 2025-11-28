# Pokedex Project

This is a Next.js Pokedex website that uses a Node.js/Express backend API that fetches Pokémon data from the PokéAPI.
Features include search, load more, Pokémon types with coloured badges and a responsive UI with carousel and static banners.

## 1. Setup instructions

- Make sure that you already have **Git** and **Node.js** (this includes **npm**) installed on your computer to clone and run this application on your device.

  ## 1. Clone the repository

  ```
  git clone https://github.com/JKLee02/pokedex-project.git
  ```

  ## 2. Go into the repository

  ```
  cd pokedex-project
  ```

  ## Frontend

  ### 1. Install the dependencies for frontend

  ```
  cd frontend
  npm install
  ```

  ### 2. Run the development server

  ```
  npm run dev
  ```

  ## Backend

  ### 1. Install the dependencies for backend

  ```
  cd backend
  npm install
  ```

  ### 2. Start the backend server

  ```
  node server.js
  ```

## 2. API Documentation

## Overview

The Pokedex API provides Pokémon data fetched from the [PokéAPI](https://pokeapi.co/).
It supports pagination and returns Pokémon details including name, image, types, height, and weight.

The API is then utilized by the Next.js frontend to display Pokémon with search and load more functionality.

-Base URL:

```
http://localhost:3001/api
```

## Endpoints

```
GET /pokemons
```

Used to fetch a list of Pokémon with pagination.

### Query Parameters

| Parameter | Type   | Default | Description             |
| --------- | ------ | ------- | ----------------------- |
| `page`    | number | 1       | Page number to fetch    |
| `limit`   | number | 36      | No. of Pokémon per page |

Example Request:

```
GET http://localhost:3001/api/pokemons?page=1&limit=36
```

