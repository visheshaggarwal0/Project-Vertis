import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Kanban from './components/Kanban';
import CalendarView from './components/Calendar';
import Contacts from './components/Contacts';
import Leads from './components/Leads';
import AdminCenter from './components/AdminCenter';
import Settings from './components/Settings';
import Login from './Login';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './StoreContext';
import { Menu } from 'lucide-react';
import { Toaster } from 'sonner';

const AppContent = () => {
  const { isLoggedIn } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'kanban':
        return <Kanban />;
      case 'calendar':
        return <CalendarView />;
      case 'contacts':
        return <Contacts />;
      case 'leads':
        return <Leads />;
      case 'admin':
        return <AdminCenter />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-gray-50 dark:bg-brand-gray-900 overflow-hidden relative">
      <Toaster position="top-right" expand={false} richColors />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-brand-gray-800 bg-brand-black text-brand-white">
          <h1 className="text-xl font-bold tracking-tighter font-display">VERTIS</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-brand-gray-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
