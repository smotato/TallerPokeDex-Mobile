import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from './src/screens/HomeScreen'
import DetailScreen from './src/screens/DetailScreen'
import { colors } from './src/theme'

export default function App() {
  // CONCEPT: useState para decidir qué vista se muestra
  // null = lista, un id = ficha de ese Pokémon
  const [selectedId, setSelectedId] = useState(null)

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        {selectedId === null ? (
          <HomeScreen onSelectPokemon={setSelectedId} />
        ) : (
          <DetailScreen
            pokemonId={selectedId}
            onBack={() => setSelectedId(null)}
          />
        )}
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
})