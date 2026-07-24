import { useState, useEffect } from 'react';
import {
  Truck,
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  Plus,
  CalendarDays,
  Settings,
  Edit,
  Check
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
import { Skeleton } from '@/components/ui/skeleton';

import type { AppDispatch, RootState } from '@/store/store';
import {
  saveWeeklySchedule,
  addScheduleChangeThunk,
  updateScheduleChangeThunk,
  deleteScheduleChangeThunk,
  type DayScheduleItem,
  type ScheduleChangeItem,
} from '@/store/sanitationSlice';
import { useDispatch, useSelector } from 'react-redux';

const format12Hour = (time24: string): string => {
  if (!time24) return '08:00 AM';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
};

const parse24Hour = (time12: string): string => {
  if (!time12) return '08:00';
  if (/^\d{2}:\d{2}$/.test(time12)) return time12;
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '08:00';
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = (match[3] || 'AM').toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
};

export default function Sanitition() {
  const dispatch = useDispatch<AppDispatch>();
  const { weeklySchedule: storeWeeklySchedule, scheduleChanges, loading } = useSelector(
    (state: RootState) => state.sanitation
  );
  const { selectedWardId } = useSelector((state: RootState) => state.ward);

  // Local weekly schedule state for editing before saving
  const [weeklySchedule, setWeeklySchedule] = useState<DayScheduleItem[]>(storeWeeklySchedule);
  const [savedWeeklySchedule, setSavedWeeklySchedule] = useState<DayScheduleItem[]>(storeWeeklySchedule);

  useEffect(() => {
    if (storeWeeklySchedule && storeWeeklySchedule.length > 0) {
      setWeeklySchedule(storeWeeklySchedule);
      setSavedWeeklySchedule(storeWeeklySchedule);
    }
  }, [storeWeeklySchedule]);

  const hasScheduleChanged =
    JSON.stringify(weeklySchedule) !== JSON.stringify(savedWeeklySchedule);

  const handleSaveWeeklySchedule = async () => {
    await dispatch(saveWeeklySchedule(selectedWardId || undefined, weeklySchedule));
    setSavedWeeklySchedule(weeklySchedule);
  };

  const handleToggleDayOff = (index: number) => {
    setWeeklySchedule(prev =>
      prev.map((item, i) => (i === index ? { ...item, isOff: !item.isOff } : item))
    );
  };

  const handleUpdateTime = (index: number, newTime: string) => {
    setWeeklySchedule(prev =>
      prev.map((item, i) => (i === index ? { ...item, time: newTime } : item))
    );
  };

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChange, setEditingChange] = useState<ScheduleChangeItem | null>(null);

  // Form states
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState('11:00 AM');
  const [isOffChange, setIsOffChange] = useState(false);
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const todayDateString = getTodayDateString();

  // Add or Edit schedule change
  const handleAddScheduleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('Please provide a reason for this schedule adjustment.');
      return;
    }

    const payload = {
      date: targetDate,
      time: isOffChange ? 'No Collection' : customTime,
      reason: reason.trim(),
      isOff: isOffChange,
    };

    if (editingChange && (editingChange._id || editingChange.id)) {
      const targetId = (editingChange._id || editingChange.id) as string;
      await dispatch(updateScheduleChangeThunk(selectedWardId || undefined, targetId, payload));
    } else {
      await dispatch(addScheduleChangeThunk(selectedWardId || undefined, payload));
    }

    setReason('');
    setIsOffChange(false);
    setErrorMessage('');
    setEditingChange(null);
    setIsModalOpen(false);
  };

  const handleDeleteChange = async (id: string) => {
    await dispatch(deleteScheduleChangeThunk(selectedWardId || undefined, id));
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingChange(null);
      setIsOffChange(false);
      setReason('');
      setErrorMessage('');
    }
  };

  const handleEditClick = (change: ScheduleChangeItem) => {
    setEditingChange(change);
    setTargetDate(change.date);
    const isOff = !!change.isOff || change.time === 'No Collection';
    setIsOffChange(isOff);
    setCustomTime(isOff ? '11:00 AM' : change.time);
    setReason(change.reason);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingChange(null);
    setTargetDate(new Date().toISOString().split('T')[0]);
    setCustomTime('11:00 AM');
    setIsOffChange(false);
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
              Configure weekly sanitation truck operations, set daily pickup timings, and push service overrides to residents.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-semibold self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Syncing Live with Resident App
          </div>
        </div>
      </div>

      {/* Weekly Schedule Config (Per-day timing & status) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <Settings className="text-primary w-5 h-5" />
              Weekly Operations & Pickup Timings
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specify the daily pickup time for each day of the week, or toggle off-days where collection does not run.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {hasScheduleChanged && (
              <Button
                onClick={handleSaveWeeklySchedule}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-3.5 py-1.5 h-auto rounded-xl shadow-sm transition-all flex items-center gap-1.5 animate-in fade-in duration-200 cursor-pointer"
              >
                <Check size={14} />
                Save Schedule Changes
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex flex-col justify-between gap-3 h-28"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
                <div className="space-y-2 mt-auto">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-full rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            weeklySchedule.map((item, index) => {
              return (
                <div
                  key={item.day}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    item.isOff
                      ? 'border-red-200/80 bg-red-50/15 text-neutral-800'
                      : 'border-neutral-200 bg-white hover:border-primary/40 hover:shadow-sm text-neutral-800'
                  }`}
                >
                  {/* Day Name & Toggle */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="font-extrabold text-sm text-charcoal">{item.day}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!item.isOff}
                      onClick={() => handleToggleDayOff(index)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        !item.isOff ? 'bg-primary' : 'bg-neutral-300'
                      }`}
                      title={!item.isOff ? 'Mark as Off Day' : 'Activate Day'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          !item.isOff ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Status Badge & Time Selection */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-black uppercase tracking-wider ${!item.isOff ? 'text-primary' : 'text-red-500'}`}>
                        {!item.isOff ? 'Active Pickup' : 'Off Day'}
                      </span>
                    </div>

                    {!item.isOff ? (
                      <input
                        type="time"
                        value={parse24Hour(item.time)}
                        onChange={(e) => handleUpdateTime(index, format12Hour(e.target.value))}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      />
                    ) : (
                      <div className="w-full bg-neutral-100/80 border border-neutral-200/60 rounded-xl px-2 py-1.5 text-xs font-semibold text-neutral-400 text-center select-none">
                        No Collection
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Registered Schedule Adjustments (Table View) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-1.5">
              <CalendarDays className="text-primary w-5 h-5" />
              Registered Schedule Adjustments & Overrides
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specific dates where truck dispatch timings have been temporarily adjusted from the regular schedule.
            </p>
          </div>

          <Button
            onClick={handleAddClick}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2 h-auto rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Plus size={16} />
            Reschedule Sanitation
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
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-neutral-100">
                    <TableCell className="p-3"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="p-3"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="p-3"><Skeleton className="h-6 w-28 rounded-lg" /></TableCell>
                    <TableCell className="p-3"><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-6 h-6 rounded-lg" />
                        <Skeleton className="w-6 h-6 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : scheduleChanges.length > 0 ? (
                [...scheduleChanges]
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((change) => {
                    const isChangeToday = change.date === todayDateString;
                    const dateObj = new Date(change.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const isOffDay = !!change.isOff || change.time === 'No Collection';

                    return (
                      <TableRow
                        key={change._id || change.id}
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
                          {isOffDay ? (
                            <span className="text-xs font-extrabold text-red-700 bg-red-100/70 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                              <AlertCircle size={12} className="text-red-500" />
                              Off Day (No Pickup)
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-700 bg-amber-100/50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                              <Clock size={12} />
                              {change.time}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="p-3 text-xs text-neutral-500 font-medium max-w-xs truncate" title={change.reason}>
                          {change.reason}
                        </TableCell>
                        <TableCell className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(change)}
                              className="text-neutral-400 hover:text-primary hover:bg-emerald-50 p-1.5 rounded-lg transition-all cursor-pointer"
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
                                    onClick={() => handleDeleteChange((change._id || change.id) as string)}
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
                    No schedule overrides active. All daily collections follow the regular weekly schedule.
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
            {/* Toggle Off-Day / Disable pickup for this target date */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="text-xs font-bold text-neutral-800 block">Disable Collection for this Date</span>
                <span className="text-[11px] text-neutral-500 font-medium">Mark this specific date as an Off Day (no pickup).</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isOffChange}
                onClick={() => setIsOffChange(!isOffChange)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOffChange ? 'bg-red-500' : 'bg-neutral-300'
                }`}
                title={isOffChange ? 'Enable Pickup' : 'Disable Pickup'}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isOffChange ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

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
                  disabled={!!editingChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Updated Timing
                </label>
                {isOffChange ? (
                  <div className="w-full bg-red-50 border border-red-200 rounded-xl p-2 text-xs font-bold text-red-600 text-center select-none">
                    No Collection (Off Day)
                  </div>
                ) : (
                  <input
                    type="time"
                    value={parse24Hour(customTime)}
                    onChange={(e) => setCustomTime(format12Hour(e.target.value))}
                    className="w-full bg-white border border-neutral-250 rounded-xl p-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                    required={!isOffChange}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                Reason for Rescheduling
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Vehicle maintenance, public holiday adjustment, or driver reassignment."
                rows={3}
                className="w-full bg-white border border-neutral-250 rounded-xl p-3 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
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
              <DialogClose className="h-9 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer">
                Cancel
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white text-sm font-bold h-9 px-4 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
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
