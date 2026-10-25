import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { padId, capitalize } from '../utils/formatters'
import { colors, spacing, radius, typography, shadows } from '../theme'

export default function PokemonCard({ pokemon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shadow,
        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* Contenedor interno: recorta la imagen con las esquinas redondeadas */}
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {/* CONCEPT: Image con URL remota (necesita width y height explícitos) */}
          <Image
            source={{ uri: pokemon.image }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.number}>#{padId(pokemon.id)}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  // La sombra va en un contenedor sin overflow:hidden (si no, iOS la ignora)
  shadow: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  number: {
    ...typography.pokemonNumber,
  },
  name: {
    ...typography.subtitle,
  },
})