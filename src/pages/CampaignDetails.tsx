import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, Clock, Pencil, Trash2 } from 'lucide-react';
import { initialCampaigns } from '../mockData';
import type { Campaign } from '../mockData';
import { Button } from '@/components/ui/button';
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

export default function CampaignDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ward18_campaigns');
    const list: Campaign[] = saved ? JSON.parse(saved) : initialCampaigns;
    const found = list.find(c => c.id === id);
    if (found) {
      setCampaign(found);
    } else {
      navigate('/campaign');
    }
  }, [id, navigate]);

  const handleDelete = () => {
    const saved = localStorage.getItem('ward18_campaigns');
    const list: Campaign[] = saved ? JSON.parse(saved) : initialCampaigns;
    const updatedList = list.filter(c => c.id !== id);
    localStorage.setItem('ward18_campaigns', JSON.stringify(updatedList));
    navigate('/campaign');
  };

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTypeStyles = (cType: Campaign['type']) => {
    switch (cType) {
      case 'Cleanliness':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Health Screening':
        return 'bg-red-50 text-red-700 border-red-200/60';
      case 'Awareness':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200/60';
    }
  };

  return (
    <div className="space-y-6  animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/campaign')}
            className="p-2 bg-white rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800 transition-colors shadow-sm text-neutral-500"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Drive Details</span>
            <h1 className="text-xl font-bold text-neutral-800 leading-snug mt-0">{campaign.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/campaign/edit/${campaign.id}`)}
            className="h-8 text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Pencil size={13} />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Trash2 size={13} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        {/* Banner accent */}
        <div className="h-2 bg-primary/10 w-full" />
        
        <div className="p-6 space-y-6 text-neutral-700">
          
          {/* Category Pill and ID */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Campaign ID</span>
              <span className="font-bold text-neutral-800 text-xs">{campaign.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1 text-right">Category</span>
              <span className={`inline-flex items-center px-2 py-0 rounded text-[10px] font-extrabold border ${getTypeStyles(campaign.type)}`}>
                {campaign.type}
              </span>
            </div>
          </div>

          {/* Grid properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div className="flex gap-3">
              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 h-9 w-9 flex items-center justify-center text-neutral-400 flex-shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0">Scheduled Date</span>
                <span className="text-sm font-bold text-neutral-850">{campaign.date}</span>
              </div>
            </div>

            {/* Time */}
            <div className="flex gap-3">
              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 h-9 w-9 flex items-center justify-center text-neutral-400 flex-shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0">Time Slot</span>
                <span className="text-sm font-bold text-neutral-850">{campaign.time}</span>
              </div>
            </div>

            {/* Venue */}
            <div className="flex gap-3">
              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 h-9 w-9 flex items-center justify-center text-neutral-400 flex-shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0">Venue Location</span>
                <span className="text-sm font-bold text-neutral-850">{campaign.venue}</span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex gap-3">
              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 h-9 w-9 flex items-center justify-center text-neutral-400 flex-shrink-0">
                <User size={16} />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0">Organizer Details</span>
                <span className="text-sm font-bold text-neutral-850">{campaign.organizer}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-neutral-100 pt-5 space-y-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Drive Description & Objective</span>
            <p className="text-sm text-neutral-600 italic leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/50 font-medium">
              "{campaign.description}"
            </p>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign drive and remove it from our active planner database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
