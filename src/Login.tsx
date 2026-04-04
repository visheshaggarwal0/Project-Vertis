import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { motion } from 'motion/react';
import { LogIn, Shield, Users, Briefcase } from 'lucide-react';
import Avatar from './components/Avatar';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { users, login } = useStore();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail) {
      toast.error('Please select a user to log in');
      return;
    }
    const success = login(selectedEmail, password);
    if (success) {
      toast.success('Logged in successfully');
    } else {
      toast.error('Login failed', {
        description: 'Incorrect password for this profile.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-brand-gray-200 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-black text-white mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase font-display">Vertis CRM</h1>
          <p className="text-brand-gray-500 text-sm mt-2">Select a profile to enter the workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
              Available Profiles
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedEmail(user.email)}
                  className={`flex items-center gap-4 p-3 border transition-all text-left ${
                    selectedEmail === user.email 
                      ? 'border-brand-black bg-brand-gray-50 ring-1 ring-brand-black' 
                      : 'border-brand-gray-100 hover:border-brand-gray-300'
                  }`}
                >
                  <Avatar src={user.avatarUrl} name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-brand-gray-500 uppercase tracking-wider truncate">
                      {user.role} • {user.departmentId}
                    </p>
                  </div>
                  {selectedEmail === user.email && (
                    <div className="w-2 h-2 bg-brand-black rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter password"
              className="w-full p-4 bg-brand-gray-50 border border-brand-gray-200 focus:border-brand-black outline-none transition-all font-bold text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-[10px] text-brand-gray-400 font-medium">Default: vertis_crm</p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-brand-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-gray-800 transition-colors"
          >
            <LogIn size={18} />
            Enter Workspace
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-gray-100 text-center">
          <p className="text-[10px] text-brand-gray-400 uppercase tracking-widest font-bold">
            Secure Enterprise Access • v1.0.4
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
