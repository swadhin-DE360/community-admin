import { useState, useEffect } from 'react';
import { 
  Truck, 
  Calendar, 
  Clock, 
  Trash2, 
  AlertCircle, 
  Plus, 
  Info,
  CalendarDays,
  Settings,
  Edit
} from 'lucide-react';

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

interface ScheduleChange {
  id: string;
  date: string;
  time: string;
  reason: string;
}

export default function Sanitition() {
  // Load initial states from LocalStorage or use defaults
  const [offDays, setOffDays] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanitation_off_days');
    return saved ? JSON.parse(saved) : ['Tuesday', 'Friday'];
  });

  const [scheduleChanges, setScheduleChanges] = useState<ScheduleChange[]>(() => {
    const saved = localStorage.getItem('sanitation_schedule_changes');
    if (saved) return JSON.parse(saved);
    // Default initial mock reschedule for demo
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0], // Today
        time: '11:00 AM',
        reason: 'Regular maintenance of garbage collection trucks'
      }
    ];
  });

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChange, setEditingChange] = useState<ScheduleChange | null>(null);

  // Form states
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync to LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('sanitation_off_days', JSON.stringify(offDays));
  }, [offDays]);

  useEffect(() => {
    localStorage.setItem('sanitation_schedule_changes', JSON.stringify(scheduleChanges));
  }, [scheduleChanges]);

  // Helper helper to get current day's info
  const getTodayDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const todayDayName = getTodayDayName();
  const todayDateString = getTodayDateString();

  const getNextSevenDays = () => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.push({ dayName, dateLabel });
    }
    return list;
  };

  const nextSevenDays = getNextSevenDays();

  // Toggle off days
  const handleToggleOffDay = (day: string) => {
    if (offDays.includes(day)) {
      setOffDays(offDays.filter(d => d !== day));
    } else {
      setOffDays([...offDays, day]);
    }
  };

  // Add or Edit schedule change
  const handleAddScheduleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('Please provide a reason for the timing change.');
      return;
    }
    
    if (editingChange) {
      // Edit mode: Update the existing change
      const updated = scheduleChanges.map(c => 
        c.id === editingChange.id 
          ? { ...c, date: targetDate, time: customTime, reason: reason.trim() }
          : c
      );
      setScheduleChanges(updated);
    } else {
      // Create mode: Check if there is already a reschedule for this date
      const updated = scheduleChanges.filter(c => c.date !== targetDate);
      
      const newChange: ScheduleChange = {
        id: Date.now().toString(),
        date: targetDate,
        time: customTime,
        reason: reason.trim()
      };
      setScheduleChanges([...updated, newChange]);
    }

    setReason('');
    setErrorMessage('');
    setEditingChange(null);
    setIsModalOpen(false); // Close Modal on success
  };

  // Delete schedule change
  const handleDeleteChange = (id: string) => {
    setScheduleChanges(scheduleChanges.filter(c => c.id !== id));
  };

  // Actions for modal handling
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingChange(null);
      setReason('');
      setErrorMessage('');
    }
  };

  const handleEditClick = (change: ScheduleChange) => {
    setEditingChange(change);
    setTargetDate(change.date);
    setCustomTime(change.time);
    setReason(change.reason);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingChange(null);
    setTargetDate(new Date().toISOString().split('T')[0]);
    setCustomTime('11:00 AM');
    setReason('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header Widget */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
              <Truck className="text-primary w-6 h-6" />
              Sanitation Schedule Manager
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Configure weekly sanitation truck operations, reschedule timings, and update service alerts for the resident app.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-semibold self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Syncing Live with Resident App
          </div>
        </div>
      </div>

      {/* Weekly Off Days Config (Horizontal, Full Width) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <Settings className="text-primary w-5 h-5" />
              Weekly Off Days Config
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Toggle specific days of the week to mark them as "Off Days". On these days, the truck does not run.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-50 border border-neutral-200/60 px-3 py-1.5 rounded-xl font-semibold self-start sm:self-center">
            <Info size={14} className="text-primary" />
            Residents' app updates instantly
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {nextSevenDays.map(({ dayName, dateLabel }, index) => {
            const isOff = offDays.includes(dayName);
            const isDayToday = index === 0;
            
            return (
              <div 
                key={dayName}
                onClick={() => handleToggleOffDay(dayName)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between items-center text-center group h-32 relative ${
                  isOff 
                    ? 'border-red-200 bg-red-50/15 hover:bg-red-50/30 text-neutral-800' 
                    : 'border-neutral-200 bg-white hover:border-emerald-500/25 hover:shadow-sm text-neutral-800'
                }`}
              >
                {/* Date & Day Name */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {dateLabel}
                  </span>
                  <span className="font-extrabold text-sm text-charcoal mt-0.5">
                    {dayName}
                  </span>
                  {isDayToday && (
                    <span className="mt-1 text-[8px] font-black uppercase bg-neutral-800 text-white px-1.5 py-0.5 rounded leading-none">
                      Today
                    </span>
                  )}
                </div>

                {/* Toggle Switch */}
                <div className="mt-2 flex flex-col items-center gap-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!isOff}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOffDay(dayName);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      !isOff ? 'bg-primary' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        !isOff ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-[9px] font-black uppercase tracking-wide mt-1 ${
                    !isOff ? 'text-primary' : 'text-red-500'
                  }`}>
                    {!isOff ? 'Active' : 'Off Day'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Schedule Adjustments (Table View) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <CalendarDays className="text-primary w-5 h-5" />
              Registered Schedule Adjustments
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Below are the specific days where the sanitation truck dispatch timing has been adjusted from the 8:00 AM default.
            </p>
          </div>
          
          <Button
            onClick={handleAddClick}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold p-4 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus size={16} />
            Reschedule sanitation
          </Button>
        </div>

        <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Date</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Day of Week</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Adjusted Time</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3">Reason</TableHead>
                <TableHead className="font-bold text-xs text-neutral-500 uppercase tracking-wider p-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleChanges.length > 0 ? (
                [...scheduleChanges]
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((change) => {
                    const isChangeToday = change.date === todayDateString;
                    const dateObj = new Date(change.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                    return (
                      <TableRow 
                        key={change.id}
                        className={isChangeToday ? 'bg-amber-50/20 hover:bg-amber-50/30 border-b border-neutral-100' : 'border-b border-neutral-100'}
                      >
                        <TableCell className="p-3 font-semibold text-sm text-neutral-800">
                          <div className="flex items-center gap-1.5">
                            {change.date}
                            {isChangeToday && (
                              <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded leading-none">
                                Today
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-neutral-600 font-medium">{dayName}</TableCell>
                        <TableCell className="p-3">
                          <span className="text-xs font-bold text-amber-700 bg-amber-100/50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Clock size={12} />
                            {change.time}
                          </span>
                        </TableCell>
                        <TableCell className="p-3 text-xs text-neutral-500 font-medium max-w-xs truncate" title={change.reason}>
                          {change.reason}
                        </TableCell>
                        <TableCell className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(change)}
                              className="text-neutral-400 hover:text-primary hover:bg-emerald-50 p-1.5 rounded-lg transition-all"
                              title="Edit Override"
                            >
                              <Edit size={15} />
                            </button>
                            <AlertDialog>
                              <AlertDialogTrigger
                                render={
                                  <button
                                    className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                    title="Cancel Override"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                }
                              />
                              <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-sm font-bold text-neutral-800">Confirm Cancellation</AlertDialogTitle>
                                  <AlertDialogDescription className="text-xs text-neutral-500">
                                    Are you sure you want to cancel the schedule override for {change.date}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4 gap-2">
                                  <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteChange(change.id)}
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
                    No schedule overrides active. Everything is running at 8:00 AM.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reschedule Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden p-0">
          <DialogHeader className="p-6 border-b border-neutral-100">
            <DialogTitle className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <Calendar className="text-primary w-5 h-5" />
              {editingChange ? 'Edit Schedule Override' : 'Reschedule Sanitation Dispatch'}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              {editingChange 
                ? 'Modify the timing override and reason details for this scheduled date.' 
                : 'Change the dispatch timing of the sanitation truck for a specific date. This pushes a notification to the resident app.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddScheduleChange} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Select Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  disabled={!!editingChange} // Disable changing date during edit to preserve date unique constraint
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Updated Timing
                </label>
                <select
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="8:00 AM">8:00 AM (Default)</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Reason for Timing Adjustment
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Due to truck servicing delays / Festive day delay / Rain interruption"
                rows={3}
                className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold h-9 px-4 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                {editingChange ? 'Save Changes' : 'Apply Adjustment'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
