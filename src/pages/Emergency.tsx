import { useState } from 'react';
import { 
  Megaphone,
  Search,
  Trash2,
  Calendar,
  Clock,
  X,
  Edit,
  
} from 'lucide-react';
import { initialAlerts } from '../mockData';
import type { MegaphoneAlert } from '../mockData';

// UI Components
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Emergency() {
  const [alerts, setAlerts] = useState<MegaphoneAlert[]>(() => {
    const saved = localStorage.getItem('ward18_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<MegaphoneAlert | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<MegaphoneAlert['severity']>('Info');

  const saveToStorage = (list: MegaphoneAlert[]) => {
    setAlerts(list);
    localStorage.setItem('ward18_alerts', JSON.stringify(list));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (editingAlert) {
      // Update Alert
      const updated = alerts.map(a => 
        a.id === editingAlert.id 
          ? { ...a, title: title.trim(), message: message.trim(), severity } 
          : a
      );
      saveToStorage(updated);
    } else {
      // Create Alert
      // Formatting date as "YYYY-MM-DD hh:mm AM/PM"
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const datePublished = `${dateStr} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      const newAlert: MegaphoneAlert = {
        id: `ALERT-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        message: message.trim(),
        severity,
        datePublished
      };

      const updated = [newAlert, ...alerts];
      saveToStorage(updated);
      setCurrentPage(1);
    }

    // Reset Form & Close Modal
    setTitle('');
    setMessage('');
    setSeverity('Info');
    setEditingAlert(null);
    setIsCreateOpen(false);
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    saveToStorage(updated);
    if (currentPage > Math.ceil(updated.length / itemsPerPage)) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  const getSeverityStyles = (sev: MegaphoneAlert['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200/50';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'Info':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Megaphone className="text-primary w-6 h-6" />
            Emergency Alerts & Broadcasts
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Publish critical warnings, infrastructure updates, and health bulletins directly to residents.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAlert(null);
            setTitle('');
            setMessage('');
            setSeverity('Info');
            setIsCreateOpen(true);
          }}
          className="px-4 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-center"
        >
          <Megaphone size={14} />
          Create Alert
        </Button>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" size={15} />
          <Input 
            type="text" 
            placeholder="Search alerts by title or severity..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 font-medium text-xs rounded-xl h-9"
          />
        </div>
        <div className="text-xs font-semibold text-neutral-500 font-mono">
          Showing {Math.min(startIndex + 1, filteredAlerts.length)} to {Math.min(startIndex + itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length} Alerts
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200">
              <TableHead className="p-4 w-[120px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date & Time</TableHead>
              <TableHead className="p-4 w-[110px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Severity</TableHead>
              <TableHead className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Alert Broadcast</TableHead>
              <TableHead className="p-4 w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
            {paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  className="hover:bg-neutral-50/40 transition-colors border-b border-neutral-100"
                >
                  {/* Date */}
                  <TableCell className="p-4 whitespace-nowrap text-neutral-500 space-y-0">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-neutral-400" />
                      <span>{alert.datePublished.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <Clock size={11} className="text-neutral-400" />
                      <span>{alert.datePublished.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </TableCell>

                  {/* Severity Badge */}
                  <TableCell className="p-4">
                    <span className={`px-2 py-0 rounded-lg text-[9px] font-extrabold border ${getSeverityStyles(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </TableCell>

                  {/* Title & message content */}
                  <TableCell className="p-4 space-y-1">
                    <span className="font-bold text-neutral-800 block text-xs">{alert.title}</span>
                    <p className="text-neutral-500 font-semibold leading-relaxed text-[11px] mt-0 max-w-lg">
                      {alert.message}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingAlert(alert);
                          setTitle(alert.title);
                          setMessage(alert.message);
                          setSeverity(alert.severity);
                          setIsCreateOpen(true);
                        }}
                        className="text-neutral-400 hover:text-primary p-2 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200 cursor-pointer"
                        title="Edit Alert"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <button 
                              className="text-neutral-400 hover:text-red-500 p-2 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200 cursor-pointer"
                              title="Delete Alert"
                            >
                              <Trash2 size={14} />
                            </button>
                          }
                        />
                        <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm font-bold text-neutral-800">Delete Emergency Alert</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs text-neutral-500">
                              Are you sure you want to remove the broadcast "{alert.title}"? This alert will be deleted permanently.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                            >
                              Delete Alert
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
                <TableCell colSpan={4} className="p-8 text-center text-neutral-400 text-xs font-semibold">
                  No emergency alerts found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 p-4 bg-neutral-50/40">
            <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider font-mono">
              Page {activePage} of {totalPages}
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activePage > 1) setCurrentPage(activePage - 1);
                    }}
                    className={activePage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={activePage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className="cursor-pointer font-extrabold"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activePage < totalPages) setCurrentPage(activePage + 1);
                    }}
                    className={activePage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Create / Edit Alert Dialog Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border border-neutral-200 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between border-b border-neutral-100 p-4">
            <DialogTitle className="font-bold text-sm text-neutral-800 uppercase tracking-wider">
              {editingAlert ? 'Edit Emergency Broadcast' : 'New Emergency Broadcast'}
            </DialogTitle>
            <DialogClose className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
              <X size={16} />
            </DialogClose>
          </div>
          
          <form onSubmit={handleCreateAlert} className="p-5 space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Alert Title</label>
              <Input 
                type="text" 
                placeholder="e.g. Substation Maintenance Outage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-xs h-9 rounded-xl"
                required
              />
            </div>

            {/* Severity */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Severity Level</label>
              <Select value={severity} onValueChange={(val) => setSeverity(val as MegaphoneAlert['severity'])}>
                <SelectTrigger className="w-full h-9 text-xs font-semibold text-neutral-700 rounded-xl">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-neutral-200 shadow-lg rounded-xl">
                  <SelectItem value="Info">Info (Standard Bulletin)</SelectItem>
                  <SelectItem value="Warning">Warning (Caution / Action Required)</SelectItem>
                  <SelectItem value="Critical">Critical (Immediate Danger / Outage)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Alert Message</label>
              <textarea 
                placeholder="Describe the emergency details and instructions for citizens..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs bg-transparent border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-ring/50 transition-all text-neutral-700 font-semibold resize-none placeholder:text-neutral-400"
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 mt-4">
              <DialogClose className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer">
                Cancel
              </DialogClose>
              <Button
                type="submit"
                className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Megaphone size={14} />
                {editingAlert ? 'Save Changes' : 'Publish Alert'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
