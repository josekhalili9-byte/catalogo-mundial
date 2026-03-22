import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, logout } from './firebase';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import CustomizeModal from './components/CustomizeModal';
import { Jersey, Order } from './types';

export default function App() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [filterTeam, setFilterTeam] = useState<string>('Todos');
  const [customizingJersey, setCustomizingJersey] = useState<Jersey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'josekhalili9@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const unsubscribeDb = onSnapshot(collection(db, 'jerseys'), (snapshot) => {
      const jerseysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
      setJerseys(jerseysData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jerseys:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
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

  const handleAddOrder = (order: Order) => {
    setOrders([...orders, order]);
    alert("Pedido realizado correctamente");
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    setIsAdmin(false);
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
          />
        ) : (
          <Catalog 
            jerseys={jerseys} 
            filterTeam={filterTeam} 
            onCustomize={(jersey) => setCustomizingJersey(jersey)}
          />
        )}
      </main>

      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onLogin={() => {
            setIsAdmin(true);
            setShowAdminLogin(false);
          }} 
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
