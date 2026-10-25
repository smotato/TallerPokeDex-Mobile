import React from 'react'
import { useState, useEffect } from 'react'
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchPokemonDetail } from '../api/pokemonApi'
import { padId, capitalize } from '../utils/formatters'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { colors, spacing, radius, typography, shadows, statColors } from '../theme'

// Nombres de las estadísticas en español
const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque esp.',
  'special-defense': 'Defensa esp.',
  speed: 'Velocidad',
}

export default function DetailScreen({ pokemonId, onBack }) {
  const insets = useSafeAreaInsets()

  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0) // cambia al presionar "Reintentar"

  // CONCEPT: useEffect con array de dependencias.
  // Solo se vuelve a ejecutar si cambia el Pokémon o se pide reintentar.
  useEffect(() => {
    const controller = new AbortController()

    const loadPokemon = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchPokemonDetail(pokemonId, controller.signal)
        setPokemon(result)
      } catch (err) {
        if (err.name === 'AbortError') return // petición cancelada: no es un error real
        setError('No se pudo cargar la ficha del Pokémon. Revisa tu internet.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPokemon()
    return () => controller.abort()
  }, [pokemonId, reloadKey])

  const renderContent = () => {
    if (loading) {
      return <LoadingState message="Cargando ficha..." />
    }

    if (error || !pokemon) {
      return (
        <ErrorState
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        {/* Imagen, número, nombre y tipos */}
        <View style={styles.heroCard}>
          <View style={styles.imageContainer}>
            {/* CONCEPT: Image con URL remota (necesita width y height explícitos) */}
            <Image
              source={{ uri: pokemon.image }}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <Text style={styles.number}>#{padId(pokemon.id)}</Text>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
        </View>

        {/* Altura y peso */}
        <View style={styles.measures}>
          <View style={styles.measureBox}>
            <Ionicons name="resize-outline" size={22} color={colors.accent} />
            <Text style={styles.measureValue}>{pokemon.height} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measureBox}>
            <Ionicons name="barbell-outline" size={22} color={colors.accent} />
            <Text style={styles.measureValue}>{pokemon.weight} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        {/* Estadísticas base */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Estadísticas base</Text>
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.name}
              label={STAT_LABELS[stat.name] ?? stat.name}
              value={stat.value}
              color={statColors[stat.name] ?? colors.info}
            />
          ))}
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {/* Cabecera roja con el botón de volver (siempre visible) */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textOnSecondary} />
          <Text style={styles.backText}>Volver a la lista</Text>
        </Pressable>
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
    paddingBottom: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backText: {
    color: colors.textOnSecondary,
    fontWeight: '800',
    fontSize: 14,
  },

  // Contenido
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 220,
  },
  number: {
    ...typography.pokemonNumber,
    fontSize: 14,
  },
  name: {
    ...typography.title,
    marginTop: spacing.xs,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  // Altura y peso
  measures: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  measureBox: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  measureValue: {
    ...typography.heading,
  },
  measureLabel: {
    ...typography.caption,
  },

  // Estadísticas
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
  },
})