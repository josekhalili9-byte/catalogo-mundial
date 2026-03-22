import React from 'react';
import { Jersey } from '../types';
import JerseyCard from './JerseyCard';
import { Shirt } from 'lucide-react';

interface CatalogProps {
  jerseys: Jersey[];
  filterTeam: string;
  onCustomize: (jersey: Jersey) => void;
}

export default function Catalog({ jerseys, filterTeam, onCustomize }: CatalogProps) {
  const filteredJerseys = filterTeam === 'Todos' 
    ? jerseys 
    : jerseys.filter(j => j.team === filterTeam);

  return (
    <div className="py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Colección Exclusiva
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Descubre nuestra selección de playeras oficiales de las mejores selecciones del mundo.
        </p>
      </div>

      {filteredJerseys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Shirt className="h-24 w-24 mb-4 opacity-20" />
          <p className="text-xl font-medium text-gray-500">No hay playeras disponibles.</p>
          <p className="text-sm mt-2">Intenta con otra selección o vuelve más tarde.</p>
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
