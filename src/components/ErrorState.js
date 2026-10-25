import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../theme'

export default function ErrorState({
  icon = 'cloud-offline-outline',
  title = 'Algo salió mal',
  message,
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={34} color={colors.error} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="refresh" size={18} color={colors.textOnPrimary} />
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
})