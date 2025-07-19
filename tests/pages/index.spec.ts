import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, SpyInstance } from 'vitest';
import { defineComponent } from 'vue';
import IndexPage from '../../pages/index.vue';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    tmdbApiKey: process.env.TMDB_API_KEY,
  },
}));


const mockNowPlaying = {
  results: [{ id: 1, title: 'Now Playing Movie', release_date: '2025-07-19' }],
  total_pages: 5,
};
const mockSearchInception = {
  results: [{ id: 2, title: 'Inception', release_date: '2010-07-16' }],
  total_pages: 1,
};
const mockGenres = {
  genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
};


const MovieCardStub = defineComponent({
  name: 'MovieCard',
  props: ['movie'],
  template: '<div class="movie-card">{{ movie.title }}</div>',
});

describe('pages/index.vue', () => {
  let wrapper: VueWrapper<any>;
  let fetchSpy: SpyInstance;

  beforeEach(async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString();
      if (urlString.includes('genre/movie/list')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockGenres) } as Response);
      }
      if (urlString.includes('search/movie')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSearchInception) } as Response);
      }
      if (urlString.includes('movie/now_playing')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNowPlaying) } as Response);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    wrapper = mount(IndexPage, {
      global: {
        stubs: {
          NuxtLink: true,
          MovieCard: MovieCardStub,
        },
      },
    });

    await flushPromises();
  });

  it('loads now playing movies by default', () => {
    const movieCards = wrapper.findAllComponents(MovieCardStub);
    expect(movieCards.length).toBe(1);
    expect(movieCards[0].props('movie').title).toBe('Now Playing Movie');
  });

  it('performs a search when a title is entered and form is submitted', async () => {
    const titleInput = wrapper.find('input#title');
    await titleInput.setValue('Inception');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('search/movie?'));
    expect(wrapper.findAllComponents(MovieCardStub)[0].props('movie').title).toBe('Inception');
  });

  it('triggers next page when next button is clicked', async () => {
        const buttons = wrapper.findAll('button');
        const nextButton = buttons.find(btn => btn.text() === 'Next');

        expect(nextButton).toBeDefined();

        await nextButton!.trigger('click');
        await flushPromises();

        expect(wrapper.vm.page).toBe(2);
        expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });


  it('shows "No movies found" when result is empty', async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [], total_pages: 1 }),
      } as Response)
    );

    const titleInput = wrapper.find('input#title');
    await titleInput.setValue('UnknownMovie');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(wrapper.text()).toContain('No movies found matching your criteria');
  });

  it('shows a network error when fetch fails', async () => {
    fetchSpy.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

    const titleInput = wrapper.find('input#title');
    await titleInput.setValue('ErrorMovie');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(wrapper.text()).toContain('Failed to load movies');
  });
});
