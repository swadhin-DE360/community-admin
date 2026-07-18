import { useState } from 'react';
import { 
  UserCog, 
  Search, 
  Trash2, 
  Eye, 
  Edit,
  Plus, 
  X,
  ShieldCheck,
  Mail,
  Phone
} from 'lucide-react';

// UI Components
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
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

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
}

const initialStaff: StaffMember[] = [
  {
    id: "STF-001",
    name: "Rahul Kumar",
    email: "rahul.kumar@ward18.in",
    phone: "+91 98765 43211",
    role: "Member",
    permissions: ["Dashboard", "Sanitation", "Complaints"]
  },
  {
    id: "STF-002",
    name: "Deepa Sundaram",
    email: "deepa.s@ward18.in",
    phone: "+91 98234 56780",
    role: "Member",
    permissions: ["Dashboard", "Citizens", "Govt Schemes"]
  },
  {
    id: "STF-003",
    name: "Michael D'Souza",
    email: "michael.d@ward18.in",
    phone: "+91 99887 76650",
    role: "Member",
    permissions: ["Dashboard", "Emergency Alert", "Complaints"]
  },
  {
    id: "STF-004",
    name: "Siddharth Mehta",
    email: "siddharth.m@ward18.in",
    phone: "+91 91234 56780",
    role: "Member",
    permissions: ["Dashboard", "Campaigns", "Important Contacts"]
  }
];

const AVAILABLE_PERMISSIONS = [
  "Dashboard",
  "Sanitation",
  "Campaigns",
  "Citizens",
  "Complaints",
  "Govt Schemes",
  "Important Contacts",
  "Emergency Alert"
];

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('ward18_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [selectedStaffForView, setSelectedStaffForView] = useState<StaffMember | null>(null);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffMember | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Staff');
  const [newPermissions, setNewPermissions] = useState<string[]>(["Dashboard"]);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const saveToStorage = (list: StaffMember[]) => {
    setStaff(list);
    localStorage.setItem('ward18_staff', JSON.stringify(list));
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim() || !newRole.trim()) return;

    const nextIdNumber = staff.length > 0 
      ? Math.max(...staff.map(s => parseInt(s.id.split('-')[1]))) + 1 
      : 1;
    const newId = `STF-${String(nextIdNumber).padStart(3, '0')}`;

    const newMember: StaffMember = {
      id: newId,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole.trim(),
      permissions: newPermissions
    };

    const updated = [newMember, ...staff];
    saveToStorage(updated);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('Staff');
    setNewPermissions(["Dashboard"]);
    setIsAddOpen(false);
  };

  const handleEditOpen = (member: StaffMember) => {
    setSelectedStaffForEdit(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPhone(member.phone);
    setEditRole(member.role);
    setEditPermissions(member.permissions);
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForEdit) return;

    const updated = staff.map(s => {
      if (s.id === selectedStaffForEdit.id) {
        return {
          ...s,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          role: editRole.trim(),
          permissions: editPermissions
        };
      }
      return s;
    });

    saveToStorage(updated);
    setSelectedStaffForEdit(null);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    saveToStorage(updated);
  };

  const togglePermission = (perm: string, isEdit: boolean) => {
    if (isEdit) {
      setEditPermissions(prev => 
        prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
      );
    } else {
      setNewPermissions(prev => 
        prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
      );
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <UserCog className="text-primary w-6 h-6" />
            Staff Directory
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage administrative staff profiles, configure module permissions, and edit contact configurations.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex-shrink-0 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1 self-start sm:self-center cursor-pointer"
        >
          <Plus size={14} />
          Add Staff Member
        </button>
      </div>

      {/* Filter Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" size={15} />
          <Input 
            type="text" 
            placeholder="Search staff by name, email, phone, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 font-medium text-xs rounded-xl h-9"
          />
        </div>
        <div className="text-xs font-semibold text-neutral-500 font-mono">
          Total: {filteredStaff.length} Staff Member{filteredStaff.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table Grid */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200">
              <TableHead className="p-4 w-[110px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Staff ID</TableHead>
              <TableHead className="p-4 w-[220px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name & Role</TableHead>
              <TableHead className="p-4 w-[220px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Contacts</TableHead>
              <TableHead className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Permissions</TableHead>
              <TableHead className="p-4 w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <TableRow 
                  key={member.id}
                  className="hover:bg-neutral-50/40 transition-colors border-b border-neutral-100"
                >
                  {/* ID */}
                  <TableCell className="p-4 font-bold text-neutral-850">
                    {member.id}
                  </TableCell>
                  
                  {/* Name & Role */}
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 flex items-center justify-center font-extrabold uppercase select-none">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-850 block">{member.name}</span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-0">{member.role}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Contacts */}
                  <TableCell className="p-4 space-y-1">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Mail size={12} className="text-neutral-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Phone size={12} className="text-neutral-400" />
                      <span>{member.phone}</span>
                    </div>
                  </TableCell>

                  {/* Permissions */}
                  <TableCell className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {member.permissions.map(perm => (
                        <span 
                          key={perm}
                          className="px-2 py-0 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        >
                          {perm}
                        </span>
                      ))}
                      {member.permissions.length === 0 && (
                        <span className="px-2 py-0 rounded-lg text-[9px] font-bold bg-red-50 text-red-700 border border-red-200/50">
                          No Access
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedStaffForView(member)}
                        className="text-neutral-400 hover:text-primary p-1 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200 cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEditOpen(member)}
                        className="text-neutral-400 hover:text-amber-600 p-1 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200 cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit size={14} />
                      </button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <button 
                              className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200 cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          }
                        />
                        <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm font-bold text-neutral-800">Remove Staff Member</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs text-neutral-500">
                              Are you sure you want to remove "{member.name}"? This action is permanent and will immediately revoke all their permissions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel className="text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteStaff(member.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                            >
                              Remove Staff
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
                <TableCell colSpan={5} className="p-8 text-center text-neutral-400 text-xs font-semibold">
                  No staff members matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border border-neutral-200 shadow-xl rounded-2xl">
          <form onSubmit={handleCreateStaff}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <DialogTitle className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Add New Staff Member</DialogTitle>
              <DialogClose className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                <X size={16} />
              </DialogClose>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Rahul Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="font-semibold text-xs h-9 rounded-xl"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="email@ward18.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="font-semibold text-xs h-9 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Number</label>
                  <Input 
                    type="text" 
                    placeholder="+91 9XXXX XXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="font-semibold text-xs h-9 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Administrative Role</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Sanitation Head"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="font-semibold text-xs h-9 rounded-xl"
                  required
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="space-y-2 border-t border-neutral-100 pt-3">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Configure Module Access Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label 
                      key={perm} 
                      className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox" 
                        checked={newPermissions.includes(perm)}
                        onChange={() => togglePermission(perm, false)}
                        className="rounded border-neutral-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-neutral-700">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 px-6 py-4 flex justify-end gap-2 border-t border-neutral-100">
              <DialogClose className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer">
                Cancel
              </DialogClose>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Add Staff
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog open={selectedStaffForEdit !== null} onOpenChange={(open) => { if (!open) setSelectedStaffForEdit(null); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border border-neutral-200 shadow-xl rounded-2xl">
          {selectedStaffForEdit && (
            <form onSubmit={handleUpdateStaff}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <DialogTitle className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Edit Staff Member Details</DialogTitle>
                <DialogClose className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                  <X size={16} />
                </DialogClose>
              </div>
              
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Rahul Kumar"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-semibold text-xs h-9 rounded-xl"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Email Address</label>
                    <Input 
                      type="email" 
                      placeholder="email@ward18.in"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="font-semibold text-xs h-9 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Number</label>
                    <Input 
                      type="text" 
                      placeholder="+91 9XXXX XXXXX"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="font-semibold text-xs h-9 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Administrative Role</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Sanitation Head"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="font-semibold text-xs h-9 rounded-xl"
                    required
                  />
                </div>

                {/* Permissions Checkboxes */}
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Configure Module Access Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_PERMISSIONS.map(perm => (
                      <label 
                        key={perm} 
                        className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer select-none"
                      >
                        <input 
                          type="checkbox" 
                          checked={editPermissions.includes(perm)}
                          onChange={() => togglePermission(perm, true)}
                          className="rounded border-neutral-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-neutral-700">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 px-6 py-4 flex justify-end gap-2 border-t border-neutral-100">
                <DialogClose className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer">
                  Cancel
                </DialogClose>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Staff Modal */}
      <Dialog open={selectedStaffForView !== null} onOpenChange={(open) => { if (!open) setSelectedStaffForView(null); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border border-neutral-200 shadow-xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
          {selectedStaffForView && (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <DialogTitle className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Staff Profile Card</DialogTitle>
                <DialogClose className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                  <X size={16} />
                </DialogClose>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Header profile details */}
                <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-2xl uppercase flex items-center justify-center select-none">
                    {selectedStaffForView.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-neutral-850">{selectedStaffForView.name}</h4>
                    <span className="px-2 py-0 rounded-lg text-[9px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200 uppercase tracking-wider mt-1 inline-block">
                      {selectedStaffForView.role}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-semibold block mt-1">ID: {selectedStaffForView.id}</span>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 border border-neutral-100">
                      <Mail size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Email Address</span>
                      <span className="text-xs font-semibold text-neutral-700 block mt-0">{selectedStaffForView.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 border border-neutral-100">
                      <Phone size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Phone Number</span>
                      <span className="text-xs font-semibold text-neutral-700 block mt-0">{selectedStaffForView.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-neutral-100 pt-4">
                    <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 border border-neutral-100">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Module Access Permissions</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedStaffForView.permissions.map(perm => (
                          <span 
                            key={perm}
                            className="px-2 py-0 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          >
                            {perm}
                          </span>
                        ))}
                        {selectedStaffForView.permissions.length === 0 && (
                          <span className="px-2 py-0 rounded-lg text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200/50">
                            Access Denied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 px-6 py-4 flex justify-end border-t border-neutral-100">
                <DialogClose className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer">
                  Close Profile
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
