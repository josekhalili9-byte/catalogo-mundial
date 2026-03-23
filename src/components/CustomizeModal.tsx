import React, { useState } from 'react';
import { Jersey, Order } from '../types';
import { X, ShoppingCart, Info, Banknote, Check } from 'lucide-react';

interface CustomizeModalProps {
  jersey: Jersey;
  onClose: () => void;
  onAddOrder: (order: Order) => void;
}

export default function CustomizeModal({ jersey, onClose, onAddOrder }: CustomizeModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState<'Hombre' | 'Mujer' | 'Niño' | ''>('');
  const [size, setSize] = useState('');
  const [dorsal, setDorsal] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBuy = () => {
    if (!customerName.trim()) {
      alert('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      alert('Por favor, ingresa un número de teléfono válido para contactarte.');
      return;
    }
    if (!gender) {
      alert('Por favor, selecciona si la playera es para hombre o mujer.');
      return;
    }
    if (!size) {
      alert('Por favor, selecciona una talla.');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      jerseyId: jersey.id,
      team: jersey.team,
      type: jersey.type,
      price: jersey.price,
      customerName: customerName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      gender: gender as 'Hombre' | 'Mujer' | 'Niño',
      size,
      number: dorsal,
      playerName,
      status: 'Pendiente',
      createdAt: Date.now()
    };

    onAddOrder(newOrder);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600 mb-2">¡Pedido realizado con éxito!</h3>
          <p className="text-gray-500">Tu pedido ha sido registrado correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Botón de cerrar general */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white hover:text-black transition-all rounded-full p-2 shadow-md"
        >
          <X className="h-6 w-6" />
        </button>

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
          <div className="mb-6 mt-2 md:mt-0">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1 pr-8">{jersey.team}</h2>
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
                Teléfono de contacto *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Ej. 55 1234 5678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Departamento, clase o dirección
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Ej. Ventas, 3ro A, Calle 123"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Corte de la playera *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Hombre', 'Mujer', 'Niño'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g as 'Hombre' | 'Mujer' | 'Niño')}
                    className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${gender === g ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Talla *
              </label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Niño</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['Niño S', 'Niño M', 'Niño L', 'Niño XL'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSize(t)}
                        className={`py-2 text-sm font-bold rounded-lg border transition-all ${size === t ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                      >
                        {t.replace('Niño ', '')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adulto</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['Adulto S', 'Adulto M', 'Adulto L', 'Adulto XL'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSize(t)}
                        className={`py-2 text-sm font-bold rounded-lg border transition-all ${size === t ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                      >
                        {t.replace('Adulto ', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
