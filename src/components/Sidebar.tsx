import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWards, createWardThunk, updateWardThunk, deleteWardThunk, setSelectedWardId, } from '@/store/wardSlice';
import { LayoutDashboard, FileText, Megaphone, Calendar, ChevronLeft, ChevronRight, ShieldAlert, Menu, X, Truck, Users, Building2, Contact, LogOut, UserCog, MapPin, ChevronDown, Check, Plus, Pencil, Trash2, Bell } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog';
import type { AppDispatch, RootState } from '@/store/store';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  complaintsCount: number;
  alertsCount: number;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  complaintsCount,
  alertsCount
}: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { wards: availableWards, selectedWardId } = useSelector((state: RootState) => state.ward);

  useEffect(() => {
    dispatch(fetchWards());
  }, [dispatch]);

  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [isAddingWard, setIsAddingWard] = useState(false);
  const [newWardInput, setNewWardInput] = useState('');

  const selectWard = (wardId: string) => {
    dispatch(setSelectedWardId(wardId));
    setIsWardDropdownOpen(false);
    setIsAddingWard(false);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleAddWard = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newWardInput.trim();
    if (!trimmed) return;

    let shortName = trimmed;
    let fullName = trimmed;
    if (!trimmed.toLowerCase().startsWith('ward')) {
      shortName = `Ward ${trimmed}`;
      fullName = `Ward ${trimmed}`;
    } else {
      const parts = trimmed.split('-');
      shortName = parts[0].trim();
      fullName = trimmed;
    }

    dispatch(createWardThunk({ name: shortName, fullName }));
    setNewWardInput('');
    setIsAddingWard(false);
    setIsWardDropdownOpen(false);
  };

  // Edit Ward state
  const [editingWardId, setEditingWardId] = useState<string | null>(null);
  const [editWardInput, setEditWardInput] = useState('');

  const handleStartEdit = (ward, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetId = ward._id || ward.id || '';
    setEditingWardId(targetId);
    setEditWardInput(ward.fullName);
  };

  const handleSaveEdit = (wardId: string, e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const trimmed = editWardInput.trim();
    if (!trimmed) return;

    let shortName = trimmed;
    if (!trimmed.toLowerCase().startsWith('ward')) {
      shortName = `Ward ${trimmed}`;
    } else {
      const parts = trimmed.split('-');
      shortName = parts[0].trim();
    }

    dispatch(updateWardThunk(wardId, { name: shortName, fullName: trimmed }));
    setEditingWardId(null);
  };

  const handleDeleteWard = (wardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableWards.length <= 1) return;
    dispatch(deleteWardThunk(wardId));
  };

  const currentWard = availableWards.find(w => (w._id || w.id) === selectedWardId) || availableWards[0];

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      path: '/sanitation',
      label: 'Sanitation',
      icon: Truck,
      badge: null
    },
    {
      path: '/latest-announcements',
      label: 'Latest Announcement',
      icon: Bell,
      badge: null
    },
    {
      path: '/campaign',
      label: 'campaign',
      icon: Calendar,
      badge: null
    },
    {
      path: '/citizens',
      label: 'Citizens',
      icon: Users,
      badge: null
    },
    {
      path: '/complaints',
      label: 'Complaints',
      icon: FileText,
      badge: complaintsCount > 0 ? complaintsCount : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      path: '/govt-schemes',
      label: 'Govt Schemes',
      icon: Building2,
      badge: null
    },
    {
      path: '/important-contacts',
      label: 'Imortant contacts',
      icon: Contact,
      badge: null
    },
    {
      path: '/emergency-alert',
      label: 'Emergency alert',
      icon: Megaphone,
      badge: alertsCount > 0 ? alertsCount : null,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      path: '/staff',
      label: 'Staff Directory',
      icon: UserCog,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3 left-4 z-40 p-2 rounded-xl bg-white shadow-md border border-neutral-200 text-neutral-800 lg:hidden hover:bg-neutral-50 transition-colors focus:outline-none cursor-pointer"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Light Backdrop Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/10 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white text-neutral-800 border-r border-neutral-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
          } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            {isOpen && (
              <div className="flex flex-col select-none">
                <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">CIVIC PORTAL</span>
                <span className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Close Button (Mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-neutral-100 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Collapse Arrow Toggle (Desktop only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1 rounded-lg bg-neutral-100 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Ward Selector Section with Add Ward Feature */}
        <div className="px-3 py-3 border-b border-neutral-100 relative">
          {isOpen ? (
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1 select-none">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Admin Ward Scope
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsWardDropdownOpen(true);
                    setIsAddingWard(true);
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Ward</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsWardDropdownOpen(!isWardDropdownOpen);
                  setIsAddingWard(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 transition-all text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin size={15} className="text-primary flex-shrink-0" />
                  <span className="truncate">{currentWard?.fullName || 'No Ward Available'}</span>
                </div>
                <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${isWardDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Ward Select & Add Dropdown Menu */}
              {isWardDropdownOpen && (
                <div className="absolute left-3 right-3 top-full mt-1.5 z-50 bg-white border border-neutral-200 rounded-xl shadow-xl p-2 space-y-1 animate-in fade-in-50 zoom-in-95">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-neutral-500 border-b border-neutral-100 pb-1.5 mb-1 select-none">
                    <span>Select Active Ward</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingWard(!isAddingWard)}
                      className="flex items-center gap-0.5 text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>{isAddingWard ? 'Close' : 'Add New'}</span>
                    </button>
                  </div>

                  {/* Add Ward Inline Form */}
                  {isAddingWard && (
                    <form onSubmit={handleAddWard} className="p-2 bg-neutral-50/80 rounded-lg border border-neutral-200 mb-2 space-y-2">
                      <span className="text-[10px] font-bold text-neutral-600 block">Add New Admin Ward</span>
                      <input
                        type="text"
                        value={newWardInput}
                        onChange={(e) => setNewWardInput(e.target.value)}
                        placeholder="e.g. Ward 30 - West Sector"
                        autoFocus
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-medium text-neutral-800 placeholder:text-neutral-400"
                      />
                      <div className="flex justify-end gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setIsAddingWard(false)}
                          className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!newWardInput.trim()}
                          className="px-2.5 py-1 text-[10px] font-extrabold bg-primary hover:bg-emerald-600 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Save Ward
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
                    {availableWards.map(ward => {
                      const wardId = ward._id || ward.id || '';
                      const isSelected = wardId === selectedWardId;
                      const isEditing = editingWardId === wardId;

                      if (isEditing) {
                        return (
                          <div key={wardId} className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editWardInput}
                              onChange={(e) => setEditWardInput(e.target.value)}
                              autoFocus
                              className="flex-1 min-w-0 px-2 py-1 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary font-medium text-neutral-800"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(wardId, e);
                                if (e.key === 'Escape') setEditingWardId(null);
                              }}
                            />
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleSaveEdit(wardId, e)}
                                className="p-1 text-emerald-600 hover:bg-emerald-200/60 rounded cursor-pointer flex items-center justify-center"
                                title="Save Changes"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setEditingWardId(null); }}
                                className="p-1 text-neutral-400 hover:bg-neutral-200 rounded cursor-pointer flex items-center justify-center"
                                title="Cancel"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={wardId}
                          onClick={() => selectWard(wardId)}
                          className={`group/item flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors select-none ${isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-semibold'
                              : 'hover:bg-neutral-50 text-neutral-600'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-1">
                            <span className="truncate">{ward.fullName}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isSelected && <Check size={13} className="text-primary flex-shrink-0" />}

                            <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-0.5 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => handleStartEdit(ward, e)}
                                className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded cursor-pointer transition-colors"
                                title="Edit Ward"
                              >
                                <Pencil size={12} />
                              </button>

                              {availableWards.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteWard(wardId, e)}
                                  className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                                  title="Delete Ward"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Collapsed Sidebar View */
            <div className="relative group flex justify-center py-1">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-primary transition-all focus:outline-none cursor-pointer relative"
              >
                <MapPin size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left duration-200 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                Ward: {currentWard?.name || currentWard?.fullName || 'No Ward'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false); // Auto close mobile
                }}
                className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group text-sm relative ${isActive
                    ? 'bg-primary text-white shadow-md shadow-emerald-700/20'
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                  }`}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-white" />
                    )}

                    <Icon
                      size={19}
                      className={`flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'
                        }`}
                    />

                    {isOpen && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {/* Collapsed Hover Tooltip (Desktop only) */}
                    {!isOpen && (
                      <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left duration-200 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        {item.badge !== null && (
                          <span className="ml-1 px-1 py-0 text-[9px] font-extrabold bg-primary rounded-full text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-2 border-t border-neutral-100">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group text-sm relative text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none cursor-pointer"
                >
                  <LogOut
                    size={19}
                    className="flex-shrink-0 text-red-500 group-hover:text-red-600 transition-transform group-hover:scale-105"
                  />
                  {isOpen && (
                    <span className="truncate flex-1 text-left font-semibold">Logout</span>
                  )}

                  {/* Collapsed Hover Tooltip (Desktop only) */}
                  {!isOpen && (
                    <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left duration-200 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                      Logout
                    </div>
                  )}
                </button>
              }
            />
            <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-sm font-bold text-neutral-800">Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-neutral-500">
                  Are you sure you want to log out of the WARD 18 Admin Panel?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 gap-2">
                <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log('Logging out...');
                    localStorage.removeItem('ward18_admin_logged_in');
                    window.location.href = '/login';
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  );
}
