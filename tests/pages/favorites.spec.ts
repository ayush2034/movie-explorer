import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoritesPage from '../../pages/favorites.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../../stores/favorites'
    
describe('Favorites Page', () => {
  it('shows favorite movie card if favorites exist', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const favStore = useFavoritesStore()
    favStore.$patch({
      favoriteMovies: [
        {
          id: 123,
          title: 'Batman',
          poster_path: '/poster.jpg',
          release_date: '2021-01-01',
          vote_average: 7.5,
          rating: 9,
          notes: 'Loved it!',
        },  
      ],
    })

    const wrapper = mount(FavoritesPage, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('Batman')
    expect(wrapper.text()).toContain('Your Rating: ⭐ 9/10')
  })
})
