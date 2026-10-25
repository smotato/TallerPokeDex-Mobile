const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

// 'https://pokeapi.co/api/v2/pokemon/25/'  ->  25
export const getIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean) // quita los vacíos del "/" final
  return Number(parts[parts.length - 1])
}

// 25  ->  '025'
export const padId = (id) => String(id).padStart(3, '0')

// 'pikachu'  ->  'Pikachu'
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// 25  ->  URL de la imagen oficial, sin pedir la ficha completa
export const getImageUrl = (id) => `${IMAGE_BASE_URL}/${id}.png`