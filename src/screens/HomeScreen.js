import { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchPokemonList, fetchPokemonDetail } from '../api/pokemonApi'
import PokemonCard from '../components/PokemonCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { colors, spacing, radius, typography } from '../theme'
import logoImage from '../../assets/pokedex-explorer-logo.png'

const PAGE_SIZE = 20

export default function HomeScreen({ onSelectPokemon }) {
  const insets = useSafeAreaInsets()

  const [searchText, setSearchText] = useState('') // lo que el usuario escribe
  const [query, setQuery] = useState('') // lo que realmente se busca ('' = lista normal)
  const [reloadKey, setReloadKey] = useState(0) // cambia al presionar "Reintentar"
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false) // ¿quedan más por cargar?
  const [loadingMore, setLoadingMore] = useState(false) // indicador del final de la lista
  const [loadMoreError, setLoadMoreError] = useState(false)
  const loadingMoreRef = useRef(false) // evita pedir dos páginas a la vez
  const loadMoreController = useRef(null) // para cancelar la carga si el usuario busca

  useEffect(() => {
    const controller = new AbortController()

    const loadPokemons = async () => {
        setLoading(true)
        setError(null)
        setLoadingMore(false)
        setLoadMoreError(false)
        loadingMoreRef.current = false
        try {
        if (query === '') {
           const { results, hasMore: more } = await fetchPokemonList(PAGE_SIZE, 0, controller.signal)
           setPokemons(results)
           setHasMore(more)
        } else {
            // Con búsqueda: un solo Pokémon, sin paginación
            const result = await fetchPokemonDetail(query, controller.signal)
            setPokemons([{ id: result.id, name: result.name, image: result.image }])
            setHasMore(false)
        }
        } catch (err) {
        if (err.name === 'AbortError') return // petición cancelada: no es un error real
        if (err.status === 404) {
            setPokemons([]) // el nombre no existe: estado "sin resultados"
            setHasMore(false)
        } else {
            setError('No se pudo conectar con la PokéAPI. Revisa tu internet.')
        }
        } finally {
        if (!controller.signal.aborted) setLoading(false)
        }
    }

    loadPokemons()
    return () => {
        controller.abort()
        loadMoreController.current?.abort() // cancela también una carga de "más" en curso
    }
    }, [query, reloadKey])

  const handleSearch = () => {
    setQuery(searchText.trim()) // cambiar query dispara el useEffect
  }

  const handleClear = () => {
    setSearchText('')
    setQuery('')
  }

  // CONCEPT: scroll infinito. El offset es la cantidad de Pokémon ya cargados.
    const loadMore = async () => {
    if (loading || loadingMoreRef.current || !hasMore || query !== '') return

    const controller = new AbortController()
    loadMoreController.current = controller
    loadingMoreRef.current = true
    setLoadingMore(true)
    setLoadMoreError(false)

    try {
        const { results, hasMore: more } = await fetchPokemonList(
        PAGE_SIZE,
        pokemons.length,
        controller.signal
        )
        setPokemons((prev) => {
          const existingIds = new Set(prev.map((pokemon) => pokemon.id))
          return [...prev, ...results.filter((pokemon) => !existingIds.has(pokemon.id))]
        })
        setHasMore(more)
    } catch (err) {
        if (err.name === 'AbortError') return
        setLoadMoreError(true)
    } finally {
        loadingMoreRef.current = false
        if (!controller.signal.aborted) setLoadingMore(false)
    }}

    const handleEndReached = () => {
        if (!loadMoreError) loadMore() // si falló, solo se reintenta con el botón
    }

    const renderFooter = () => {
        if (loadingMore) {
            return <ActivityIndicator size="small" color={colors.info} style={styles.footer} />
        }
        if (loadMoreError) {
            return (
            <Pressable onPress={loadMore} style={styles.footer}>
                <Text style={styles.footerError}>No se pudieron cargar más. Toca para reintentar</Text>
            </Pressable>
            )
        }
        return null
    }

  const renderContent = () => {
    if (loading) {
      return <LoadingState message="Cargando Pokémon..." />
    }

    if (error) {
      return <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
    }

    return (
      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PokemonCard pokemon={item} onPress={() => onSelectPokemon(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No encontramos ese Pokémon"
            message="Revisa el nombre o prueba con su número"
            onAction={handleClear}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Cabecera roja estilo Pokédex */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.lights}>
          <View style={styles.lens} />
          <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
        </View>

        <Image 
            source={logoImage} 
            style={styles.logo} 
            resizeMode="contain" 
        />

        <View style={styles.searchRow}>
          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Busca por nombre o número..."
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch} // tecla "Enter" del teclado
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <Pressable onPress={handleClear} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
        </View>
      </View>

      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Cabecera
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  lights: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lens: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.info,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  title: {
    ...typography.title,
    color: colors.textOnPrimary,
  },

  // Buscador
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textOnSecondary,
    fontWeight: '800',
    fontSize: 14,
  },

  // Lista
  listContent: {
    paddingHorizontal: spacing.lg - spacing.sm, // el resto lo aporta el padding de cada tarjeta
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%', // evita que una tarjeta sola en la última fila se estire
    padding: spacing.sm,
  },
  logo: {
    width: 200,
    height: 30,
    resizeMode: 'contain',
  },
})