// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss','@pinia/nuxt'],
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.TMDB_API_KEY
    }
  }
})