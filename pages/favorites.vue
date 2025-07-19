<template>
  <div class="min-h-screen bg-gray-100 font-sans p-4">
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg p-4 mb-6 rounded-lg sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-extrabold tracking-tight">🎬 Your Favorite Movies</h1>
        <NuxtLink to="/" class="bg-white text-blue-700 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition duration-300 ease-in-out font-semibold">Back to Explorer</NuxtLink>
      </div>
    </header>

    <main class="max-w-6xl mx-auto mt-6">
      <div v-if="!favorites.length" class="bg-white shadow-xl rounded-2xl p-8 text-center mt-12 border border-gray-200">
        <p class="text-gray-600 text-xl font-medium">You haven't added any favorites yet!</p>
        <p class="text-gray-500 mt-2">Go back to the <NuxtLink to="/" class="text-blue-600 hover:underline">Movie Explorer</NuxtLink> to add some.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="movie in favorites"
          :key="movie.id" 
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col"
        >
          <NuxtLink :to="`/movie/${movie.id}`" class="flex-grow">
            <div class="relative pb-56 sm:pb-64 lg:pb-72 overflow-hidden">
              <img
                :src="getPosterUrl(movie.poster_path)"
                :alt="movie.title"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                @error="handleImageError"
              />
              <div v-if="!movie.poster_path" class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm p-4 text-center">
                No Image Available
              </div>
            </div>
            <div class="p-4">
              <h2 class="font-bold text-lg text-gray-900 mb-1 leading-tight">{{ movie.title }}</h2>
              <p class="text-sm text-gray-600 mb-2">
                {{ movie.release_date ? movie.release_date.split("-")[0] : 'N/A' }}
              </p>
              <p v-if="movie.rating" class="text-sm text-yellow-600 mb-1">
                Your Rating: ⭐ {{ movie.rating }}/10
              </p>
              <p v-if="movie.notes" class="text-sm text-gray-700 italic line-clamp-2">
                "{{ movie.notes }}"
              </p>
            </div>
          </NuxtLink>
          <div class="px-4 pb-4 mt-auto"> <button
              @click="removeFavorite(movie.id)"
              class="w-full mt-2 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out font-medium"
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