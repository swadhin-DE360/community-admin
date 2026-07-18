import { useState } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Plus, 
  X
} from 'lucide-react';

// Shadcn UI Component Imports
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

interface Citizen {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  epicNo: string;
  address: string;
  registeredDate: string;
  avatarUrl?: string;
}

const initialCitizens: Citizen[] = [
  { id: "CIT-001", name: "Amit Sharma", age: 34, gender: "Male", phone: "+91 98765 43210", epicNo: "KPF0812345", address: "No 12, 1st Cross, Sector 1, Ward 18", registeredDate: "2026-05-12", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: "CIT-002", name: "Sunita Deshmukh", age: 29, gender: "Female", phone: "+91 98234 56789", epicNo: "KPF0765432", address: "Apt 405, Block B, Sector 3, Ward 18", registeredDate: "2026-06-01", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "CIT-003", name: "John Doe", age: 42, gender: "Male", phone: "+91 99887 76655", epicNo: "KPF0911223", address: "No 88, 3rd Main Road, Sector 2, Ward 18", registeredDate: "2026-07-14", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: "CIT-004", name: "Ananya Roy", age: 24, gender: "Female", phone: "+91 91234 56789", epicNo: "KPF0543210", address: "No 154, 5th Cross, Sector 4, Ward 18", registeredDate: "2026-07-10", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
  { id: "CIT-005", name: "Rajesh Patel", age: 56, gender: "Male", phone: "+91 94567 12345", epicNo: "KPF0321098", address: "No 72, Sector 2, Ward 18", registeredDate: "2026-06-25", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  { id: "CIT-006", name: "Priya Nair", age: 31, gender: "Female", phone: "+91 97422 33445", epicNo: "KPF0123456", address: "No 9, 2nd Main, Sector 1, Ward 18", registeredDate: "2026-07-15", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { id: "CIT-007", name: "Zayn Malik", age: 28, gender: "Male", phone: "+91 90088 11223", epicNo: "KPF0654321", address: "No 110, 4th Main, Sector 3, Ward 18", registeredDate: "2026-07-02", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" }
];

export default function Citizens() {
  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    const saved = localStorage.getItem('ward18_citizens');
    return saved ? JSON.parse(saved) : initialCitizens;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [selectedCitizenForView, setSelectedCitizenForView] = useState<Citizen | null>(null);
  const [citizenIdToDelete, setCitizenIdToDelete] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPhone, setNewPhone] = useState('');
  const [newEpicNo, setNewEpicNo] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  const saveToStorage = (list: Citizen[]) => {
    setCitizens(list);
    localStorage.setItem('ward18_citizens', JSON.stringify(list));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newEpicNo.trim() || !newAddress.trim()) return;

    const newCitizen: Citizen = {
      id: `CIT-${Date.now().toString().slice(-3)}`,
      name: newName.trim(),
      age: Number(newAge),
      gender: newGender,
      phone: newPhone.trim(),
      epicNo: newEpicNo.trim().toUpperCase(),
      address: newAddress.trim(),
      avatarUrl: newAvatarUrl.trim() || undefined,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    const updated = [newCitizen, ...citizens];
    saveToStorage(updated);
    setIsAddOpen(false);

    // Reset Form
    setNewName('');
    setNewAge(30);
    setNewGender('Male');
    setNewPhone('');
    setNewEpicNo('');
    setNewAddress('');
    setNewAvatarUrl('');
  };

  const handleDeleteCitizen = (id: string) => {
    const updated = citizens.filter(c => c.id !== id);
    saveToStorage(updated);
  };

  // Filter Logic
  const filteredCitizens = citizens.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.epicNo && c.epicNo.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredCitizens.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCitizens = filteredCitizens.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Users className="text-primary w-6 h-6" />
            Citizens Directory
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage registered profiles of Ward 18 residents, check address configurations and coordinate voter registry listings.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex-shrink-0 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1 self-start sm:self-center"
        >
          <Plus size={14} />
          Register Citizen
        </button>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" size={15} />
          <Input 
            type="text" 
            placeholder="Search citizens (Name, Phone, EPIC, Address)..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 font-medium text-xs rounded-xl h-9"
          />
        </div>
        
        <div className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
          Showing {Math.min(startIndex + 1, filteredCitizens.length)} to {Math.min(startIndex + itemsPerPage, filteredCitizens.length)} of {filteredCitizens.length} citizens
        </div>
      </div>

      {/* Citizens Grid Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200">
              <TableHead className="p-4 w-[110px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Citizen ID</TableHead>
              <TableHead className="p-4 w-[200px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Full Name</TableHead>
              <TableHead className="p-4 w-[110px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Demographics</TableHead>
              <TableHead className="p-4 w-[140px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</TableHead>
              <TableHead className="p-4 w-[150px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">EPIC No</TableHead>
              <TableHead className="p-4 w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
            {paginatedCitizens.length > 0 ? (
              paginatedCitizens.map((c) => {
                return (
                  <TableRow 
                    key={c.id} 
                    className="hover:bg-neutral-50/40 transition-colors border-b border-neutral-100"
                  >
                    {/* ID */}
                    <TableCell className="p-4 font-bold text-neutral-800">
                      {c.id}
                    </TableCell>
                    {/* Name */}
                    <TableCell className="p-4 font-bold text-neutral-850 text-sm">
                      <div className="flex items-center gap-2">
                        <img 
                          src={c.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`;
                          }}
                        />
                        <span>{c.name}</span>
                      </div>
                    </TableCell>
                    {/* Demographics */}
                    <TableCell className="p-4 text-neutral-600">
                      {c.age} yrs / {c.gender}
                    </TableCell>
                    {/* Phone */}
                    <TableCell className="p-4 font-semibold text-neutral-700">
                      {c.phone}
                    </TableCell>
                    {/* EPIC No */}
                    <TableCell className="p-4 font-extrabold text-neutral-850 tracking-wider">
                      {c.epicNo || "N/A"}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCitizenForView(c)}
                          className="text-neutral-400 hover:text-neutral-800 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setCitizenIdToDelete(c.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Citizen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-neutral-400 font-medium">
                  No citizen records found matching your selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 p-4 bg-neutral-50/40">
            <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
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

      {/* View Details Modal */}
      {selectedCitizenForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Citizen Profile Details</h3>
              <button 
                onClick={() => setSelectedCitizenForView(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 text-xs font-semibold text-neutral-600">
              {/* Profile Image & Header Details */}
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
                <img 
                  src={selectedCitizenForView.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCitizenForView.name)}`}
                  alt={selectedCitizenForView.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCitizenForView.name)}`;
                  }}
                />
                <div>
                  <h4 className="text-base font-extrabold text-neutral-850">{selectedCitizenForView.name}</h4>
                  <p className="text-xs text-neutral-500 font-semibold mt-0">{selectedCitizenForView.age} yrs / {selectedCitizenForView.gender}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0 rounded uppercase tracking-wider">
                    ID: {selectedCitizenForView.id}
                  </span>
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">EPIC Number</label>
                  <span className="text-sm font-extrabold text-neutral-800 tracking-wider uppercase block">{selectedCitizenForView.epicNo || "N/A"}</span>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                  <span className="text-sm font-bold text-neutral-850 block">{selectedCitizenForView.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Registered Date</label>
                  <span className="text-sm font-bold text-neutral-850 block">{selectedCitizenForView.registeredDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Residential Address</label>
                <div className="text-xs text-neutral-750 bg-neutral-50 p-3 rounded-xl border border-neutral-200/50 leading-relaxed font-semibold">
                  {selectedCitizenForView.address}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end">
              <Button
                onClick={() => setSelectedCitizenForView(null)}
                variant="outline"
                className="h-8 rounded-xl text-xs font-bold text-neutral-600 px-4 bg-white shadow-sm border-neutral-200"
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Register Citizen Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleCreateCitizen}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Register New Citizen</h3>
                <button 
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Ramesh Kumar"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="font-semibold text-xs h-9 rounded-xl"
                    required
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Age (Years)</label>
                    <Input 
                      type="number" 
                      min={18}
                      max={120}
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="font-semibold text-xs h-9 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Gender</label>
                    <Select value={newGender} onValueChange={(val) => setNewGender(val as any)}>
                      <SelectTrigger className="w-full h-9 text-xs font-semibold text-neutral-700 rounded-xl">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Phone & EPIC No */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Number</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. +91 98765 43210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="font-semibold text-xs h-9 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">EPIC Number</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. KPF0812345"
                      value={newEpicNo}
                      onChange={(e) => setNewEpicNo(e.target.value)}
                      className="font-semibold text-xs h-9 rounded-xl uppercase"
                      required
                    />
                  </div>
                </div>

                 {/* Profile Photo Upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Profile Photo (Optional)</label>
                  
                  <div className="flex items-center gap-4">
                    <label 
                      htmlFor="avatar-upload"
                      className="relative w-28 h-28 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary/50 bg-neutral-50/50 hover:bg-neutral-50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-sm"
                    >
                      {newAvatarUrl ? (
                        <>
                          <img src={newAvatarUrl} alt="Upload preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">Change Photo</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-neutral-400 group-hover:text-primary transition-colors p-2 text-center select-none">
                          <Plus size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Upload Photo</span>
                        </div>
                      )}
                    </label>
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Residential Address</label>
                  <textarea 
                    placeholder="Enter complete house number, street, cross, ward details..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    rows={3}
                    className="w-full p-2 text-xs bg-transparent border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-ring/50 transition-all text-neutral-700 font-semibold resize-none placeholder:text-neutral-400"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="font-bold text-xs h-9 rounded-xl hover:bg-neutral-50 px-4 bg-white shadow-sm border-neutral-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="font-bold text-xs h-9 rounded-xl px-5 bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  Register Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!citizenIdToDelete} onOpenChange={(open) => { if (!open) setCitizenIdToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the citizen profile and remove them from our Ward 18 database registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCitizenIdToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive"
              onClick={() => {
                if (citizenIdToDelete) {
                  handleDeleteCitizen(citizenIdToDelete);
                  setCitizenIdToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
