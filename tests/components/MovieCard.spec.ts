import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '../../components/MovieCard.vue'

describe('MovieCard.vue', () => {
  const mockMovie = {
    id: 1,
    title: 'Inception',
    poster_path: '/poster.jpg',
    release_date: '2010-07-16',
    vote_average: 8.8,
    vote_count: 20000,
    overview: 'A mind-bending thriller.',
  }

  it('renders movie details correctly', () => {
    const wrapper = mount(MovieCard, {
      props: { movie: mockMovie },
    })

    expect(wrapper.text()).toContain('Inception')
    expect(wrapper.text()).toContain('2010')
    expect(wrapper.text()).toContain('8.8')
    expect(wrapper.find('img').attributes('src')).toContain('/poster.jpg')
  })

  it('displays "No Image Available" if no poster_path', async () => {
    const movieNoPoster = { ...mockMovie, poster_path: '' }
    const wrapper = mount(MovieCard, {
      props: { movie: movieNoPoster },
    })
    expect(wrapper.text()).toContain('No Image Available')
  })
})
