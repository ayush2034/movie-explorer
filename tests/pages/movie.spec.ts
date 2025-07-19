import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieDetails from '../../pages/movie/[id].vue'
import { createTestingPinia } from '@pinia/testing'


vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    tmdbApiKey: process.env.TMDB_API_KEY,
  },
}))

vi.stubGlobal('useRoute', () => ({
  params: { id: '123' },
}))

describe('Movie Detail Page', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('fetches and renders movie details', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 123,
          title: 'Interstellar',
          release_date: '2014-11-07',
          poster_path: '/poster.jpg',
          vote_average: 8.6,
          runtime: 169,
          genres: [{ id: 1, name: 'Sci-Fi' }],
          overview: 'A space adventure.',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cast: [{ id: 1, name: 'Matthew McConaughey', character: 'Cooper', profile_path: null }],
        }),
      })

    const wrapper = mount(MovieDetails, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    await new Promise(resolve => setTimeout(resolve, 20))

    expect(wrapper.text()).toContain('Interstellar')
    expect(wrapper.text()).toContain('A space adventure.')
    expect(wrapper.text()).toContain('Sci-Fi')
  })

  it('handles fetch error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ status_message: 'Movie not found' }) })
    )

    const wrapper = mount(MovieDetails, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(wrapper.text()).toContain('Oops! Something went wrong')
  })
})
