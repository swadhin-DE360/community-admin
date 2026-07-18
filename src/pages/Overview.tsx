import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Megaphone, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Hourglass
} from 'lucide-react';
import { initialComplaints, initialAlerts, initialCampaigns } from '../mockData';

export default function Overview() {
  const navigate = useNavigate();
  const complaints = initialComplaints;
  const alerts = initialAlerts;
  const campaigns = initialCampaigns;

  // Calculations based on live context state
  const totalResidents = 14280; // Demo base
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  
  const activeAlertsCount = alerts.length;
  const upcomingCampaignsCount = campaigns.length;

  // Sorting recent activity (mix of complaints and alerts)
  const activities = [
    ...complaints.map(c => ({
      id: c.id,
      type: 'complaint',
      title: c.title,
      subtitle: `Filed by ${c.residentName} (${c.category})`,
      time: c.dateFiled,
      status: c.status,
      badgeColor: c.status === 'Pending' ? 'bg-amber-100 text-amber-800' : c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
    })),
    ...alerts.map(a => ({
      id: a.id,
      type: 'alert',
      title: a.title,
      subtitle: `Emergency Broadcast (${a.severity})`,
      time: a.datePublished.split(' ')[0], // Date portion
      status: a.severity,
      badgeColor: a.severity === 'Critical' ? 'bg-red-100 text-red-800' : a.severity === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Ward 18 Dashboard Overview</h1>
          <p className="text-neutral-500 text-sm mt-1">Real-time civic monitoring, complaint tracking, and alert systems.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-lg w-fit">
          <Clock size={14} className="text-neutral-500" />
          Last synced: Just Now
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Residents */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/85 hover:border-emerald-500/20 hover:shadow-md transition-all duration-350 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-primary flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0 rounded-full flex items-center gap-0">
              +2.4% <ArrowUpRight size={10} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-neutral-500 font-semibold tracking-wide block uppercase">Registered Residents</span>
            <span className="text-3xl font-extrabold text-charcoal mt-1 block">{totalResidents.toLocaleString()}</span>
          </div>
          <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>98.6% profile completion</span>
          </div>
        </div>

        {/* Card 2: Active Complaints */}
        <div 
          onClick={() => navigate('/complaints')}
          className="bg-white p-5 rounded-2xl border border-neutral-200/85 hover:border-amber-500/20 hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText size={20} />
            </div>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0 rounded-full">
              Live Tracker
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-neutral-500 font-semibold tracking-wide block uppercase">Active Complaints</span>
            <span className="text-3xl font-extrabold text-charcoal mt-1 block">{activeComplaints}</span>
          </div>
          
          {/* Breakdown pill indicators */}
          <div className="border-t border-neutral-100 mt-4 pt-3 flex gap-2">
            <span className="text-[10px] font-bold px-2 py-0 rounded-md bg-amber-100 text-amber-700">
              {pendingCount} Pending
            </span>
            <span className="text-[10px] font-bold px-2 py-0 rounded-md bg-blue-100 text-blue-700">
              {inProgressCount} In Progress
            </span>
          </div>
        </div>

        {/* Card 3: Emergency Broadcasts */}
        <div 
          onClick={() => navigate('/emergency-alert')}
          className="bg-white p-5 rounded-2xl border border-neutral-200/85 hover:border-red-500/20 hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Megaphone size={20} />
              </div>
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-ping"></span>
              )}
            </div>
            {activeAlertsCount > 0 ? (
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0 rounded-full animate-pulse">
                Broadcast Live
              </span>
            ) : (
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0 rounded-full">
                Inactive
              </span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-xs text-neutral-500 font-semibold tracking-wide block uppercase">Active Alerts</span>
            <span className="text-3xl font-extrabold text-charcoal mt-1 block">{activeAlertsCount}</span>
          </div>
          <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>Published by Megaphone</span>
          </div>
        </div>

        {/* Card 4: Upcoming Campaigns */}
        <div 
          onClick={() => navigate('/campaign')}
          className="bg-white p-5 rounded-2xl border border-neutral-200/85 hover:border-emerald-500/20 hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-primary flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0 rounded-full">
              Planner
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-neutral-500 font-semibold tracking-wide block uppercase">Upcoming Campaigns</span>
            <span className="text-3xl font-extrabold text-charcoal mt-1 block">{upcomingCampaignsCount}</span>
          </div>
          <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>Next Drive: {campaigns[0]?.date ? campaigns[0].date : 'None'}</span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Detailed breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Visual Progress Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-charcoal">Complaints Closure Performance</h2>
            <p className="text-neutral-500 text-xs mt-0">Summary of community issue resolution efficacy.</p>
          </div>

          <div className="my-6 space-y-5">
            {/* Resolution rate progress bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-600">Resolution Rate</span>
                <span className="text-emerald-700 font-bold">
                  {complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${complaints.length > 0 ? (resolvedCount / complaints.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Status breakdown progress tracks */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-neutral-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Resolved Complaints</span>
                </div>
                <span className="font-bold text-charcoal">{resolvedCount}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-neutral-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>In Progress</span>
                </div>
                <span className="font-bold text-charcoal">{inProgressCount}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-neutral-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Pending (Awaiting Action)</span>
                </div>
                <span className="font-bold text-charcoal">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Recap */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 flex justify-between items-center text-center">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Logged</span>
              <span className="block text-xl font-extrabold text-charcoal mt-0">{complaints.length}</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Resolved</span>
              <span className="block text-xl font-extrabold text-primary mt-0">{resolvedCount}</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Avg Restoral</span>
              <span className="block text-xl font-extrabold text-charcoal mt-0">36h</span>
            </div>
          </div>
        </div>

        {/* Column 2: Recent Activity Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-charcoal">Recent Activity Feed</h2>
            <p className="text-neutral-500 text-xs mt-0">Timeline of late-breaking alerts and civic submissions.</p>
          </div>

          {/* Timeline Feed */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {activities.length > 0 ? (
              activities.map((act, index) => (
                <div key={`${act.id}-${index}`} className="flex gap-4 relative group">
                  {/* Vertical line connecting nodes */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[17px] top-[30px] bottom-[-20px] w-0 bg-neutral-100"></div>
                  )}

                  {/* Icon Node */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 shadow-sm ${
                    act.type === 'complaint' 
                      ? 'bg-neutral-100 text-neutral-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {act.type === 'complaint' ? (
                      act.status === 'Resolved' ? (
                        <CheckCircle2 size={16} className="text-primary" />
                      ) : act.status === 'In Progress' ? (
                        <Hourglass size={16} className="text-blue-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-500" />
                      )
                    ) : (
                      <Megaphone size={16} />
                    )}
                  </div>

                  {/* Info Panel */}
                  <div className="flex-1 bg-neutral-50/50 hover:bg-neutral-50 p-3 rounded-xl border border-neutral-150 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="font-semibold text-sm text-charcoal tracking-wide leading-tight">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 self-start sm:self-center">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                      {act.subtitle}
                    </p>
                    
                    {/* Badge */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0 rounded-md ${act.badgeColor}`}>
                        {act.status}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-semibold">{act.id}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-neutral-400 text-sm">
                No recent activity recorded
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
