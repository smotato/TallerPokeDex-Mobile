import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../theme'

export default function EmptyState({
  icon = 'search-outline',
  title,
  message,
  actionLabel = 'Ver todos',
  onAction,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={34} color={colors.accent} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
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
    backgroundColor: colors.surfaceTint,
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
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  buttonText: {
    color: colors.textOnSecondary,
    fontWeight: '800',
    fontSize: 14,
  },
})