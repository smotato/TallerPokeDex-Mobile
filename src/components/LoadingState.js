import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, spacing, typography } from '../theme'

export default function LoadingState({ message = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.info} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
})