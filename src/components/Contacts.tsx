import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Building2, ExternalLink, Filter, Trash2, MessageSquare, Send, Clock } from 'lucide-react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from './Modal';
import Avatar from './Avatar';
import { useMemo } from 'react';

import { getVisibleContacts } from '../constants';
import { toast } from 'sonner';

const Contacts: React.FC = () => {
  const { contacts, addContact, deleteContact, currentUser, comments, addComment, users, messages, addMessage } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect' as 'lead' | 'customer' | 'prospect',
    lastContacted: new Date().toISOString().split('T')[0],
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    addContact(newContact);
    toast.success('Contact Added', {
      description: `${newContact.name} from ${newContact.company} has been added.`
    });
    setIsModalOpen(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'prospect',
      lastContacted: new Date().toISOString().split('T')[0],
    });
  };

  const handleExport = () => {
    toast.info('Preparing Export', {
      description: 'Your contact list is being formatted for CSV export.'
    });

    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Phone,Company,Status\n"
        + contacts.map(c => `${c.name},${c.email},${c.phone},${c.company},${c.status}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `VERTIS_Contacts_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export Complete');
    }, 1500);
  };

  const visibleContacts = getVisibleContacts(currentUser, contacts).filter(c => c.email !== currentUser.email);

  const filteredContacts = visibleContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const conversation = useMemo(() => {
    if (!selectedContact) return [];
    return messages.filter(m => 
      (m.fromId === currentUser.id && m.toId === selectedContact.id) ||
      (m.fromId === selectedContact.id && m.toId === currentUser.id)
    );
  }, [messages, selectedContact, currentUser.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    addMessage({
      fromId: currentUser.id,
      toId: selectedContact.id,
      text: newMessage.trim()
    });
    setNewMessage('');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-brand-gray-50">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Contacts</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Manage your relationships and network.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="btn-secondary flex-1 md:flex-none justify-center cursor-pointer"
          >
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center cursor-pointer"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full md:flex-1 search-input-container">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search contacts..." 
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
            <option value="prospect">Prospect</option>
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 group hover:border-brand-black transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <Avatar src={contact.avatarUrl} name={contact.name} size="lg" />
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                  contact.status === 'customer' ? "bg-green-100 text-green-700" : 
                  contact.status === 'prospect' ? "bg-blue-100 text-blue-700" : 
                  contact.status === 'employee' ? "bg-brand-black text-brand-white" :
                  "bg-brand-gray-200 text-brand-gray-700"
                )}>
                  {contact.status}
                </span>
                <button 
                  onClick={() => {
                    deleteContact(contact.id);
                    toast.success('Contact Removed');
                  }}
                  className="p-1 text-brand-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{contact.name}</h3>
            <div className="flex items-center gap-2 text-xs text-brand-gray-500 mb-6 font-medium">
              <Building2 size={14} />
              {contact.status === 'employee' ? `${contact.departmentId} • ${contact.role}` : contact.company}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs">
                <Mail size={14} className="text-brand-gray-400" />
                <span className="font-medium">{contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone size={14} className="text-brand-gray-400" />
                <a href={`tel:${contact.phone}`} className="font-medium hover:text-brand-black dark:hover:text-brand-white transition-colors underline decoration-brand-gray-200 underline-offset-4">
                  {contact.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedContact(contact);
                  setIsChatModalOpen(true);
                }}
                className="flex-1 btn-secondary text-[10px] uppercase font-bold tracking-widest py-2 flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} />
                {contact.status === 'employee' ? 'Chat' : 'Message'}
              </button>
              <button className="p-2 border border-brand-black hover:bg-brand-black hover:text-brand-white transition-all cursor-pointer">
                <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Email</label>
              <input 
                required
                type="email" 
                className="input-field" 
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Phone</label>
              <input 
                required
                type="text" 
                className="input-field" 
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Company</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={newContact.company}
              onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Status</label>
            <select 
              className="input-field"
              value={newContact.status}
              onChange={(e) => setNewContact({ ...newContact, status: e.target.value as any })}
            >
              <option value="prospect">Prospect</option>
              <option value="lead">Lead</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Add Contact
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        title={selectedContact?.status === 'employee' ? `Chat with ${selectedContact?.name}` : `Notes for ${selectedContact?.name}`}
      >
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
            {conversation.length === 0 ? (
              <div className="text-center py-12 text-brand-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              conversation.map((msg) => {
                const isMe = msg.fromId === currentUser.id;
                const sender = isMe ? currentUser : 
                  (selectedContact?.status === 'employee' ? users.find(u => u.id === msg.fromId || `emp-${u.id}` === msg.fromId) : null);
                
                return (
                  <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 mb-1">
                      {!isMe && <Avatar src={selectedContact?.avatarUrl} name={selectedContact?.name ?? 'Unknown'} size="sm" className="rounded-full" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
                        {isMe ? 'You' : selectedContact?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" className="rounded-full" />}
                    </div>
                    <div className={cn(
                      "px-4 py-2 text-sm max-w-[85%]",
                      isMe 
                        ? "bg-brand-black text-brand-white" 
                        : "bg-brand-gray-100 dark:bg-brand-gray-800 dark:text-brand-white"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-brand-gray-100 dark:border-brand-gray-700">
            <input 
              type="text"
              placeholder="Write a message..."
              className="input-field flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="p-2 bg-brand-black text-brand-white hover:bg-brand-gray-800 transition-colors dark:bg-brand-white dark:text-brand-black cursor-pointer">
              <Send size={18} />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Contacts;
