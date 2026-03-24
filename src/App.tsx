import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import CustomizeModal from './components/CustomizeModal';
import { Jersey, Order, AppSettings } from './types';

export default function App() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [filterTeam, setFilterTeam] = useState<string>('Selecciones');
  const [customizingJersey, setCustomizingJersey] = useState<Jersey | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    showSelecciones: true,
    showClubes: true,
    showEdicionesEspeciales: true
  });
  const seededRef = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      } else {
        // Initialize if it doesn't exist
        setDoc(doc(db, 'settings', 'global'), {
          showSelecciones: true,
          showClubes: true,
          showEdicionesEspeciales: true
        });
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    return () => {
      unsubscribeSettings();
    };
  }, []);

  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      // Sort by createdAt descending
      ordersData.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    return () => {
      unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    const unsubscribeDb = onSnapshot(collection(db, 'jerseys'), (snapshot) => {
      const jerseysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
      setJerseys(jerseysData);
      setLoading(false);

      // Seed initial data if empty and not already seeded in this session
      if (jerseysData.length === 0 && !seededRef.current) {
        seededRef.current = true;
        const initialJerseys = [
          {
            team: 'México',
            type: 'Local',
            price: 1599,
            imageUrl: 'https://images.unsplash.com/photo-1518005020250-685948843dd9?q=80&w=800&auto=format&fit=crop',
            description: 'Jersey oficial de la Selección Mexicana - Local 2024'
          },
          {
            team: 'Argentina',
            type: 'Local',
            price: 1699,
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
            description: 'Jersey oficial de la Selección Argentina - Campeón del Mundo'
          },
          {
            team: 'Brasil',
            type: 'Local',
            price: 1599,
            imageUrl: 'https://images.unsplash.com/photo-1518005020250-685948843dd9?q=80&w=800&auto=format&fit=crop',
            description: 'Jersey oficial de la Selección Brasileña - Pentacampeón'
          },
          {
            team: 'España',
            type: 'Local',
            price: 1599,
            imageUrl: 'https://images.unsplash.com/photo-1518005020250-685948843dd9?q=80&w=800&auto=format&fit=crop',
            description: 'Jersey oficial de la Selección Española - La Roja'
          },
          {
            team: 'Francia',
            type: 'Local',
            price: 1599,
            imageUrl: 'https://images.unsplash.com/photo-1518005020250-685948843dd9?q=80&w=800&auto=format&fit=crop',
            description: 'Jersey oficial de la Selección Francesa - Les Bleus'
          }
        ];

        initialJerseys.forEach(async (j) => {
          try {
            await addDoc(collection(db, 'jerseys'), j);
          } catch (e) {
            console.error("Error seeding jersey:", e);
          }
        });
      }
    }, (error) => {
      console.error("Error fetching jerseys:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeDb();
    };
  }, []);

  const handleAddJersey = async (jersey: Jersey) => {
    try {
      const { id, ...jerseyData } = jersey;
      await addDoc(collection(db, 'jerseys'), jerseyData);
    } catch (error) {
      console.error("Error adding jersey:", error);
      alert("Error al agregar la playera");
    }
  };

  const handleEditJersey = async (updatedJersey: Jersey) => {
    try {
      const { id, ...jerseyData } = updatedJersey;
      await updateDoc(doc(db, 'jerseys', id), jerseyData);
    } catch (error) {
      console.error("Error updating jersey:", error);
      alert("Error al actualizar la playera");
    }
  };

  const handleDeleteJersey = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'jerseys', id));
    } catch (error) {
      console.error("Error deleting jersey:", error);
      alert("Error al eliminar la playera");
    }
  };

  const handleAddOrder = async (order: Order) => {
    try {
      const { id, ...orderData } = order;
      await addDoc(collection(db, 'orders'), orderData);
      alert("Pedido realizado correctamente");
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Error al realizar el pedido");
    }
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const { id, ...orderData } = updatedOrder;
      await updateDoc(doc(db, 'orders', id), orderData);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar el pedido");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error al eliminar el pedido");
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error al actualizar la configuración");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar 
        filterTeam={filterTeam} 
        setFilterTeam={setFilterTeam} 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onAdminClick={() => setShowAdminLogin(true)}
        onLogout={handleLogout}
        settings={settings}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : isAdmin ? (
          <AdminPanel 
            jerseys={jerseys} 
            onAdd={handleAddJersey} 
            onEdit={handleEditJersey} 
            onDelete={handleDeleteJersey}
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        ) : (
          <Catalog 
            jerseys={jerseys} 
            filterTeam={filterTeam} 
            setFilterTeam={setFilterTeam}
            onCustomize={(jersey) => setCustomizingJersey(jersey)}
            settings={settings}
          />
        )}
      </main>

      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onLogin={handleLogin} 
        />
      )}

      {customizingJersey && (
        <CustomizeModal 
          jersey={customizingJersey} 
          onClose={() => setCustomizingJersey(null)}
          onAddOrder={handleAddOrder}
        />
      )}
    </div>
  );
}
