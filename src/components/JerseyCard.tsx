import React from 'react';
import { Jersey } from '../types';
import { ShoppingBag } from 'lucide-react';

interface JerseyCardProps {
  jersey: Jersey;
  onCustomize: (jersey: Jersey) => void;
}

export default function JerseyCard({ jersey, onCustomize }: JerseyCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 flex flex-col h-full">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={jersey.imageUrl}
          alt={`Playera ${jersey.team}`}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {jersey.type}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{jersey.team}</h3>
        {jersey.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{jersey.description}</p>
        )}
        <div className="flex justify-between items-center text-gray-600 mb-4">
          <span className="font-medium text-sm text-gray-500">
            Jersey Oficial
          </span>
          <span className="font-mono font-bold text-xl text-black">
            ${jersey.price} <span className="text-xs text-gray-500 font-sans">MXN</span>
          </span>
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => onCustomize(jersey)}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Pedir playera
          </button>
        </div>
      </div>
    </div>
  );
}
