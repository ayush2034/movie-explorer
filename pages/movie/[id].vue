<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center p-10 text-blue-600">
        <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-lg">Loading movie details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center p-10 text-red-600">
        <p class="font-bold text-xl mb-4">Oops! Something went wrong.</p>
        <p>{{ error }}</p>
        <NuxtLink to="/" class="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow">
          ← Back to Home
        </NuxtLink>
      </div>

      <!-- Movie Details -->
      <div v-else-if="movie" class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">
        <!-- Poster -->
        <div class="relative w-full md:col-span-1">
          <img
            :src="posterUrl"
            :alt="movie.title"
            class="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-md"
            @error="handleImageError"
          />
          <div
            v-if="!movie.poster_path && !posterLoaded"
            class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm p-4 rounded-xl"
          >
            No Poster Available
          </div>
        </div>

        <!-- Content -->
        <div class="md:col-span-2 space-y-5">
          <!-- Title and Favorite -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-3xl sm:text-4xl font-bold text-blue-900">{{ movie.title }}</h1>
            <button
              @click="toggleFavoriteStatus"
              class="p-3 rounded-full shadow-md transition hover:scale-110 focus:outline-none focus:ring-4"
              :class="isFavorite ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'"
              :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
            >
              <span class="text-2xl">{{ isFavorite ? '❤️' : '🤍' }}</span>
            </button>
          </div>
          
          <p class="text-gray-500 text-lg">Released: {{ movie.release_date }}</p>

          <p class="text-base text-gray-700 flex flex-wrap items-center gap-4">
            <span class="flex items-center text-yellow-500">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.834-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
              </svg>
              <span class="font-semibold">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span> / 10
            </span>
            <span><span class="font-semibold">{{ movie.runtime }}</span> mins</span>
          </p>

          <!-- Genres -->
          <div>
            <span
              v-for="g in movie.genres"
              :key="g.id"
              class="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full border border-blue-200"
            >
              {{ g.name }}
            </span>
          </div>

          <div>
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Overview</h2>
            <p class="text-gray-800 leading-relaxed text-justify">{{ movie.overview }}</p>
          </div>

          <!-- Favorite Notes -->
          <div
            v-if="isFavorite"
            class="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
          >
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Your Favorite Details</h3>
            <div class="mb-4">
              <label for="userRating" class="block text-sm font-medium text-gray-700 mb-1">Your Rating (1-10):</label>
              <input
                type="number"
                id="userRating"
                v-model.number="userRating"
                @input="updateFavoriteDetails"
                min="1"
                max="10"
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label for="userNotes" class="block text-sm font-medium text-gray-700 mb-1">Your Notes:</label>
              <textarea
                id="userNotes"
                v-model="userNotes"
                @input="updateFavoriteDetails"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Cast -->
          <div v-if="cast.length" class="pt-4">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Top Billed Cast</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              <div
                v-for="actor in cast.slice(0, 6)"
                :key="actor.id"
                class="text-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition"
              >
                <img
                  :src="getProfileImage(actor.profile_path)"
                  class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto mb-2 shadow-md border border-gray-200"
                  :alt="actor.name"
                  @error="handleActorImageError"
                />
                <p class="text-sm font-medium text-gray-800 truncate">{{ actor.name }}</p>
                <p class="text-xs text-gray-500 italic truncate">{{ actor.character }}</p>
              </div>
            </div>
          </div>

          <!-- Back to Home -->
          <NuxtLink to="/" class="text-blue-600 hover:underline inline-flex items-center group mt-4">
            <svg class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useFavoritesStore } from '../../stores/favorites';
import { ref, computed, watch, onMounted } from 'vue';
const config = useRuntimeConfig();
const route = useRoute();
const api_key = config.public.tmdbApiKey;
const movie = ref(null);
const cast = ref([]);
const error = ref(null);
const isLoading = ref(true);
const posterLoaded = ref(false);
const favStore = useFavoritesStore();
const userRating = ref(null);
const userNotes = ref('');

const isFavorite = computed(() => {
  return movie.value ? favStore.isFavorite(movie.value.id) : false;
});


watch([isFavorite, movie], () => {
  if (isFavorite.value && movie.value) {
    const favoriteData = favStore.getFavorite(movie.value.id);
    if (favoriteData) {
      userRating.value = favoriteData.rating;
      userNotes.value = favoriteData.notes;
    }
  } else {
    userRating.value = null;
    userNotes.value = '';
  }
}, { immediate: true });

function toggleFavoriteStatus() {
  if (!movie.value) return;

  if (isFavorite.value) {
    favStore.removeFavorite(movie.value.id);
  } else {
    favStore.toggleFavorite(
      {
        id: movie.value.id,
        title: movie.value.title,
        poster_path: movie.value.poster_path,
        release_date: movie.value.release_date,
        vote_average: movie.value.vote_average,
      },
      userRating.value,
      userNotes.value
    );
  }
}

function updateFavoriteDetails() {
  if (isFavorite.value && movie.value) {
    favStore.updateFavoriteDetails(movie.value.id, userRating.value, userNotes.value);
  }
}

const posterUrl = computed(() => {
  if (movie.value?.poster_path) {
    return `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`;
  }
  return "";
});

const getProfileImage = (path) => {
  return path
    ? `https://image.tmdb.org/t/p/w185${path}`
    : "https://via.placeholder.com/100x100?text=No+Image";
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
  posterLoaded.value = false;
};

const handleActorImageError = (event) => {
  event.target.src = "https://via.placeholder.com/100x100?text=No+Image";
};

onMounted(async () => {
  try {
    const movieId = route.params.id;
    if (!movieId) {
      error.value = "Movie ID not provided in the URL.";
      return;
    }

    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`
    );
    if (!movieRes.ok) {
      const errorData = await movieRes.json();
      throw new Error(errorData.status_message || `Failed to fetch movie details: ${movieRes.status}`);
    }
    movie.value = await movieRes.json();

    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${api_key}`
    );
    if (!creditsRes.ok) {
       const errorData = await creditsRes.json();
       throw new Error(errorData.status_message || `Failed to fetch movie credits: ${creditsRes.status}`);
    }
    const creditsData = await creditsRes.json();
    cast.value = creditsData.cast || [];

  } catch (err) {
    console.error("Error fetching movie details:", err);
    error.value = err.message || "Could not load movie details. Please try again.";
    movie.value = null;
    cast.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>