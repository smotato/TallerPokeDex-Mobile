import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typeColors, defaultTypeColor } from '../theme'

// Nombres de los tipos en español
const TYPE_LABELS = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

// Tipos con color claro: el texto blanco no se leería bien
const LIGHT_TYPES = ['electric', 'ice', 'ground', 'steel', 'bug']

export default function TypeBadge({ type }) {
  const backgroundColor = typeColors[type] ?? defaultTypeColor
  const textColor = LIGHT_TYPES.includes(type) ? colors.text : colors.textOnPrimary

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {TYPE_LABELS[type] ?? type}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
})