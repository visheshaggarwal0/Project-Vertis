import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Plus, UserPlus, Shield, Building, Mail, Trash2, Edit2 } from 'lucide-react';
import { motion, animate } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from './Modal';
import { JobLevel, User, DepartmentName, RoleName } from '../types';
import { DEPARTMENTS, ROLES } from '../constants';

import { toast } from 'sonner';

import Avatar from './Avatar';

const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [value]);
  return <span>{Math.round(displayValue)}</span>;
};

const AdminCenter: React.FC = () => {
  const { users, addUser, deleteUser, updateUser, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: RoleName;
    roleLevel: JobLevel;
    departmentId: string;
  }>({
    name: '',
    email: '',
    phone: '',
    password: 'vertis_crm',
    role: ROLES[ROLES.length - 1].label,
    roleLevel: ROLES[ROLES.length - 1].level,
    departmentId: DEPARTMENTS[0],
  });

  if (currentUser.roleLevel !== 0) {
    return (
      <div className="h-full flex items-center justify-center bg-brand-gray-50">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Access Denied</h2>
          <p className="text-brand-gray-500">Only the Administrator can access this control center.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success('Employee Updated', {
        description: `${formData.name}'s profile has been updated.`
      });
    } else {
      addUser({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Employee Onboarded', {
        description: `${formData.name} has been added to the organization.`
      });
    }
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: ROLES[ROLES.length - 1].label,
      roleLevel: ROLES[ROLES.length - 1].level,
      departmentId: DEPARTMENTS[0],
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: user.password || 'vertis_crm',
      role: user.role,
      roleLevel: user.roleLevel,
      departmentId: user.departmentId || DEPARTMENTS[0],
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-brand-gray-50 flex flex-col overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Admin Control Center</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Manage organization employees, roles, and departments.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <UserPlus size={18} />
          Onboard Employee
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-l-brand-black">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 mb-1">Total Employees</h3>
          <p className="text-3xl font-bold"><CountUp value={users.length} /></p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-brand-black">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 mb-1">Departments</h3>
          <p className="text-3xl font-bold"><CountUp value={DEPARTMENTS.length} /></p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-brand-black">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 mb-1">System Status</h3>
          <p className="text-3xl font-bold text-brand-black uppercase font-display">Active</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-brand-black text-brand-white text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role & Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100">
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-brand-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatarUrl} name={user.name} size="md" />
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-brand-gray-500">{user.email}</p>
                        <p className="text-[10px] text-brand-gray-400 font-medium">{user.phone || 'No phone'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Building size={14} className="text-brand-gray-400" />
                      {user.departmentId || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide">{user.role}</p>
                      <p className="text-[10px] text-brand-gray-400 font-bold uppercase">Level {user.roleLevel}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 text-brand-gray-400 hover:text-brand-black transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {user.id !== currentUser.id && (
                        <button 
                          onClick={() => {
                            deleteUser(user.id);
                            toast.success('Employee Removed');
                          }}
                          className="p-2 text-brand-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Edit Employee" : "Onboard New Employee"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Email Address</label>
            <input 
              required
              type="email" 
              className="input-field" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Phone Number</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Password</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Role</label>
              <select 
                className="input-field"
                value={formData.roleLevel}
                onChange={(e) => {
                  const level = Number(e.target.value) as JobLevel;
                  const role = ROLES.find(r => r.level === level);
                  if (role) {
                    setFormData({ ...formData, roleLevel: level, role: role.label });
                  }
                }}
              >
                {ROLES.map(role => (
                  <option key={role.level} value={role.level}>{role.label} (L{role.level})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Department</label>
              <select 
                className="input-field"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              {editingUser ? "Update Employee" : "Create Account"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCenter;
