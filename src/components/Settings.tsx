import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Globe, 
  Mail, 
  Phone,
  Lock, 
  Save,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import Avatar from './Avatar';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { currentUser, updateUser, theme, toggleTheme } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    password: currentUser.password || 'vertis_crm',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: {
        assignments: true,
        comments: true,
        mentions: true,
      },
      browser: {
        assignments: true,
        comments: true,
        mentions: true,
      }
    },
    twoFactor: false,
    theme: 'light',
  });

  const avatars = [
    'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140039.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140043.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140042.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140040.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140041.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140044.png',
  ];

  const [showAvatarPalette, setShowAvatarPalette] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser(currentUser.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    setIsSaving(false);
    toast.success('Settings updated successfully');
  };

  const handleUpdateAvatar = (url: string) => {
    updateUser(currentUser.id, { avatarUrl: url });
    setShowAvatarPalette(false);
    toast.success('Avatar updated');
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.newPassword) {
      updateUser(currentUser.id, { password: formData.newPassword });
      setFormData({ ...formData, password: formData.newPassword, newPassword: '', confirmPassword: '' });
      toast.success('Password updated');
    } else {
      toast.info('No changes made to password');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
  ];

  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-brand-gray-50 dark:bg-brand-gray-900 no-scrollbar transition-colors duration-300">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Settings</h2>
        <p className="text-brand-gray-500 font-medium text-sm md:text-base">Manage your account and preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 text-left font-bold uppercase tracking-widest text-xs transition-all",
                activeSection === section.id 
                  ? 'bg-brand-black text-white dark:bg-brand-white dark:text-brand-black' 
                  : 'bg-white border border-brand-gray-100 hover:bg-brand-gray-50 dark:bg-brand-gray-800 dark:border-brand-gray-700 dark:hover:bg-brand-gray-700 dark:text-brand-white'
              )}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            {activeSection === 'profile' && (
              <form onSubmit={handleSave} className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-brand-gray-100 dark:border-brand-gray-800">
                  <div className="relative group">
                    <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="lg" className="w-24 h-24" />
                    <button 
                      type="button" 
                      onClick={() => setShowAvatarPalette(!showAvatarPalette)}
                      className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest"
                    >
                      Change
                    </button>
                    
                    {showAvatarPalette && (
                      <div className="absolute top-full left-0 mt-4 p-4 bg-white dark:bg-brand-gray-800 border border-brand-gray-200 dark:border-brand-gray-700 shadow-2xl z-50 w-64 grid grid-cols-4 gap-2">
                        {avatars.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleUpdateAvatar(url)}
                            className="hover:scale-110 transition-transform"
                          >
                            <img src={url} alt={`Avatar ${i}`} className="w-10 h-10 rounded-full" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold">{currentUser.name}</h3>
                    <p className="text-sm text-brand-gray-500 font-medium uppercase tracking-wider">
                      {currentUser.role} • {currentUser.departmentId}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">Active</span>
                      <span className="px-2 py-0.5 bg-brand-gray-100 text-brand-gray-500 text-[10px] font-bold uppercase tracking-widest">Level {currentUser.roleLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 flex items-center gap-2">
                      <User size={12} /> Full Name
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 bg-brand-gray-50 border border-brand-gray-200 focus:border-brand-black outline-none transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 flex items-center gap-2">
                      <Mail size={12} /> Email Address
                    </label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 bg-brand-gray-50 border border-brand-gray-200 focus:border-brand-black outline-none transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 flex items-center gap-2">
                      <Phone size={12} /> Phone Number
                    </label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 bg-brand-gray-50 border border-brand-gray-200 focus:border-brand-black outline-none transition-all font-bold text-sm dark:bg-brand-gray-800 dark:border-brand-gray-700 dark:text-brand-white dark:focus:border-brand-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 flex items-center gap-2">
                      <Lock size={12} /> Password
                    </label>
                    <input 
                      type="text" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-3 bg-brand-gray-50 border border-brand-gray-200 focus:border-brand-black outline-none transition-all font-bold text-sm dark:bg-brand-gray-800 dark:border-brand-gray-700 dark:text-brand-white dark:focus:border-brand-white"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'assignments', label: 'Task Assignments', desc: 'When someone assigns a task to you.' },
                      { id: 'comments', label: 'New Comments', desc: 'When someone comments on your tasks.' },
                      { id: 'mentions', label: 'Mentions', desc: 'When someone mentions you in a comment.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-brand-gray-50 dark:bg-brand-gray-800 border border-brand-gray-100 dark:border-brand-gray-700">
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs text-brand-gray-500">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setFormData({
                            ...formData, 
                            notifications: {
                              ...formData.notifications,
                              email: {
                                ...formData.notifications.email,
                                [item.id]: !formData.notifications.email[item.id as keyof typeof formData.notifications.email]
                              }
                            }
                          })}
                          className={cn(
                            "w-12 h-6 transition-colors relative",
                            formData.notifications.email[item.id as keyof typeof formData.notifications.email] ? 'bg-brand-black dark:bg-brand-white' : 'bg-brand-gray-300 dark:bg-brand-gray-600'
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white dark:bg-brand-black transition-all",
                            formData.notifications.email[item.id as keyof typeof formData.notifications.email] ? 'left-7' : 'left-1'
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Browser Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'assignments', label: 'Task Assignments', desc: 'Real-time alerts for new tasks.' },
                      { id: 'comments', label: 'New Comments', desc: 'Instant alerts for new comments.' },
                      { id: 'mentions', label: 'Mentions', desc: 'Immediate notification when mentioned.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-brand-gray-50 dark:bg-brand-gray-800 border border-brand-gray-100 dark:border-brand-gray-700">
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs text-brand-gray-500">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setFormData({
                            ...formData, 
                            notifications: {
                              ...formData.notifications,
                              browser: {
                                ...formData.notifications.browser,
                                [item.id]: !formData.notifications.browser[item.id as keyof typeof formData.notifications.browser]
                              }
                            }
                          })}
                          className={cn(
                            "w-12 h-6 transition-colors relative",
                            formData.notifications.browser[item.id as keyof typeof formData.notifications.browser] ? 'bg-brand-black dark:bg-brand-white' : 'bg-brand-gray-300 dark:bg-brand-gray-600'
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white dark:bg-brand-black transition-all",
                            formData.notifications.browser[item.id as keyof typeof formData.notifications.browser] ? 'left-7' : 'left-1'
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8">
                <form onSubmit={handleSecuritySave} className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">New Password</label>
                      <input 
                        type="password" 
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        className="w-full p-3 bg-brand-gray-50 dark:bg-brand-gray-800 border border-brand-gray-200 dark:border-brand-gray-700 focus:border-brand-black dark:focus:border-brand-white outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full p-3 bg-brand-gray-50 dark:bg-brand-gray-800 border border-brand-gray-200 dark:border-brand-gray-700 focus:border-brand-black dark:focus:border-brand-white outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">Update Password</button>
                </form>

                <div className="pt-8 border-t border-brand-gray-100 dark:border-brand-gray-800">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-brand-gray-50 dark:bg-brand-gray-800 border border-brand-gray-100 dark:border-brand-gray-700">
                    <div>
                      <p className="text-sm font-bold">Enable 2FA</p>
                      <p className="text-xs text-brand-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                      className={cn(
                        "w-12 h-6 transition-colors relative",
                        formData.twoFactor ? 'bg-brand-black dark:bg-brand-white' : 'bg-brand-gray-300 dark:bg-brand-gray-600'
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white dark:bg-brand-black transition-all",
                        formData.twoFactor ? 'left-7' : 'left-1'
                      )} />
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-gray-100 dark:border-brand-gray-800">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Security History</h3>
                  <div className="space-y-2">
                    {[
                      { event: 'Password Changed', date: '2 days ago', location: 'London, UK' },
                      { event: 'New Login', date: '5 days ago', location: 'London, UK' },
                      { event: '2FA Disabled', date: '1 month ago', location: 'London, UK' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 text-[10px] font-bold uppercase tracking-widest border-b border-brand-gray-50 dark:border-brand-gray-800 last:border-0">
                        <span className="text-brand-gray-500">{log.event}</span>
                        <div className="text-right">
                          <p>{log.date}</p>
                          <p className="text-brand-gray-400 font-medium lowercase tracking-normal">{log.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 dark:text-brand-gray-400 mb-4">Theme Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        if (theme !== 'light') toggleTheme();
                      }}
                      className={cn(
                        "p-6 border-2 text-left transition-all group",
                        theme === 'light' 
                          ? "border-brand-black bg-brand-gray-50 dark:border-brand-white dark:bg-brand-gray-800" 
                          : "border-brand-gray-100 hover:border-brand-gray-300 dark:border-brand-gray-700 dark:hover:border-brand-gray-600"
                      )}
                    >
                      <div className="w-full h-24 bg-white border border-brand-gray-200 mb-4 flex items-center justify-center dark:bg-brand-gray-900 dark:border-brand-gray-700">
                        <Sun size={32} className="text-brand-gray-300 group-hover:text-brand-black dark:group-hover:text-brand-white transition-colors" />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-widest dark:text-brand-white">Light Mode</p>
                      <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400 uppercase tracking-tighter">Default high-contrast interface</p>
                    </button>
                    <button 
                      onClick={() => {
                        if (theme !== 'dark') toggleTheme();
                      }}
                      className={cn(
                        "p-6 border-2 text-left transition-all group",
                        theme === 'dark' 
                          ? "border-brand-black bg-brand-gray-900 dark:border-brand-white dark:bg-brand-gray-800" 
                          : "border-brand-gray-100 hover:border-brand-gray-300 dark:border-brand-gray-700 dark:hover:border-brand-gray-600"
                      )}
                    >
                      <div className="w-full h-24 bg-brand-black border border-brand-gray-800 mb-4 flex items-center justify-center dark:bg-brand-black dark:border-brand-gray-900">
                        <Moon size={32} className="text-brand-gray-600 group-hover:text-brand-white transition-colors" />
                      </div>
                      <p className={cn("text-sm font-bold uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-brand-black dark:text-brand-white")}>Dark Mode</p>
                      <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400 uppercase tracking-tighter">Reduced eye strain in low light</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== 'profile' && activeSection !== 'notifications' && activeSection !== 'appearance' && activeSection !== 'security' && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <AlertCircle size={48} className="text-brand-gray-300" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest">Coming Soon</p>
                  <p className="text-xs text-brand-gray-500">This setting section is currently under development.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
