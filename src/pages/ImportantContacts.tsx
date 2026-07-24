import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Contact, Search, Plus, Trash, Phone, Sparkles, AlertCircle, Edit, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import {
  createImportantContact,
  updateImportantContact,
  deleteImportantContact,
  type ImportantContactItem,
} from '@/store/importantContactsSlice';

// UI Components
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog';

import { Skeleton } from '@/components/ui/skeleton';

export default function ImportantContacts() {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts: directory, loading } = useSelector((state: RootState) => state.importantContacts);
  const { selectedWardId } = useSelector((state: RootState) => state.ward);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ImportantContactItem | null>(null);

  // Form states matching model: title, desc, no, type, wardId
  const [contactTitle, setContactTitle] = useState('');
  const [contactDesc, setContactDesc] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactType, setContactType] = useState('Municipal Corporation');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTitle.trim() || !contactDesc.trim() || !contactNo.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const cleanNo = contactNo.trim();
    if (!/^\d{3,10}$/.test(cleanNo)) {
      setErrorMessage('Contact number must be between 3 and 10 digits (e.g. 100, 108, 9845099887).');
      return;
    }

    const payload = {
      title: contactTitle.trim(),
      desc: contactDesc.trim(),
      no: contactNo.trim(),
      type: contactType,
      wardId: selectedWardId || undefined,
    };

    if (editingContact && (editingContact._id || editingContact.id)) {
      const targetId = (editingContact._id || editingContact.id) as string;
      await dispatch(updateImportantContact({ id: targetId, data: payload }));
    } else {
      await dispatch(createImportantContact(payload));
    }

    // Reset Form & Close Modal
    setContactTitle('');
    setContactDesc('');
    setContactNo('');
    setContactType('Municipal Corporation');
    setEditingContact(null);
    setErrorMessage('');
    setIsModalOpen(false);
  };

  const handleDeleteContact = async (id: string) => {
    await dispatch(deleteImportantContact(id));
  };

  const filteredDirectory = directory.filter(d =>
    (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      setContactTitle('');
      setContactDesc('');
      setContactNo('');
      setContactType('Municipal Corporation');
      setErrorMessage('');
    }
  };

  const handleEditClick = (contact: ImportantContactItem) => {
    setEditingContact(contact);
    setContactTitle(contact.title || '');
    setContactDesc(contact.desc || '');
    setContactNo(contact.no || '');
    setContactType(contact.type || 'Municipal Corporation');
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingContact(null);
    setContactTitle('');
    setContactDesc('');
    setContactNo('');
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
            Important Ward Contacts & Announcements
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
            placeholder="Search by title, desc or type..."
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
          Add Important Contact
        </Button>
      </div>

      {/* Directory contacts table */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
        <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Title</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Description</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Phone / Contact No</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Type</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-neutral-100">
                    <TableCell className="p-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="p-3">
                      <Skeleton className="h-5 w-28 rounded-full" />
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-6 h-6 rounded-lg" />
                        <Skeleton className="w-6 h-6 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredDirectory.length > 0 ? (
                filteredDirectory.map((d) => {
                  const targetId = (d._id || d.id) as string;
                  return (
                    <TableRow key={targetId} className="border-b border-neutral-100 hover:bg-neutral-50/40">
                      <TableCell className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {d.title?.split(' ').slice(-1)[0]?.[0] || 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-charcoal block">{d.title}</span>
                            {d.wardId?.fullName && (
                              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{d.wardId.fullName}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-sm text-neutral-600 font-medium">{d.desc}</TableCell>
                      <TableCell className="p-3">
                        <a href={`tel:${d.no}`} className="text-xs font-semibold text-neutral-700 hover:text-primary transition-colors flex items-center gap-1">
                          <Phone size={12} className="text-neutral-400" />
                          {d.no}
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
                            className="text-neutral-400 hover:text-primary hover:bg-emerald-50 p-1.5 rounded-lg transition-all cursor-pointer"
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
                                  Are you sure you want to delete "{d.title}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-4 gap-2">
                                <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteContact(targetId)}
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-neutral-400 text-sm font-medium">
                    No important contacts found matching the search criteria.
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
              {editingContact ? 'Edit Important Contact' : 'Add Important Contact'}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              {editingContact
                ? 'Modify the details of this official contact/announcement record.'
                : 'Add a new official contact or emergency helpline with title, description, contact number, type, and active ward scope.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddContactSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sanitation Helpline, Electricity Helpline"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Primary Emergency Support or Ward Waste Management Desk"
                value={contactDesc}
                onChange={(e) => setContactDesc(e.target.value)}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                  Contact Number (no) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100, 108 or 9845099887"
                  maxLength={10}
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                  Type <span className="text-red-500">*</span>
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
              <DialogClose className="h-9 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer">
                Cancel
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
