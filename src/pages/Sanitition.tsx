import { 
  Sparkles,
  Truck, 
  Users, 
  Trash2, 
  Clock, 
  Phone,
  Mail,
  User,
  MapPin
} from 'lucide-react';
import { initialComplaints, initialDirectory } from '../mockData';

export default function Sanitition() {
  const complaints = initialComplaints;

  // Filter complaints to show only Sanitation & Waste related issues
  const sanitationComplaints = complaints.filter(c => 
    c.category === 'Waste Management' || 
    c.category === 'Water Supply' || 
    c.category.toLowerCase().includes('sewage') ||
    c.category.toLowerCase().includes('clean')
  );

  // Filter directory to show Sanitation-related contacts
  const sanitationContacts = initialDirectory.filter(d => 
    d.role.toLowerCase().includes('sanitary') || 
    d.role.toLowerCase().includes('health')
  );

  // Mock statistics for the Sanitation Page
  const stats = [
    { label: "Waste Trucks Dispatched", value: "12 / 12", detail: "100% attendance rate", icon: Truck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Sweeping Staff Active", value: "48 / 50", detail: "Sector 1-4 coverage", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Waste Collected (Today)", value: "8.4 Tons", detail: "Wet: 4.8t | Dry: 3.6t", icon: Trash2, color: "text-amber-600 bg-amber-50" },
    { label: "Next Shift Clearance", value: "04:30 PM", detail: "Scheduled daily round", icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header Widget */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <Truck className="text-primary w-6 h-6" />
          Sanitation & Waste Management
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Monitor waste collection schedules, dispatch sanitation crews, and resolve sanitary/hygiene grievances in Ward 18.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-200/85 hover:border-emerald-500/20 hover:shadow-md transition-all duration-350 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${s.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-neutral-500 font-semibold tracking-wide block uppercase">{s.label}</span>
                <span className="text-2xl font-extrabold text-charcoal mt-1 block">{s.value}</span>
              </div>
              <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-neutral-400 font-semibold">
                <span>{s.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Crew & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Sanitation Grievances (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-1">
              <Sparkles size={18} className="text-emerald-600" />
              Active Sanitation Complaints ({sanitationComplaints.length})
            </h2>
            <p className="text-neutral-500 text-xs mt-0">Complaints categorized under Waste Management or Water Supply.</p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
            {sanitationComplaints.length > 0 ? (
              sanitationComplaints.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-neutral-150 hover:bg-neutral-50/50 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-neutral-700">{c.id}</span>
                      <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0 rounded">
                        {c.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0 rounded text-[9px] font-extrabold ${
                        c.status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : c.status === 'In Progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-charcoal">{c.title}</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                      "{c.description}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-neutral-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        Filed by: {c.residentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {c.residentAddress.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-neutral-400 font-medium text-sm">
                No sanitation complaints active.
              </div>
            )}
          </div>
        </div>

        {/* Right: Sanitation Command & Crew (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-1">
            <Users size={18} className="text-emerald-600" />
            Sanitation Leadership Directory
          </h2>
          
          <div className="space-y-4">
            {sanitationContacts.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-neutral-150 bg-neutral-50/50 hover:bg-neutral-50 transition-all flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {c.name.split(' ').slice(-1)[0]?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-charcoal">{c.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">{c.role}</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-neutral-150/40 pt-3 mt-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-neutral-400" />
                    <a href={`tel:${c.phone}`} className="hover:text-primary transition-colors font-medium">{c.phone}</a>
                  </div>
                  {c.email && c.email !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-neutral-400" />
                      <a href={`mailto:${c.email}`} className="hover:text-primary transition-colors font-medium truncate">{c.email}</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-emerald-950 text-emerald-100 p-4 rounded-xl border border-emerald-900 flex items-center gap-3">
            <Truck size={24} className="text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Sanitation Duty Command</span>
              <p className="text-emerald-300 mt-0 font-medium leading-snug">All 4 sweeping zones are logged. Next inspection round scheduled at 05:00 PM.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
