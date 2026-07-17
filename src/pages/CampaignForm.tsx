import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { initialCampaigns } from '../mockData';
import type { Campaign } from '../mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CampaignForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  // Form fields state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Campaign['type']>('Cleanliness');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');

  // Load existing campaign if editing
  useEffect(() => {
    if (isEdit) {
      const saved = localStorage.getItem('ward18_campaigns');
      const list: Campaign[] = saved ? JSON.parse(saved) : initialCampaigns;
      const existing = list.find(c => c.id === id);
      if (existing) {
        setTitle(existing.title);
        setType(existing.type);
        setDate(existing.date);
        setTime(existing.time);
        setVenue(existing.venue);
        setOrganizer(existing.organizer);
        setDescription(existing.description || '');
      } else {
        // Redirect if ID is invalid
        navigate('/campaign');
      }
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time.trim() || !venue.trim() || !organizer.trim()) return;

    const saved = localStorage.getItem('ward18_campaigns');
    const list: Campaign[] = saved ? JSON.parse(saved) : initialCampaigns;

    if (isEdit) {
      const updatedCampaign: Campaign = {
        id: id!,
        title: title.trim(),
        type,
        date,
        time: time.trim(),
        venue: venue.trim(),
        organizer: organizer.trim(),
        description: description.trim(),
      };
      const updatedList = list.map(c => c.id === id ? updatedCampaign : c);
      localStorage.setItem('ward18_campaigns', JSON.stringify(updatedList));
    } else {
      const newCampaign: Campaign = {
        id: `CAMP-${Date.now().toString().slice(-3)}`,
        title: title.trim(),
        type,
        date,
        time: time.trim(),
        venue: venue.trim(),
        organizer: organizer.trim(),
        description: description.trim() || "No additional description provided.",
      };
      const updatedList = [newCampaign, ...list];
      localStorage.setItem('ward18_campaigns', JSON.stringify(updatedList));
    }

    navigate('/campaign');
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/campaign')}
          className="p-2 bg-white rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800 transition-colors shadow-sm text-neutral-500"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Calendar className="text-primary w-5 h-5" />
            {isEdit ? 'Edit Campaign Drive' : 'Create New Campaign Drive'}
          </h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            {isEdit ? 'Modify details of an already scheduled campaign.' : 'Schedule a cleanliness drive, awareness camp or health screening in Ward 18.'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Campaign Title</label>
            <Input 
              type="text" 
              placeholder="e.g. Free Eye Checkup Camp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold text-xs h-9.5 rounded-xl"
              required
            />
          </div>

          {/* Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Drive Type</label>
              <Select value={type} onValueChange={(val) => setType((val as Campaign['type']) ?? 'Cleanliness')}>
                <SelectTrigger className="w-full h-9.5 text-xs font-semibold text-neutral-700 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="Health Screening">Health Screening</SelectItem>
                  <SelectItem value="Awareness">Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Date</label>
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-semibold text-xs h-9.5 rounded-xl text-neutral-700"
                required
              />
            </div>
          </div>

          {/* Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Time Slot</label>
              <Input 
                type="text" 
                placeholder="e.g. 09:00 AM - 12:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="font-semibold text-xs h-9.5 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Venue Location</label>
              <Input 
                type="text" 
                placeholder="e.g. Community Hall, Ward Office"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="font-semibold text-xs h-9.5 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Organizer */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Organizer Details</label>
            <Input 
              type="text" 
              placeholder="e.g. BBMP Health Dept, Youth Club"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="font-semibold text-xs h-9.5 rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Short Description</label>
            <textarea 
              placeholder="Provide a brief summary about the objective and who should participate..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs bg-transparent border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-ring/50 transition-all text-neutral-700 font-semibold resize-none placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="border-t border-neutral-100 pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/campaign')}
              className="font-bold text-xs h-9 rounded-xl hover:bg-neutral-50 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-bold text-xs h-9 rounded-xl px-5 bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-1.5"
            >
              {isEdit ? 'Save Changes' : 'Create Drive'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
