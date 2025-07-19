import { vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { config } from '@vue/test-utils';


vi.mock('#app', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#app')>();
  return {
    ...actual,
    useRuntimeConfig: vi.fn(() => ({
      public: {
        tmdbBaseUrl: 'https://api.themoviedb.org/3',
        tmdbApiKey: process.env.TMDB_API_KEY,
        tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500',
      },
    })),
    useHead: vi.fn(() => ({})),
  };
});


vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return {
    ...actual,
    useRoute: vi.fn(() => ({ params: {}, query: {} })),
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  };
});


setActivePinia(createPinia());

config.global.stubs = {
  NuxtLink: {
    template: '<a v-bind="$attrs"><slot /></a>',
  },
};