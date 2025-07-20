<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg p-4 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <h1 class="text-3xl font-extrabold tracking-tight">Movie Explorer</h1>
        <nav>
          <NuxtLink
            to="/favorites"
            class="bg-white text-blue-700 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition duration-300 ease-in-out font-semibold block text-center"
          >
            My Favorites
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Section -->
    <main class="p-4 sm:p-6 max-w-6xl mx-auto mt-6">
      <!-- Search Box -->
      <div class="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-200">
        <h2 class="text-2xl font-bold mb-5 text-center text-gray-800">Find Your Next Movie</h2>
        <form @submit.prevent="searchMovies" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          <!-- Title Input -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="title"
              id="title"
              placeholder="e.g., Inception"
              class="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 ease-in-out"
            />
          </div>

          <!-- Year Input -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              v-model="year"
              id="year"
              placeholder="e.g., 2010"
              type="number"
              class="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 ease-in-out"
            />
          </div>

          <!-- Genre Select -->
          <div>
            <label for="genre" class="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              v-model="genre"
              id="genre"
              class="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 ease-in-out"
            >
              <option value="">All Genres</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>

          <!-- Search Button -->
          <div>
            <button
              type="submit"
              class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md w-full sm:w-auto"
            >
              <span v-if="!isLoading">Search Movies</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div
          v-if="error"
          class="text-red-600 text-center mt-5 p-3 bg-red-100 rounded-lg border border-red-200"
        >
          {{ error }}
        </div>
      </div>

      <!-- Movie Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="movies.length > 0"
        class="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4 text-center"
      >
        <button
          @click="prevPage"
          :disabled="page === 1 || isLoading"
          class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          Prev
        </button>
        <span class="px-4 py-2 font-semibold text-lg text-gray-700">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="page === totalPages || isLoading"
          class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          Next
        </button>
      </div>

      <!-- No Results Found -->
      <div
        v-else-if="!isLoading && !error && (title || year || genre)"
        class="text-center text-gray-600 text-xl mt-10 p-6 bg-white rounded-lg shadow-md"
      >
        No movies found matching your criteria. Try a different search!
      </div>
    </main>
  </div>
</template>
  

  <script setup>
  import { ref, onMounted } from 'vue';
  const config = useRuntimeConfig();
  const title = ref("");
  const year = ref("");
  const genre = ref("");
  const error = ref("");
  const movies = ref([]);
  const genres = ref([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isSearching = ref(false);
  const isLoading = ref(false);
  const api_key = config.public.tmdbApiKey;

  onMounted(async () => {
    await fetchGenres();
    await fetchMovies();
  });

  const fetchGenres = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      genres.value = data.genres;
    } catch (err) {
      console.error("Failed to fetch genres:", err);
      error.value = "Failed to load genres. Please try again later.";
    }
  };

  const fetchMovies = async () => {
    isLoading.value = true;
    error.value = "";
    try {
      let url = "";
      let queryParams = new URLSearchParams({
        api_key: api_key,
        page: page.value.toString(),
      });

      if (title.value) {
        url = `https://api.themoviedb.org/3/search/movie`;
        queryParams.append("query", title.value);
        if (year.value) {
          queryParams.append("primary_release_year", year.value);
        }

      } else if (year.value || genre.value) {
        url = `https://api.themoviedb.org/3/discover/movie`;
        if (year.value) {
          queryParams.append("primary_release_year", year.value);
        }
        if (genre.value) {
          queryParams.append("with_genres", genre.value);
        }
      } else {
        url = `https://api.themoviedb.org/3/movie/now_playing`;
      }

      const res = await fetch(`${url}?${queryParams.toString()}`);
      if (!res.ok) {
        if (res.status === 404) {
            movies.value = [];
            totalPages.value = 0;
            return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      movies.value = data.results || [];
      totalPages.value = data.total_pages;
      
      if (movies.value.length === 0 && (title.value || year.value || genre.value)) {
        error.value = "No movies found matching your criteria.";
      }

    } catch (err) {
      console.error("Failed to fetch movies:", err);
      error.value = "Failed to load movies. Please check your internet connection or try again later.";
      movies.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const searchMovies = async () => {
    if (!title.value && !year.value && !genre.value) {
      error.value = "Please enter at least one search criterion (Title, Year, or Genre).";
      isSearching.value = false;
      page.value = 1;
      await fetchMovies();
      return;
    }
    page.value = 1;
    await fetchMovies();
  };

  const nextPage = async () => {
    if (page.value < totalPages.value) {
      page.value++;
      await fetchMovies();
    }
  };

  const prevPage = async () => {
    if (page.value > 1) {
      page.value--;
      await fetchMovies();
    }
  };
  </script>