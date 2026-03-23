export const TEAMS_BY_CATEGORY: Record<string, string[]> = {
  "Selecciones": [
    "México", "Estados Unidos", "Canadá", "Haití (Próximamente)", "Curazao (Próximamente)",
    "Argentina", "Brasil", "Colombia", "Ecuador (Próximamente)",
    "Inglaterra", "Francia", "España", "Portugal", "Croacia (Próximamente)",
    "Marruecos", "Egipto", "Argelia", "Ghana", "Costa de Marfil", "Cabo Verde",
    "Japón", "Corea del Sur", "Arabia Saudita", "Australia"
  ],
  "Premier League": [
    "Arsenal (Próximamente)", "Aston Villa (Próximamente)", "Chelsea (Próximamente)", "Liverpool (Próximamente)", "Manchester City (Próximamente)", "Manchester United (Próximamente)", "Newcastle (Próximamente)", "Tottenham (Próximamente)"
  ],
  "La Liga": [
    "Athletic Club (Próximamente)", "Atlético de Madrid (Próximamente)", "Barcelona (Próximamente)", "Real Madrid (Próximamente)", "Sevilla (Próximamente)", "Valencia (Próximamente)", "Villarreal (Próximamente)"
  ],
  "Serie A": [
    "AC Milan (Próximamente)", "AS Roma (Próximamente)", "Atalanta (Próximamente)", "Inter de Milán (Próximamente)", "Juventus (Próximamente)", "Lazio (Próximamente)", "Napoli (Próximamente)"
  ],
  "Bundesliga": [
    "Bayer Leverkusen (Próximamente)", "Bayern Múnich (Próximamente)", "Borussia Dortmund (Próximamente)", "RB Leipzig (Próximamente)"
  ],
  "Ligue 1": [
    "AS Mónaco (Próximamente)", "Olympique de Lyon (Próximamente)", "Olympique de Marsella (Próximamente)", "PSG (Próximamente)"
  ],
  "Ediciones Especiales": [
    "Retro", "Concept Kit", "Edición Conmemorativa", "Colaboración Especial", "Versión Jugador"
  ],
  "Otros": [
    "Mystery Box"
  ]
};

export const TEAMS = Object.values(TEAMS_BY_CATEGORY).flat().sort();

export const JERSEY_TYPES = ['Local', 'Visitante', 'Alternativa', 'Sorpresa', 'Edición Especial'];
