<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <NuxtLink :to="`/movie/${movie.id}`"> 
      <div class="relative pb-56 sm:pb-64 lg:pb-72 overflow-hidden">
        <img
          :src="moviePoster"
          :alt="movie.title"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          @error="handleImageError"
        />
        <div v-if="!movie.poster_path" class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm p-4">
          No Image Available
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-xl font-bold text-gray-900 mb-1 leading-tight">{{ movie.title }}</h3>
        <p class="text-gray-600 text-sm mb-2">{{ movieReleaseYear }}</p>
        <div class="flex items-center text-yellow-500 text-sm">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.834-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
          </svg>
          <span class="font-semibold">{{ movieRating }}</span>
          <span class="text-gray-500 ml-1">({{ movie.vote_count }} votes)</span>
        </div>
        <p class="text-gray-700 text-sm mt-3 line-clamp-3">{{ movie.overview }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const moviePoster = computed(() => {
  return props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : '';
});

const movieReleaseYear = computed(() => {
  return props.movie.release_date ? new Date(props.movie.release_date).getFullYear() : 'N/A';
});

const movieRating = computed(() => {
  return props.movie.vote_average ? props.movie.vote_average.toFixed(1) : 'N/A';
});

const handleImageError = (event) => {
  event.target.style.display = 'none';
};
</script>