import { Platform } from 'react-native'

export const colors = {
    primary: '#E33030',       // rojo Pokédex: cabecera, botones principales
    primaryDark: '#B82121',   // rojo oscuro: estado presionado, bordes de cabecera
    secondary: '#FFD303',     // amarillo: acentos, botón de buscar, destacados
    info: '#59A2BD',          // azul: indicadores de carga, enlaces, detalles
    accent: '#F57018',        // naranja: números de Pokémon, resaltes

    // Fondos
    background: '#F4F5F7',    // fondo gris claro de las pantallas
    surface: '#FFFFFF',       // tarjetas y campos de texto
    surfaceTint: '#FFF8D6',   // amarillo muy suave para zonas destacadas

    // Texto
    text: '#1F2937',          // texto principal (gris casi negro)
    textMuted: '#6B7280',     // texto secundario
    textOnPrimary: '#FFFFFF', // texto sobre fondo rojo
    textOnSecondary: '#1F2937', // texto sobre fondo amarillo

    border: '#E3E5E8',
    borderStrong: '#1F2937',

    error: '#E33030',
    success: '#3FA34D',

    overlay: 'rgba(0,0,0,0.35)',
}

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
}

export const radius = {
    sm: 8,
    md: 16,
    lg: 24,
    full: 999,
}

export const typography = {
    title: { fontSize: 26, fontWeight: '800', color: colors.text },
    heading: { fontSize: 20, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    body: { fontSize: 14, fontWeight: '500', color: colors.text },
    caption: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
    pokemonNumber: { fontSize: 12, fontWeight: '800', color: colors.accent, letterSpacing: 0.5 },
}

export const shadows = {
    card: Platform.select({
        android: { elevation: 3 },
        default: {},
    }),
}

export const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
}

export const defaultTypeColor = '#9CA3AF'

export const statColors = {
    hp: '#E33030',
    attack: '#F57018',
    defense: '#FFD303',
    'special-attack': '#59A2BD',
    'special-defense': '#7AC74C',
    speed: '#F95587',
}

export default { colors, spacing, radius, typography, shadows, typeColors, defaultTypeColor, statColors }