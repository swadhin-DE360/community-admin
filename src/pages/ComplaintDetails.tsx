import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin, 
  Phone, 
  User, 
  Calendar,
  Tag,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { engineersList, initialComplaints } from '../mockData';
import type { Complaint } from '../mockData';

// Shadcn UI Component Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  // Edit states
  const [status, setStatus] = useState<Complaint['status']>('Pending');
  const [engineer, setEngineer] = useState('Unassigned');
  const [closureComment, setClosureComment] = useState('');

  // Load the specific complaint from localStorage or initial list
  useEffect(() => {
    const saved = localStorage.getItem('ward18_complaints');
    const list: Complaint[] = saved ? JSON.parse(saved) : initialComplaints;
    const found = list.find(c => c.id === id);
    if (found) {
      setComplaint(found);
      setStatus(found.status);
      setEngineer(found.engineer);
      setClosureComment(found.closureComment || '');
    }
  }, [id]);

  if (!complaint) {
    return (
      <div className="space-y-6 text-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-800">Complaint Not Found</h2>
        <p className="text-neutral-500 text-sm mt-2">The complaint ID you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/complaints')} className="mt-6" variant="outline">
          <ArrowLeft size={16} className="mr-2" /> Back to Complaints
        </Button>
      </div>
    );
  }

  const handleSaveChanges = () => {
    const saved = localStorage.getItem('ward18_complaints');
    const list: Complaint[] = saved ? JSON.parse(saved) : initialComplaints;
    
    const updatedList = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          engineer,
          closureComment: status === 'Resolved' ? closureComment : undefined
        };
      }
      return c;
    });

    localStorage.setItem('ward18_complaints', JSON.stringify(updatedList));
    
    // Update local state to reflect changes instantly on details page
    setComplaint(prev => prev ? {
      ...prev,
      status,
      engineer,
      closureComment: status === 'Resolved' ? closureComment : undefined
    } : null);

    // Redirect user back to the list
    navigate('/complaints');
  };

  // Format date and time
  const [datePart, timePart] = complaint.dateFiled.split(' ');

  return (
    <div className="space-y-6">
      
      {/* Header View */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/complaints')}
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 hover:shadow-sm transition-all"
            title="Back to Complaints"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Complaints Registry</span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                {complaint.id}
              </span>
            </div>
            <h1 className="text-xl font-bold text-charcoal mt-1">Complaint Details File</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            complaint.status === 'Pending' 
              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
              : complaint.status === 'In Progress' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {complaint.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Complaint Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Primary Info */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6">
            
            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-charcoal">{complaint.title}</h2>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-500">
                <span className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                  <Tag size={13} className="text-neutral-400" />
                  {complaint.category}
                </span>
                <span className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                  <Calendar size={13} className="text-neutral-400" />
                  {datePart}
                </span>
                {timePart && (
                  <span className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                    <Clock size={13} className="text-neutral-400" />
                    {timePart}
                  </span>
                )}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Description of Issue</span>
              <p className="text-neutral-600 text-sm leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-150 font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Photo Attachment preview */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Citizen Attachment Preview</span>
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 max-h-[380px] group shadow-sm flex items-center justify-center">
                <img 
                  src={complaint.photoUrl} 
                  alt="Complaint Proof" 
                  className="max-h-[380px] w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=400";
                  }}
                />
              </div>
            </div>

          </div>

          {/* Card: Citizen details */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Reporting Citizen Contact Info</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-150">
                <User size={16} className="text-neutral-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Citizen Name</span>
                  <span className="text-charcoal mt-0.5">{complaint.residentName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-150">
                <Phone size={16} className="text-neutral-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Phone Number</span>
                  <span className="text-charcoal mt-0.5">{complaint.residentPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-150 md:col-span-2">
                <MapPin size={16} className="text-neutral-400 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Residential Address</span>
                  <span className="text-neutral-600 font-medium leading-relaxed mt-0.5">{complaint.residentAddress}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Admin Panel Controls */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6 sticky top-6">
            <div>
              <h3 className="text-md font-bold text-charcoal">Admin Control Panel</h3>
              <p className="text-xs text-neutral-500 mt-1">Review status update, assign engineering staff, or resolve report.</p>
            </div>

            <hr className="border-neutral-100" />

            {/* 1. Change Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-600 block">Update Current Status</label>
              <div className="flex flex-col gap-2">
                {(['Pending', 'In Progress', 'Resolved'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      status === st 
                        ? st === 'Pending' 
                          ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                          : st === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{st}</span>
                    {status === st && <ShieldCheck size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Assign Engineer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-600 block flex items-center gap-1.5">
                <UserCheck size={14} className="text-neutral-400" /> Assign Ward Engineer
              </label>
              <Select value={engineer} onValueChange={(val) => setEngineer(val ?? 'Unassigned')}>
                <SelectTrigger className="w-full h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200">
                  <SelectValue placeholder="Leave Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Leave Unassigned</SelectItem>
                  {engineersList.map(eng => (
                    <SelectItem key={eng} value={eng}>{eng}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Closure Comment */}
            {status === 'Resolved' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-neutral-600 block">
                  Closure Comment (Resolution) <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Specify materials used, steps taken, or date of restoration..."
                  value={closureComment}
                  onChange={(e) => setClosureComment(e.target.value)}
                  rows={4}
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 placeholder:text-neutral-400 font-medium"
                  required
                />
              </div>
            )}

            {/* Submit Action */}
            <Button
              onClick={handleSaveChanges}
              disabled={status === 'Resolved' && !closureComment.trim()}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md shadow-emerald-500/10 text-xs font-extrabold transition-colors h-10"
            >
              Apply Changes & Return
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
