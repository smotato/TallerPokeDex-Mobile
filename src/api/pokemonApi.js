import { getIdFromUrl, getImageUrl } from '../utils/formatters'

const BASE_URL = 'https://pokeapi.co/api/v2'

// La lista solo trae { name, url }: el id sale del final de la URL
// y la imagen se arma con el id, sin pedir la ficha completa.
const mapPokemonListItem = (row) => {
    const id = getIdFromUrl(row.url)

    return {
        id,
        name: row.name,
        image: getImageUrl(id),
    }
}

// La ficha trae muchísimos campos: nos quedamos solo con los que usa la app.
const mapPokemonDetail = (row) => {
    return {
        id: row.id,
        name: row.name,
        // height viene en decímetros y weight en hectogramos: / 10 para m y kg
        height: row.height / 10,
        weight: row.weight / 10,
        image:
            row.sprites?.other?.['official-artwork']?.front_default ??
            getImageUrl(row.id),
        types: row.types.map((item) => item.type.name),
        stats: row.stats.map((item) => ({
            name: item.stat.name,
            value: item.base_stat,
        })),
    }
}

// Crea un error que además guarda el código http, para poder distinguir
// un "no existe" (404) de un fallo de red o del servidor.
const createHttpError = (response) => {
    const error = new Error(`Error http ${response.status}`)
    error.status = response.status
    return error
}

// GET /pokemon?limit={limit}&offset={offset}
export const fetchPokemonList = async (limit = 20, offset = 0, signal) => {
    const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    const response = await fetch(url, { signal })

    // CONCEPT: revisar response.ok antes de response.json()
    if (!response.ok) {
        throw createHttpError(response)
    }

    const data = await response.json()

    return {
        results: data.results.map(mapPokemonListItem),
        // "next" es null cuando ya no hay más páginas
        hasMore: data.next !== null,
    }
}

// GET /pokemon/{nombre o id}
export const fetchPokemonDetail = async (nameOrId, signal) => {
    // Nombres en minúsculas y sin espacios al inicio o al final
    const query = String(nameOrId).trim().toLowerCase()
    const url = `${BASE_URL}/pokemon/${encodeURIComponent(query)}`
    const response = await fetch(url, { signal })

    // Si el nombre no existe responde 404 con texto plano (no JSON),
    // por eso se revisa response.ok antes de llamar response.json()
    if (!response.ok) {
        throw createHttpError(response)
    }

    const data = await response.json()
    return mapPokemonDetail(data)
}