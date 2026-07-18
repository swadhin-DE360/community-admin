import { useState } from 'react';
import { 
  Contact, 
  Search, 
  Plus, 
  Trash, 
  Phone, 
  Mail, 
  Sparkles
} from 'lucide-react';
import { initialDirectory } from '../mockData';
import type { DirectoryContact } from '../mockData';

export default function ImportantContacts() {
  const [directory, setDirectory] = useState<DirectoryContact[]>(initialDirectory);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactRole.trim() || !contactPhone.trim()) return;

    const newContact: DirectoryContact = {
      id: `DIR-${Date.now().toString().slice(-4)}`,
      name: contactName.trim(),
      role: contactRole.trim(),
      phone: contactPhone.trim(),
      email: contactEmail.trim() || "N/A"
    };

    setDirectory(prev => [newContact, ...prev]);
    
    // Reset Form
    setContactName('');
    setContactRole('');
    setContactPhone('');
    setContactEmail('');
    setShowContactForm(false);
  };

  const handleDeleteContact = (id: string) => {
    setDirectory(prev => prev.filter(d => d.id !== id));
  };

  const filteredDirectory = directory.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Widget */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Contact className="text-primary w-6 h-6" />
            Important Ward Contacts
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Maintain active details of ward officers, welfare staff, sanitary inspectors, and corporators.
          </p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input 
            type="text" 
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400 font-medium text-neutral-700"
          />
        </div>

        <button
          onClick={() => setShowContactForm(!showContactForm)}
          className="w-full sm:w-auto py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-emerald-500/10 transition-colors text-xs font-extrabold flex items-center justify-center gap-1"
        >
          <Plus size={14} />
          Add Directory Contact
        </button>
      </div>

      {/* Adding Contact Form */}
      {showContactForm && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-1">
              <Sparkles size={16} className="text-primary" />
              Add Ward Directory Contact
            </h3>
            <button 
              onClick={() => setShowContactForm(false)}
              className="text-xs text-neutral-400 hover:text-charcoal font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Officer Name</label>
              <input 
                type="text" 
                placeholder="e.g. Shri. S. Kumar"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Officer Role</label>
              <input 
                type="text" 
                placeholder="e.g. Assistant Sanitary Officer"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Contact Number</label>
              <input 
                type="text" 
                placeholder="e.g. +91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Email Address (Optional)</label>
              <input 
                type="email" 
                placeholder="e.g. officer@bbmp.gov.in"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-extrabold text-xs shadow-sm transition-colors text-center"
            >
              Add Contact to Directory
            </button>
          </form>
        </div>
      )}

      {/* Directory contacts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDirectory.length > 0 ? (
          filteredDirectory.map((d) => (
            <div 
              key={d.id} 
              className="bg-white p-5 rounded-2xl border border-neutral-200 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {d.name.split(' ').slice(-1)[0]?.[0] || 'C'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-charcoal">{d.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">{d.role}</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-neutral-400" />
                    <a href={`tel:${d.phone}`} className="hover:text-primary transition-colors font-medium">{d.phone}</a>
                  </div>
                  {d.email && d.email !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-neutral-400" />
                      <a href={`mailto:${d.email}`} className="hover:text-primary transition-colors font-medium truncate">{d.email}</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-4 text-[10px] text-neutral-400 font-semibold">
                <span>ID: {d.id}</span>
                <button 
                  onClick={() => handleDeleteContact(d.id)}
                  className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors"
                  title="Delete Contact"
                >
                  <Trash size={13} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-400 font-medium">
            No contacts found in the directory.
          </div>
        )}
      </div>

    </div>
  );
}
