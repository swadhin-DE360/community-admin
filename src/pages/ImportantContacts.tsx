import { useState } from 'react';
import { 
  Contact, 
  Search, 
  Plus, 
  Trash, 
  Phone, 
  Sparkles,
  AlertCircle,
  Edit
} from 'lucide-react';
import { initialDirectory } from '../mockData';
import type { DirectoryContact } from '../mockData';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ImportantContacts() {
  const [directory, setDirectory] = useState<DirectoryContact[]>(initialDirectory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<DirectoryContact | null>(null);

  // Form states
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('Municipal Corporation');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactRole.trim() || !contactPhone.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (editingContact) {
      // Update existing contact
      setDirectory(prev => prev.map(d => 
        d.id === editingContact.id 
          ? { 
              ...d, 
              name: contactName.trim(), 
              role: contactRole.trim(), 
              phone: contactPhone.trim(), 
              type: contactType 
            }
          : d
      ));
    } else {
      // Create new contact
      const newContact: DirectoryContact = {
        id: `DIR-${Date.now().toString().slice(-4)}`,
        name: contactName.trim(),
        role: contactRole.trim(),
        phone: contactPhone.trim(),
        email: "N/A",
        type: contactType
      };
      setDirectory(prev => [newContact, ...prev]);
    }
    
    // Reset Form & Close Modal
    setContactName('');
    setContactRole('');
    setContactPhone('');
    setContactEmail('');
    setContactType('Municipal Corporation');
    setEditingContact(null);
    setErrorMessage('');
    setIsModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setDirectory(prev => prev.filter(d => d.id !== id));
  };

  const filteredDirectory = directory.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.type && d.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTypeBadgeStyles = (type?: string) => {
    switch (type) {
      case 'Emergency Helpline':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Ward Representative':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Municipal Corporation':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingContact(null);
      setContactName('');
      setContactRole('');
      setContactPhone('');
      setContactEmail('');
      setContactType('Municipal Corporation');
      setErrorMessage('');
    }
  };

  const handleEditClick = (contact: DirectoryContact) => {
    setEditingContact(contact);
    setContactName(contact.name);
    setContactRole(contact.role);
    setContactPhone(contact.phone);
    setContactEmail(contact.email || '');
    setContactType(contact.type || 'Municipal Corporation');
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingContact(null);
    setContactName('');
    setContactRole('');
    setContactPhone('');
    setContactEmail('');
    setContactType('Municipal Corporation');
    setIsModalOpen(true);
  };

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
            Maintain active details of ward officers, welfare staff, sanitary inspectors, and emergency helpline responders.
          </p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input 
            type="text" 
            placeholder="Search by title, role or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400 font-medium text-neutral-700"
          />
        </div>

        <Button
          onClick={handleAddClick}
          className="w-full sm:w-auto py-2.5 px-4 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md shadow-emerald-500/10 transition-colors text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          Add Directory Contact
        </Button>
      </div>

      {/* Directory contacts table */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
        <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Title / Name</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Short Description / Role</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Phone Number</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Type</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDirectory.length > 0 ? (
                filteredDirectory.map((d) => (
                  <TableRow key={d.id} className="border-b border-neutral-100 hover:bg-neutral-50/40">
                    <TableCell className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {d.name.split(' ').slice(-1)[0]?.[0] || 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-charcoal block">{d.name}</span>
                          <span className="text-[10px] text-neutral-400 font-semibold block mt-0.5">ID: {d.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3 text-sm text-neutral-600 font-medium">{d.role}</TableCell>
                    <TableCell className="p-3">
                      <a href={`tel:${d.phone}`} className="text-xs font-semibold text-neutral-700 hover:text-primary transition-colors flex items-center gap-1">
                        <Phone size={12} className="text-neutral-400" />
                        {d.phone}
                      </a>
                    </TableCell>
                    <TableCell className="p-3">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyles(d.type)}`}>
                        {d.type || 'Municipal Corporation'}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(d)}
                          className="text-neutral-400 hover:text-primary hover:bg-emerald-50 p-1.5 rounded-lg transition-all"
                          title="Edit Contact"
                        >
                          <Edit size={15} />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <button
                                className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Delete Contact"
                              >
                                <Trash size={15} />
                              </button>
                            }
                          />
                          <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-sm font-bold text-neutral-800">Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs text-neutral-500">
                                Are you sure you want to delete the directory contact "{d.name}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-2">
                              <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteContact(d.id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-neutral-400 text-sm font-medium">
                    No contacts found matching the search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Directory Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden p-0">
          <DialogHeader className="p-6 border-b border-neutral-100">
            <DialogTitle className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <Sparkles className="text-primary w-5 h-5" />
              {editingContact ? 'Edit Ward Directory Contact' : 'Add Ward Directory Contact'}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              {editingContact 
                ? 'Modify the details of this official ward contact record.'
                : 'Add a new official contact, emergency helpline, or corporator to the citizen-facing directory list.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddContactSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                Title / Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. Sanitation Helpline, Electricity Helpline, Ambulance Service"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                Short Description / Role <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. Primary Emergency Support or Ward Waste Management Desk"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 98450 99887"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                  Contact Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="Emergency Helpline">Emergency Helpline</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Ward Representative">Ward Representative</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle size={14} className="text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-9 px-4 rounded-xl border border-neutral-200">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold h-9 px-4 rounded-xl shadow-sm transition-colors"
              >
                {editingContact ? 'Save Changes' : 'Add Contact'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
