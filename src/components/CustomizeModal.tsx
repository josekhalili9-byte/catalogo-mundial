import React, { useState } from 'react';
import { Jersey, Order } from '../types';
import { X, ShoppingCart, Info, Banknote } from 'lucide-react';

interface CustomizeModalProps {
  jersey: Jersey;
  onClose: () => void;
  onAddOrder: (order: Order) => void;
}

export default function CustomizeModal({ jersey, onClose, onAddOrder }: CustomizeModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [department, setDepartment] = useState('');
  const [dorsal, setDorsal] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleBuy = () => {
    if (!customerName.trim() || !department.trim()) {
      alert('Por favor, ingresa tu nombre completo y departamento.');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      jerseyId: jersey.id,
      team: jersey.team,
      type: jersey.type,
      price: jersey.price,
      customerName,
      department,
      number: dorsal,
      playerName,
      status: 'Pendiente',
      createdAt: Date.now()
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row my-8">
        
        {/* Left side: Image */}
        <div className="w-full md:w-1/2 bg-gray-100 relative">
          <img 
            src={jersey.imageUrl} 
            alt={`Playera ${jersey.team}`} 
            className="w-full h-full object-cover aspect-[4/5] md:aspect-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {jersey.type}
          </div>
        </div>

        {/* Right side: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 relative flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 mt-2">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{jersey.team}</h2>
            <p className="text-gray-500">Jersey Oficial - {jersey.type}</p>
            <div className="mt-2 text-2xl font-mono font-bold text-black">
              ${jersey.price} <span className="text-sm text-gray-500 font-sans">MXN</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto pr-2">
            <h3 className="text-lg font-bold border-b pb-2">Datos del Pedido</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Departamento *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Ej. Ventas, IT, Marketing"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Número (Dorsal)
                </label>
                <input
                  type="number"
                  value={dorsal}
                  onChange={(e) => setDorsal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all font-mono"
                  placeholder="Ej. 10"
                  min="0"
                  max="99"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nombre Jugador
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all uppercase"
                  placeholder="Ej. MESSI"
                  maxLength={15}
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800 font-medium">
                Tu pedido tarda de 2 a 3 semanas en llegar.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-3 flex items-start">
              <Banknote className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">
                Los pagos son únicamente en efectivo al momento de la entrega.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleBuy}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-black hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 mr-2" />
              Confirmar pedido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
