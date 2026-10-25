import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '../theme'

const MAX_STAT = 255 // el máximo posible según la API

export default function StatBar({ label, value, color = colors.info }) {
  // Ancho proporcional al valor (nunca pasa del 100%)
  const widthPercent = Math.min(value / MAX_STAT, 1) * 100

  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value}>{value}</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    width: 90,
    color: colors.textMuted,
  },
  value: {
    ...typography.body,
    width: 34,
    fontWeight: '800',
    textAlign: 'right',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
})