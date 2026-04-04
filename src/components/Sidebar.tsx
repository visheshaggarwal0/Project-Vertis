import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban as KanbanIcon, 
  Calendar as CalendarIcon, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  Bell,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../StoreContext';
import Avatar from './Avatar';
import { toast } from 'sonner';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, logout, theme, toggleTheme, notifications, markNotificationAsRead } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => n.userId === currentUser.id && !n.read);
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'leads', label: 'Leads', icon: TrendingUp },
  ];

  // Add Admin Center if user is Level 0
  if (currentUser.roleLevel === 0) {
    menuItems.push({ id: 'admin', label: 'Admin Center', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    toast.success('Successfully logged out', {
      description: 'You have been safely logged out of the workspace.'
    });
  };

  const sidebarContent = (
    <div className="h-full bg-brand-black text-brand-white flex flex-col border-r border-brand-gray-800 relative z-50 cursor-default">
      <div className="p-6 flex items-center justify-between shrink-0">
        {(!isCollapsed || isMobileMenuOpen) && (
          <div className="flex flex-col group/logo">
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold tracking-tighter font-display leading-none group-hover/logo:text-brand-white transition-colors cursor-default"
            >
              VERTIS
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-1.5 mt-1.5"
            >
              <div className="h-[1px] w-3 bg-brand-gray-700 group-hover/logo:w-5 transition-all duration-300" />
              <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-brand-gray-500 group-hover/logo:text-brand-gray-300 transition-colors cursor-default">
                Weber Innovations
              </span>
            </motion.div>
          </div>
        )}
        <div className="flex items-center gap-2 relative">
          {(!isCollapsed || isMobileMenuOpen) && (
            <>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 hover:bg-brand-gray-800 rounded-sm transition-all duration-200 text-brand-gray-400 hover:text-brand-white relative group/nav"
                title="Notifications"
              >
                <Bell size={18} className="group-hover/nav:rotate-12 transition-transform" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-brand-black" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-brand-black border border-brand-gray-800 shadow-2xl z-[100] overflow-hidden"
                  >
                    <div className="p-3 border-b border-brand-gray-800 flex justify-between items-center bg-brand-gray-900">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-white">Notifications</h3>
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-brand-gray-400 hover:text-brand-white">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto no-scrollbar bg-brand-black">
                      {myNotifications.length === 0 ? (
                        <div className="p-6 text-center text-brand-gray-500">
                          <p className="text-[10px] font-bold uppercase tracking-widest">No notifications</p>
                        </div>
                      ) : (
                        myNotifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={cn(
                              "p-4 border-b border-brand-gray-900 transition-colors hover:bg-brand-gray-900/50 cursor-pointer",
                              !n.read ? "bg-brand-gray-800/50" : ""
                            )}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-brand-white">{n.title}</p>
                                <p className="text-[10px] text-brand-gray-400 leading-tight">{n.message}</p>
                                <p className="text-[8px] text-brand-gray-500 font-bold uppercase mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                              </div>
                              {!n.read && (
                                <button 
                                  onClick={() => markNotificationAsRead(n.id)}
                                  className="p-1 text-brand-white hover:bg-brand-gray-700 rounded-full"
                                >
                                  <Check size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={toggleTheme}
                className="p-1.5 hover:bg-brand-gray-800 rounded-sm transition-all duration-200 text-brand-gray-400 hover:text-brand-white group/nav"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={18} className="group-hover/nav:-rotate-12 transition-transform" /> : <Sun size={18} className="group-hover/nav:rotate-90 transition-transform duration-500" />}
              </button>
            </>
          )}
          <button 
            onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-brand-gray-800 rounded-sm transition-all duration-200 md:block hidden text-brand-gray-400 hover:text-brand-white"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-1.5 hover:bg-brand-gray-800 rounded-sm transition-all duration-200 md:hidden block text-brand-gray-400 hover:text-brand-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-300 group cursor-pointer relative overflow-hidden",
              activeTab === item.id 
                ? "bg-brand-white text-brand-black" 
                : "text-brand-gray-400 hover:text-brand-white hover:bg-brand-gray-900/80"
            )}
          >
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1 bg-brand-white transition-transform duration-300",
              activeTab === item.id ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"
            )} />
            <item.icon size={20} className={cn(
              "shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              activeTab === item.id ? "text-brand-black" : "text-brand-gray-400 group-hover:text-brand-white"
            )} />
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="font-bold text-[10px] tracking-widest uppercase transition-all duration-300 group-hover:translate-x-1">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-gray-800 space-y-1 shrink-0">
        <div className="flex items-center gap-3 px-3 py-4 mb-2 hover:bg-brand-gray-900/50 transition-colors cursor-pointer rounded-sm group">
          <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="md" className="rounded-full group-hover:ring-2 ring-brand-white/20 transition-all" />
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate group-hover:text-brand-white transition-colors">{currentUser.name}</span>
              <span className="text-[8px] text-brand-gray-500 uppercase tracking-widest truncate">
                {currentUser.role} • {currentUser.departmentId}
              </span>
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            setActiveTab('settings');
            setIsMobileMenuOpen(false);
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 transition-all cursor-pointer group",
            activeTab === 'settings' 
              ? "bg-brand-white text-brand-black" 
              : "text-brand-gray-400 hover:text-brand-white hover:bg-brand-gray-900"
          )}
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
          {(!isCollapsed || isMobileMenuOpen) && <span className="text-[10px] uppercase font-bold tracking-widest">Settings</span>}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-brand-gray-400 hover:text-red-400 hover:bg-brand-gray-900 transition-all cursor-pointer group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {(!isCollapsed || isMobileMenuOpen) && <span className="text-[10px] uppercase font-bold tracking-widest">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '260px' }}
        className="h-screen hidden md:flex flex-col"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[70] md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
