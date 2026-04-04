import React, { useState } from 'react';
import { Search, Plus, TrendingUp, Target, ArrowRight, Filter, Trash2, MoreVertical, LayoutGrid, List, Edit2 } from 'lucide-react';
import { useStore } from '../StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from './Modal';

import { getVisibleLeads } from '../constants';
import { Lead } from '../types';
import { toast } from 'sonner';

const Leads: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead, stats, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'board'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    value: 0,
    status: 'new' as any,
    probability: 50,
  });

  const [editLeadData, setEditLeadData] = useState<Partial<Lead>>({});

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(newLead);
    toast.success('Lead Added', {
      description: `${newLead.name} from ${newLead.company} has been added to the pipeline.`
    });
    setIsModalOpen(false);
    setNewLead({
      name: '',
      company: '',
      value: 0,
      status: 'new',
      probability: 50,
    });
  };

  const handleEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    updateLead(selectedLead.id, editLeadData);
    toast.success('Lead Updated');
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const visibleLeads = getVisibleLeads(currentUser, leads);

  const filteredLeads = visibleLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'];

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {filteredLeads.map((lead, index) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-8 border-l-8 border-l-brand-black relative group"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                className="p-2 text-brand-gray-400 hover:text-brand-black transition-all cursor-pointer"
              >
                <MoreVertical size={18} />
              </button>
              
              <AnimatePresence>
                {activeMenu === lead.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-40 bg-brand-black border border-brand-gray-800 shadow-2xl z-50"
                  >
                    <button 
                      onClick={() => {
                        setSelectedLead(lead);
                        setEditLeadData(lead);
                        setIsEditModalOpen(true);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 hover:text-brand-white hover:bg-brand-gray-900 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 size={14} />
                      Edit Lead
                    </button>
                    <button 
                      onClick={() => {
                        deleteLead(lead.id);
                        toast.success('Lead Removed');
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete Lead
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">{lead.name}</h3>
              <p className="text-sm text-brand-gray-500 font-medium">{lead.company}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tighter">${lead.value.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Estimated Value</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-black rounded-full" />
                <span className="text-sm font-bold uppercase tracking-wide">{lead.status}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Probability</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-brand-black" />
                <span className="text-sm font-bold">{lead.probability}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Next Step</p>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-brand-black" />
                <span className="text-sm font-bold">Proposal Review</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Confidence Level</span>
              <span>{lead.probability}%</span>
            </div>
            <div className="w-full h-1.5 bg-brand-gray-100">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${lead.probability}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-brand-black"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              setSelectedLead(lead);
              setIsDetailsModalOpen(true);
            }}
            className="w-full btn-secondary flex items-center justify-center gap-2 group cursor-pointer"
          >
            View Opportunity Details
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ))}
    </div>
  );

  const renderBoardView = () => (
    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar h-[calc(100vh-350px)]">
      {LEAD_STATUSES.map(status => {
        const statusLeads = filteredLeads.filter(l => l.status === status);
        return (
          <div key={status} className="w-80 shrink-0 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                {status}
                <span className="text-[10px] bg-brand-gray-200 px-2 py-0.5 rounded-full">{statusLeads.length}</span>
              </h3>
            </div>
            <div className="flex-1 bg-brand-gray-100/50 border border-brand-gray-200/50 p-3 space-y-4 overflow-y-auto no-scrollbar">
              {statusLeads.map(lead => (
                <motion.div
                  key={lead.id}
                  layoutId={lead.id}
                  className="glass-card p-4 hover:border-brand-black transition-colors cursor-pointer relative group"
                  onClick={() => {
                    setSelectedLead(lead);
                    setEditLeadData(lead);
                    setIsEditModalOpen(true);
                  }}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === lead.id ? null : lead.id);
                      }}
                      className="p-1 text-brand-gray-400 hover:text-brand-black"
                    >
                      <MoreVertical size={14} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === lead.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          className="absolute right-0 mt-1 w-32 bg-brand-black border border-brand-gray-800 shadow-2xl z-50"
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                              setEditLeadData(lead);
                              setIsEditModalOpen(true);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 text-[8px] font-bold uppercase tracking-widest text-brand-gray-400 hover:text-brand-white hover:bg-brand-gray-900 flex items-center gap-2"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLead(lead.id);
                              toast.success('Lead Removed');
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 text-[8px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold truncate pr-6">{lead.name}</h4>
                    <span className="text-[10px] font-bold text-brand-gray-400">${(lead.value / 1000).toFixed(1)}k</span>
                  </div>
                  <p className="text-[10px] text-brand-gray-500 font-medium mb-3">{lead.company}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} className="text-brand-gray-400" />
                      <span className="text-[10px] font-bold">{lead.probability}%</span>
                    </div>
                    <div className="w-16 h-1 bg-brand-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-black" style={{ width: `${lead.probability}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
              {statusLeads.length === 0 && (
                <div className="h-32 border-2 border-dashed border-brand-gray-200 flex items-center justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-300">No Leads</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-brand-gray-50">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Leads & Pipeline</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Track your sales pipeline and opportunities.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex border border-brand-gray-200 bg-white p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-brand-black text-brand-white" : "text-brand-gray-400 hover:text-brand-black")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={cn("p-2 transition-colors", viewMode === 'board' ? "bg-brand-black text-brand-white" : "text-brand-gray-400 hover:text-brand-black")}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center"
          >
            <Plus size={18} />
            New Lead
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full md:flex-1 search-input-container">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-brand-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderBoardView()}

      <div className="glass-card p-4 md:p-8 bg-brand-black text-brand-white">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-bold tracking-tighter uppercase">Pipeline Summary</h3>
            <p className="text-brand-gray-400 font-medium text-sm">Total pipeline value is growing steadily this quarter.</p>
          </div>
          <div className="flex flex-row gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold tracking-tighter">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold tracking-tighter">{stats.activeLeads}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Active Deals</p>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Lead"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Opportunity Name</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Company</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Estimated Value ($)</label>
              <input 
                required
                type="number" 
                className="input-field" 
                value={newLead.value}
                onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Probability (%)</label>
              <input 
                required
                type="number" 
                min="0"
                max="100"
                className="input-field" 
                value={newLead.probability}
                onChange={(e) => setNewLead({ ...newLead, probability: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Status</label>
            <select 
              className="input-field"
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value as any })}
            >
              {LEAD_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Create Lead
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Lead"
      >
        <form onSubmit={handleEditLead} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Opportunity Name</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={editLeadData.name || ''}
              onChange={(e) => setEditLeadData({ ...editLeadData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Company</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={editLeadData.company || ''}
              onChange={(e) => setEditLeadData({ ...editLeadData, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Estimated Value ($)</label>
              <input 
                required
                type="number" 
                className="input-field" 
                value={editLeadData.value || 0}
                onChange={(e) => setEditLeadData({ ...editLeadData, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Probability (%)</label>
              <input 
                required
                type="number" 
                min="0"
                max="100"
                className="input-field" 
                value={editLeadData.probability || 0}
                onChange={(e) => setEditLeadData({ ...editLeadData, probability: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Status</label>
            <select 
              className="input-field"
              value={editLeadData.status || 'new'}
              onChange={(e) => setEditLeadData({ ...editLeadData, status: e.target.value as any })}
            >
              {LEAD_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Update Lead
            </button>
          </div>
        </form>
      </Modal>
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        title="Opportunity Details"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">{selectedLead.name}</h3>
                <p className="text-sm text-brand-gray-500 font-medium">{selectedLead.company}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tracking-tighter">${selectedLead.value.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Estimated Value</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-brand-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Status</p>
                <p className="text-sm font-bold uppercase">{selectedLead.status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Probability</p>
                <p className="text-sm font-bold">{selectedLead.probability}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Source</p>
                <p className="text-sm font-bold">Direct Outreach</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Created At</p>
                <p className="text-sm font-bold">April 1, 2026</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Pipeline Progress</h4>
              <div className="flex justify-between items-center gap-2">
                {LEAD_STATUSES.map((s, i) => {
                  const currentIndex = LEAD_STATUSES.indexOf(selectedLead.status);
                  const isCompleted = i <= currentIndex;
                  return (
                    <div key={s} className="flex-1 flex flex-col gap-1">
                      <div className={cn("h-1.5 w-full", isCompleted ? "bg-brand-black" : "bg-brand-gray-100")} />
                      <span className={cn("text-[8px] font-bold uppercase truncate", isCompleted ? "text-brand-black" : "text-brand-gray-400")}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setEditLeadData(selectedLead);
                  setIsEditModalOpen(true);
                }}
                className="flex-1 btn-primary py-3 uppercase tracking-widest font-bold"
              >
                Edit Lead
              </button>
              <button 
                onClick={() => {
                  deleteLead(selectedLead.id);
                  toast.success('Lead Removed');
                  setIsDetailsModalOpen(false);
                }}
                className="btn-secondary border-red-200 text-red-500 hover:bg-red-50 px-6"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Leads;
