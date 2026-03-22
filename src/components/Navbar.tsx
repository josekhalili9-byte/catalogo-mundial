import React from 'react';
import { TEAMS } from '../data';
import { Lock, LogOut, Shirt } from 'lucide-react';

interface NavbarProps {
  filterTeam: string;
  setFilterTeam: (team: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  onAdminClick: () => void;
  onLogout?: () => void;
}

export default function Navbar({ filterTeam, setFilterTeam, isAdmin, setIsAdmin, onAdminClick, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setFilterTeam('Todos')}>
            <Shirt className="h-8 w-8 text-black" />
            <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">FutStore</span>
          </div>

          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <div className="relative">
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="appearance-none bg-gray-100 border-none text-gray-700 py-2 pl-4 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-black font-medium"
                >
                  <option value="Todos">Todas las Selecciones</option>
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}

            {isAdmin ? (
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else setIsAdmin(false);
                }}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
                title="Salir del Panel Admin"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-1 hidden sm:inline font-medium">Salir</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="Acceso Administrador"
              >
                <Lock className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
