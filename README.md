# 🎬 Movie Explorer – Nuxt 3

Movie Explorer is a modern and responsive Nuxt 3 application that allows users to:

- Search for movies using title, release year, and genre.
- View detailed movie information.
- Manage a personal list of favorite movies.
- Enjoy pagination and error handling.
- Built with Nuxt 3, Vue 3 (Composition API), Tailwind CSS, and Pinia.

## 🚀 Features

- 🔍 **Search** by title, year, or genre using TMDB API
- 🎞️ **Movie details** with overview, genres, release info, and poster
- ⭐ **Favorites** stored via Pinia state management
- ⏭️ **Pagination** for navigating through results
- ⚠️ **Graceful error handling** with user-friendly messages
- 💅 **Tailwind CSS** UI for clean, responsive design
- ✅ **Unit and integration testing** with Vitest & Vue Test Utils

---

## 📦 Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/ayush2034/movie.git
cd movie
npm install
```

---

## 🔑 Runtime Configuration

Create a `.env` file at the root with your TMDB API key:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

---

## 🧪 Running the Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

---

### Run All Tests:

```bash
npm run test
```

Tests are located in the `/tests` folder and cover:

- ✅ Components (e.g., `MovieCard.vue`)
- ✅ Pages (e.g., `index.vue`, `movie/[id].vue`)
- ✅ Favorite store logic (Pinia)
- ✅ API fetch handling & error scenarios

---

## 📁 Project Structure

```bash
├── assets/              
├── components/          
│   ├── MovieCard.vue
├── composables/         
├── pages/               
│   ├── index.vue
│   └── movie/[id].vue
├── stores/              
│   └── favorites.js
├── tests/               
│   ├── components/
│   ├── pages/
│   └── setup.ts
├── nuxt.config.ts       
├── tailwind.config.ts   
└── .env
```

---

## 🧰 Tech Stack

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vitest](https://vitest.dev/) for testing
- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data

--- 