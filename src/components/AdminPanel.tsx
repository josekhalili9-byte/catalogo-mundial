import React, { useState, useRef } from 'react';
import { Jersey, Order, AppSettings } from '../types';
import { TEAMS, JERSEY_TYPES } from '../data';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, AlertCircle, Package, CheckCircle, Clock, Settings } from 'lucide-react';

interface AdminPanelProps {
  jerseys: Jersey[];
  onAdd: (jersey: Jersey) => void;
  onEdit: (jersey: Jersey) => void;
  onDelete: (id: string) => void;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export default function AdminPanel({ jerseys, onAdd, onEdit, onDelete, orders, onUpdateOrder, onDeleteOrder, settings, onUpdateSettings }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'settings'>('catalog');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Jersey>>({
    team: TEAMS[0],
    type: 'Local',
    price: 1200,
    imageUrl: '',
    description: ''
  });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteOrderConfirmId, setDeleteOrderConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      team: TEAMS[0],
      type: 'Local',
      price: 1200,
      imageUrl: '',
      description: ''
    });
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          if (dataUrl.length > 1000000) {
            setErrorMsg('La imagen sigue siendo muy grande después de comprimirla. Usa una URL.');
          } else {
            setFormData({ ...formData, imageUrl: dataUrl });
            setErrorMsg(null);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.team || !formData.type || !formData.price || !formData.imageUrl) {
      setErrorMsg('Por favor completa los campos obligatorios (Selección, Tipo, Precio, Imagen)');
      return;
    }

    if (editingId) {
      onEdit({ ...formData, id: editingId } as Jersey);
    } else {
      onAdd({ ...formData, id: Date.now().toString() } as Jersey);
    }
    
    resetForm();
  };

  const startEdit = (jersey: Jersey) => {
    setFormData(jersey);
    setEditingId(jersey.id);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const confirmDeleteOrder = (id: string) => {
    onDeleteOrder(id);
    setDeleteOrderConfirmId(null);
  };

  const toggleOrderStatus = (order: Order) => {
    const newStatus = order.status === 'Pendiente' ? 'Entregado' : 'Pendiente';
    onUpdateOrder({ ...order, status: newStatus });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${
            activeTab === 'catalog' 
              ? 'bg-black text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Catálogo de Playeras
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center ${
            activeTab === 'orders' 
              ? 'bg-black text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Package className="h-4 w-4 mr-2" />
          Pedidos
          {orders.filter(o => o.status === 'Pendiente').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {orders.filter(o => o.status === 'Pendiente').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center ${
            activeTab === 'settings' 
              ? 'bg-black text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-black px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {editingId ? 'Editar Playera' : 'Agregar Nueva Playera'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Selección *</label>
                    <input
                      type="text"
                      list="teams-list"
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="Ej. México"
                      required
                    />
                    <datalist id="teams-list">
                      {TEAMS.map(team => (
                        <option key={team} value={team} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Jersey *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      required
                    >
                      {JERSEY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Precio (MXN) *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all font-mono"
                          placeholder="1200"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Descripción (Opcional)</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                      placeholder="Ej. ¿No sabes qué playera elegir? Déjalo a la suerte..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de la Playera *</label>
                    
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-black transition-colors bg-gray-50">
                      <div className="space-y-1 text-center">
                        {formData.imageUrl ? (
                          <div className="relative w-full aspect-[4/5] max-h-64 mx-auto mb-4 rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, imageUrl: '' })}
                              className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black px-3 py-2 shadow-sm border border-gray-200">
                            <span>Subir archivo</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">o pega una URL abajo</p>
                      </div>
                    </div>
                    
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="mt-4 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors flex items-center"
                >
                  {editingId ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                  {editingId ? 'Guardar Cambios' : 'Agregar Playera'}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Inventario Registrado ({jerseys.length})</h3>
            
            {jerseys.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">No hay playeras registradas en el catálogo.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Selección</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jerseys.map((jersey) => (
                        <tr key={jersey.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-16 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                              <img src={jersey.imageUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{jersey.team}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{jersey.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono font-bold">${jersey.price} MXN</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => startEdit(jersey)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors mr-2"
                              title="Editar"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(jersey.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-gray-900">Pedidos ({orders.length})</h3>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No hay pedidos registrados aún.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Playera y Talla</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Personalización</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                          <div className="text-xs text-gray-600 mt-1 font-medium">📞 {order.phone}</div>
                          {order.department && <div className="text-xs text-gray-500 mt-1">Lugar: {order.department}</div>}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{order.team}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{order.type}</div>
                          <div className="text-xs font-bold text-indigo-600 mt-1">Talla: {order.size} ({order.gender})</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.playerName ? (
                              <span className="font-bold">{order.playerName}</span>
                            ) : (
                              <span className="text-gray-400 italic">Sin nombre</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            {order.number ? (
                              <span>Dorsal: <span className="font-mono font-bold">{order.number}</span></span>
                            ) : (
                              <span className="text-gray-400 italic">Sin número</span>
                            )}
                          </div>
                          {/* Removed signed version display */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleOrderStatus(order)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              order.status === 'Entregado'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            {order.status === 'Entregado' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Entregado
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pendiente
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setDeleteOrderConfirmId(order.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar pedido"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-gray-900">Configuración de la Tienda</h3>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Visibilidad de Categorías</h4>
            <p className="text-sm text-gray-500 mb-8">
              Oculta o muestra los botones de categorías en el catálogo principal. Útil cuando estás agregando inventario y no quieres que los clientes vean categorías vacías.
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Selecciones</p>
                  <p className="text-sm text-gray-500">Mostrar botón de Selecciones Nacionales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.showSelecciones}
                    onChange={(e) => onUpdateSettings({ ...settings, showSelecciones: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Clubes</p>
                  <p className="text-sm text-gray-500">Mostrar botón de Equipos de Clubes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.showClubes}
                    onChange={(e) => onUpdateSettings({ ...settings, showClubes: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Ediciones Especiales</p>
                  <p className="text-sm text-gray-500">Mostrar botón de Ediciones Especiales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.showEdicionesEspeciales}
                    onChange={(e) => onUpdateSettings({ ...settings, showEdicionesEspeciales: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Niños</p>
                  <p className="text-sm text-gray-500">Mostrar botón de Playeras para Niños</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.showNinos}
                    onChange={(e) => onUpdateSettings({ ...settings, showNinos: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Jersey Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Playera</h3>
            <p className="text-sm text-gray-500 mb-6">¿Estás seguro de que deseas eliminar esta playera del catálogo? Esta acción no se puede deshacer.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2 border border-transparent rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Pedido</h3>
            <p className="text-sm text-gray-500 mb-6">¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteOrderConfirmId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDeleteOrder(deleteOrderConfirmId)}
                className="flex-1 px-4 py-2 border border-transparent rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
