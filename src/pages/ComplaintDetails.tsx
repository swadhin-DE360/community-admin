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
  ShieldCheck
} from 'lucide-react';
import { initialComplaints } from '../mockData';
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
      <div className="space-y-6 text-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-sm max-w-2xl mx-auto mt-10">
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
      closureComment: status === 'Resolved' ? closureComment : undefined
    } : null);

    // Redirect user back to the list
    navigate('/complaints');
  };

  // Format date and time
  const [datePart, timePart] = complaint.dateFiled.split(' ');

  // Check if status or closureComment has changed compared to the initial complaint details
  const hasChanges = status !== complaint.status || closureComment !== (complaint.closureComment || '');
  const isValidResolved = status !== 'Resolved' || closureComment.trim() !== '';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner Layout */}
      <div className="bg-gradient-to-r from-neutral-50 via-neutral-100/35 to-neutral-50 p-6 rounded-3xl border border-neutral-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/complaints')}
            className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
            title="Back to Complaints"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-400">Complaints Registry</span>
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-neutral-200/60 text-neutral-600 border border-neutral-300/40 font-mono">
                {complaint.id}
              </span>
            </div>
            <h1 className="text-xl font-black text-neutral-800 mt-1 tracking-tight">Complaint Details File</h1>
          </div>
        </div>

        <div className="flex items-center">
          <span className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold border shadow-xs flex items-center gap-1.5 ${
            complaint.status === 'Pending' 
              ? 'bg-amber-50 border-amber-200/80 text-amber-800' 
              : complaint.status === 'In Progress' 
              ? 'bg-blue-50 border-blue-200/80 text-blue-800' 
              : 'bg-emerald-50 border-emerald-200/80 text-emerald-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              complaint.status === 'Pending' 
                ? 'bg-amber-500' 
                : complaint.status === 'In Progress' 
                ? 'bg-blue-500 animate-pulse' 
                : 'bg-emerald-500'
            }`} />
            {complaint.status}
          </span>
        </div>
      </div>

      {/* 2. Grid Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card: Primary Info */}
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/70 shadow-xs space-y-6">
            
            {/* Title & Category/Date */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 leading-tight tracking-tight">{complaint.title}</h2>
              
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-neutral-600">
                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-250/60 shadow-xxs">
                  <Tag size={13} className="text-neutral-400" />
                  {complaint.category}
                </span>
                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-250/60 shadow-xxs">
                  <Calendar size={13} className="text-neutral-400" />
                  {datePart}
                </span>
                {timePart && (
                  <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-250/60 shadow-xxs">
                    <Clock size={13} className="text-neutral-400" />
                    {timePart}
                  </span>
                )}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Description of Issue</span>
              <p className="text-neutral-600 text-sm leading-relaxed bg-neutral-50/50 p-5 rounded-2xl border border-neutral-200/50 font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Photo Attachment preview */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Citizen Attachment Preview</span>
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50/40 max-h-[380px] shadow-xs flex items-center justify-center">
                <img 
                  src={complaint.photoUrl} 
                  alt="Complaint Proof" 
                  className="max-h-[380px] w-auto object-contain transition-all duration-300 hover:scale-[1.01]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=400";
                  }}
                />
              </div>
            </div>

          </div>

          {/* Card: Citizen Details */}
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/70 shadow-xs space-y-6">
            <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Reporting Citizen Contact Info</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold">
              <div className="flex items-center gap-3.5 p-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 transition-colors hover:bg-neutral-50">
                <User size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Citizen Name</span>
                  <span className="text-neutral-800 mt-0.5 font-bold">{complaint.residentName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 transition-colors hover:bg-neutral-50">
                <Phone size={18} className="text-neutral-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Phone Number</span>
                  <span className="text-neutral-800 mt-0.5 font-bold">{complaint.residentPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 transition-colors hover:bg-neutral-50 sm:col-span-2">
                <MapPin size={18} className="text-neutral-400 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Residential Address</span>
                  <span className="text-neutral-600 font-semibold leading-relaxed mt-0.5">{complaint.residentAddress}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Admin Panel Controls */}
        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/70 shadow-xs space-y-6 sticky top-6">
            <div>
              <h3 className="text-md font-black text-neutral-800 tracking-tight">Admin Control Panel</h3>
              <p className="text-xs text-neutral-400 mt-1 font-semibold leading-relaxed">Review status update, assign engineering staff, or resolve report.</p>
            </div>

            <hr className="border-neutral-100" />

            {/* 1. Change Status */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-extrabold text-neutral-500 tracking-wider block flex items-center gap-1.5">
                Update Current Status
              </label>
              <Select value={status} onValueChange={(val) => setStatus(val as Complaint['status'])} disabled={complaint.status === 'Resolved'}>
                <SelectTrigger className="w-full h-11 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-neutral-200 shadow-sm">
                  <SelectItem value="Pending" className="text-xs font-semibold">Pending</SelectItem>
                  <SelectItem value="In Progress" className="text-xs font-semibold">In Progress</SelectItem>
                  <SelectItem value="Resolved" className="text-xs font-semibold">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>



            {/* 3. Closure Comment */}
            {status === 'Resolved' && (
              <div className="space-y-2 animate-in slide-in-from-top duration-200">
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 tracking-wider block">
                  Closure Comment (Resolution) <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  placeholder="Specify materials used, steps taken, or date of restoration..."
                  value={closureComment}
                  onChange={(e) => setClosureComment(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 placeholder:text-neutral-400 font-semibold"
                  required
                  disabled={complaint.status === 'Resolved'}
                />
              </div>
            )}

            {/* Submit Action */}
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || !isValidResolved}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-neutral-350 disabled:to-neutral-350 text-white rounded-xl shadow-md text-xs font-black tracking-wide transition-all h-11 active:scale-[0.99] border-t border-emerald-400/20"
            >
              Apply Changes & Return
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
