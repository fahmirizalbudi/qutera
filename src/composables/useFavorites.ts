import { ref } from 'vue'

export function useFavorites() {
  const favorites = ref<number[]>([])

  const loadFavorites = () => {
    const saved = localStorage.getItem('qutera_favorites')
    if (saved) favorites.value = JSON.parse(saved)
  }

  const toggleFavorite = (id: number) => {
    const index = favorites.value.indexOf(id)
    if (index > -1) favorites.value.splice(index, 1)
    else favorites.value.push(id)
    localStorage.setItem('qutera_favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (id: number) => favorites.value.includes(id)

  return {
    favorites,
    loadFavorites,
    toggleFavorite,
    isFavorite
  }
}
