<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg p-4 mb-6 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">🎬 Your Favorite Movies</h1>
        <NuxtLink
          to="/"
          class="bg-white text-blue-700 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition duration-300 ease-in-out font-semibold text-sm sm:text-base"
        >
          Back to Explorer
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-2 sm:px-4 mt-6">
      <div v-if="!favorites.length" class="bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center mt-12 border border-gray-200">
        <p class="text-gray-600 text-lg sm:text-xl font-medium">You haven't added any favorites yet!</p>
        <p class="text-gray-500 mt-2 text-sm sm:text-base">
          Go back to the
          <NuxtLink to="/" class="text-blue-600 hover:underline">Movie Explorer</NuxtLink>
          to add some.
        </p>
      </div>

      <!-- Favorite Movies -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mt-6">
        <div
          v-for="movie in favorites"
          :key="movie.id"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col"
        >
          <NuxtLink :to="`/movie/${movie.id}`" class="flex-grow">
            <div class="relative pb-[150%] overflow-hidden">
              <img
                :src="getPosterUrl(movie.poster_path)"
                :alt="movie.title"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                @error="handleImageError"
              />
              <div
                v-if="!movie.poster_path"
                class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm p-4 text-center"
              >
                No Image Available
              </div>
            </div>
            <div class="p-4">
              <h2 class="font-bold text-base sm:text-lg text-gray-900 mb-1 leading-tight">{{ movie.title }}</h2>
              <p class="text-xs sm:text-sm text-gray-600 mb-1">
                {{ movie.release_date ? movie.release_date.split("-")[0] : 'N/A' }}
              </p>
              <p v-if="movie.rating" class="text-xs sm:text-sm text-yellow-600 mb-1">
                Your Rating: ⭐ {{ movie.rating }}/10
              </p>
              <p v-if="movie.notes" class="text-xs sm:text-sm text-gray-700 italic line-clamp-2">
                "{{ movie.notes }}"
              </p>
            </div>
          </NuxtLink>

          <div class="px-4 pb-4 mt-auto">
            <button
              @click="removeFavorite(movie.id)"
              class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out text-sm sm:text-base"
            >
              Remove from Favorites
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { useFavoritesStore } from '../stores/favorites';
import { computed } from 'vue';
const favStore = useFavoritesStore()
const favorites = computed(() => favStore.favoriteMovies)

function getPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '';
}

function removeFavorite(movieId) {
  favStore.removeFavorite(movieId)
}

const handleImageError = (event) => {
  event.target.style.display = 'none';
};
</script>