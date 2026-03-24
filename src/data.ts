export const TEAMS_BY_CATEGORY: Record<string, string[]> = {
  "Selecciones": [
    "México", "Estados Unidos", "Canadá", "Haití", "Curazao",
    "Argentina", "Brasil", "Colombia", "Ecuador",
    "Inglaterra", "Francia", "España", "Portugal", "Croacia",
    "Marruecos", "Egipto", "Argelia", "Ghana", "Costa de Marfil", "Cabo Verde",
    "Japón", "Corea del Sur", "Arabia Saudita", "Australia"
  ],
  "Premier League": [
    "Arsenal", "Aston Villa", "Chelsea", "Liverpool", "Manchester City", "Manchester United", "Newcastle", "Tottenham"
  ],
  "La Liga": [
    "Athletic Club", "Atlético de Madrid", "Barcelona", "Real Madrid", "Sevilla", "Valencia", "Villarreal"
  ],
  "Serie A": [
    "AC Milan", "AS Roma", "Atalanta", "Inter de Milán", "Juventus", "Lazio", "Napoli"
  ],
  "Bundesliga": [
    "Bayer Leverkusen", "Bayern Múnich", "Borussia Dortmund", "RB Leipzig"
  ],
  "Ligue 1": [
    "AS Mónaco", "Olympique de Lyon", "Olympique de Marsella", "PSG"
  ],
  "Ediciones Especiales": [
    "Retro", "Concept Kit", "Edición Conmemorativa", "Colaboración Especial", "Versión Jugador", "Firmadas"
  ],
  "Otros": [
    "Mystery Box"
  ]
};

export const CLUB_CATEGORIES = [
  "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"
];

export const ORDERED_TEAMS = Object.values(TEAMS_BY_CATEGORY).flat();
export const TEAMS = [...ORDERED_TEAMS].sort();

export const JERSEY_TYPES = ['Local', 'Visitante', 'Alternativa', 'Sorpresa', 'Edición Especial'];
