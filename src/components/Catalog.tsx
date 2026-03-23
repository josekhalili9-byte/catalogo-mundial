import React from 'react';
import { Jersey } from '../types';
import JerseyCard from './JerseyCard';
import { Shirt, Sparkles, Package } from 'lucide-react';
import { TEAMS_BY_CATEGORY, CLUB_CATEGORIES } from '../data';

const mysteryBoxJersey: Jersey = {
  id: 'mystery-box',
  team: 'Mystery Box',
  type: 'Edición Sorpresa',
  price: 3000,
  imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop',
  description: '¡Déjate sorprender! Recibe 2 playeras del mundial y 1 playera retro (de mundial o de clubes).'
};

interface CatalogProps {
  jerseys: Jersey[];
  filterTeam: string;
  setFilterTeam: (team: string) => void;
  onCustomize: (jersey: Jersey) => void;
}

export default function Catalog({ jerseys, filterTeam, setFilterTeam, onCustomize }: CatalogProps) {
  const isCategory = Object.keys(TEAMS_BY_CATEGORY).includes(filterTeam);
  const isClubes = filterTeam === 'Clubes';
  
  const filteredJerseys = (filterTeam === 'Todos' 
    ? jerseys 
    : isClubes
      ? jerseys.filter(j => CLUB_CATEGORIES.some(cat => TEAMS_BY_CATEGORY[cat].includes(j.team)))
      : isCategory
        ? jerseys.filter(j => TEAMS_BY_CATEGORY[filterTeam].includes(j.team))
        : jerseys.filter(j => j.team === filterTeam)
  ).sort((a, b) => a.team.localeCompare(b.team));

  return (
    <div className="py-8">
      <div className="mb-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg max-w-2xl mx-auto mb-6 text-sm font-medium">
          Por el momento solo tenemos playeras de selecciones, pero estamos trabajando en las demás.
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Colección Exclusiva
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Descubre nuestra selección de playeras oficiales de las mejores selecciones y clubes del mundo.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { id: 'Selecciones', label: 'Selecciones' },
            { id: 'Clubes', label: 'Clubes' },
            { id: 'Ediciones Especiales', label: 'Ediciones Especiales' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterTeam(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filterTeam === category.id || (category.id === 'Clubes' && CLUB_CATEGORIES.includes(filterTeam))
                  ? 'bg-black text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {filterTeam === 'Ediciones Especiales' && (
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-4">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">Edición Especial</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                Mystery Box
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto md:mx-0">
                ¿Te gustan las sorpresas? Pide nuestra Mystery Box y recibe <strong>2 playeras del mundial y 1 playera retro</strong> (de mundial o de clubes). ¡Atrévete a descubrir qué joyas te tocarán!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <div className="text-3xl font-mono font-bold text-white">
                  $3000 <span className="text-sm text-gray-400 font-sans">MXN</span>
                </div>
                <button 
                  onClick={() => onCustomize(mysteryBoxJersey)}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Pedir Mystery Box
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop" 
                  alt="Mystery Box" 
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-yellow-500/30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredJerseys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Shirt className="h-24 w-24 mb-4 opacity-20" />
          <p className="text-xl font-medium text-gray-500">
            {filterTeam.includes('Próximamente') 
              ? 'Esta selección estará disponible próximamente.' 
              : 'No hay playeras disponibles.'}
          </p>
          <p className="text-sm mt-2">
            {filterTeam.includes('Próximamente') 
              ? '¡Mantente atento a nuestras actualizaciones!' 
              : 'Intenta con otra selección o vuelve más tarde.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredJerseys.map(jersey => (
            <JerseyCard key={jersey.id} jersey={jersey} onCustomize={onCustomize} />
          ))}
        </div>
      )}
    </div>
  );
}
