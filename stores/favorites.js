import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoriteMovies: [],
  }),
  actions: {
    toggleFavorite(movie, rating = null, notes = "") {
      if (!movie || typeof movie.id === "undefined") {
        console.error(
          "Invalid movie object provided to toggleFavorite:",
          movie
        );
        return;
      }

      const existingMovieIndex = this.favoriteMovies.findIndex(
        (fav) => fav.id === movie.id
      );

      if (existingMovieIndex > -1) {
        if (rating !== null || notes !== "") {
          this.favoriteMovies[existingMovieIndex] = {
            ...this.favoriteMovies[existingMovieIndex],
            rating: rating,
            notes: notes,
          };
        } else {
          this.favoriteMovies.splice(existingMovieIndex, 1);
        }
      } else {
        this.favoriteMovies.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          rating: rating,
          notes: notes,
        });
      }
    },
    updateFavoriteDetails(movieId, rating, notes) {
      const index = this.favoriteMovies.findIndex((fav) => fav.id === movieId);
      if (index > -1) {
        this.favoriteMovies[index].rating = rating;
        this.favoriteMovies[index].notes = notes;
      }
    },
    removeFavorite(movieId) {
      this.favoriteMovies = this.favoriteMovies.filter(
        (fav) => fav.id !== movieId
      );
    },
    getFavorite(movieId) {
      return this.favoriteMovies.find((fav) => fav.id === movieId);
    },
    isFavorite(movieId) {
      return this.favoriteMovies.some((fav) => fav.id === movieId);
    },
  },
  persist: true,
});
