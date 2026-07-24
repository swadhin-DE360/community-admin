import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon,
  Upload,
  X,
  Hash
} from 'lucide-react';
import { initialAnnouncements } from '../mockData';
import type { Announcement } from '../mockData';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function LatestAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ward18_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [coverImage, setCoverImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ward18_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleOpenModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setTitle(announcement.title);
      setDescription(announcement.description);
      setPriority(announcement.priority ?? 1);
      setCoverImage(announcement.coverImage || '');
    } else {
      setEditingAnnouncement(null);
      setTitle('');
      setDescription('');
      setPriority(1);
      setCoverImage('');
    }
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Image file handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in both the title and description.');
      return;
    }

    const nowStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (editingAnnouncement) {
      const updated = announcements.map(item =>
        item.id === editingAnnouncement.id
          ? {
              ...item,
              title: title.trim(),
              description: description.trim(),
              priority: Number(priority) || 1,
              coverImage: coverImage.trim() || undefined,
            }
          : item
      );
      setAnnouncements(updated);
    } else {
      const newAnn: Announcement = {
        id: `ANN-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        description: description.trim(),
        priority: Number(priority) || 1,
        coverImage: coverImage.trim() || undefined,
        datePublished: nowStr
      };
      setAnnouncements([newAnn, ...announcements]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  };

  // Filtering & Sorting (Priority 1, 2, 3...)
  const filteredAnnouncements = announcements
    .filter(item => {
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
              <Bell className="text-primary w-6 h-6" />
              Latest Announcements
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Publish official ward updates, news notices, and announcements with priority ordering for residents.
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold p-4 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus size={16} />
            Add Announcement
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs font-medium focus-visible:ring-primary"
          />
        </div>

        <div className="text-xs text-neutral-400 font-semibold self-end sm:self-center">
          Total Announcements: <span className="text-neutral-700 font-bold">{filteredAnnouncements.length}</span>
        </div>
      </div>

      {/* Announcements Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200/80 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between relative group"
            >
              {/* Cover Image Header */}
              {item.coverImage ? (
                <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                  <img 
                    src={item.coverImage} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-white/20 flex items-center gap-1">
                    <Hash size={11} />{item.priority}
                  </span>
                </div>
              ) : (
                <div className="relative h-24 w-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between px-6 border-b border-neutral-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <ImageIcon size={18} />
                    <span>No Cover Image</span>
                  </div>
                  <span className="bg-neutral-800 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Hash size={11} />
                    Priority {item.priority}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-charcoal leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Footer Meta & Actions */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto text-[11px] text-neutral-400 font-medium">
                  <span className="flex items-center gap-1 text-neutral-500">
                    <Clock size={13} className="text-neutral-400" />
                    {item.datePublished}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-neutral-400 hover:text-primary hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <button
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        }
                      />
                      <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-sm font-bold text-neutral-800">
                            Confirm Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-xs text-neutral-500">
                            Are you sure you want to delete "{item.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 gap-2">
                          <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAnnouncement(item.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-sm text-center">
            <Bell className="mx-auto w-10 h-10 text-neutral-300 mb-3" />
            <h3 className="text-sm font-bold text-neutral-700">No Announcements Found</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              There are no announcements matching your search. Click "Add Announcement" to create one.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Announcement Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[520px] bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden p-0">
          <DialogHeader className="p-6 border-b border-neutral-100">
            <DialogTitle className="text-lg font-bold text-charcoal flex items-center gap-2">
              <Bell className="text-primary w-5 h-5" />
              {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              Provide title, priority rank, description, and cover image to post announcement.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title..."
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Numeric Priority Input */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Priority Rank (e.g. 1, 2, 3...) *
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={priority}
                onChange={(e) => setPriority(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="e.g. 1, 2, 3..."
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter announcement details / description..."
                rows={4}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Cover Image Input & File Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Cover Image
              </label>

              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden border border-neutral-200 group h-36 bg-neutral-50">
                  <img 
                    src={coverImage} 
                    alt="Cover Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-900 text-white p-1.5 rounded-full transition-all"
                    title="Remove Cover Image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-250 hover:border-primary/50 bg-neutral-50/50 hover:bg-emerald-50/30 p-4 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload size={20} className="text-neutral-400 group-hover:text-primary" />
                    <span className="text-xs font-bold text-neutral-700">
                      Click to upload cover image
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                  </div>

                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
              )}
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold h-9 px-4 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                {editingAnnouncement ? 'Save Changes' : 'Add Announcement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
