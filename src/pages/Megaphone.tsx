import { useState } from 'react';
import { 
  Megaphone as MegaphoneIcon,
  AlertTriangle,
  AlertOctagon,
  Info,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { initialAlerts } from '../mockData';
import type { MegaphoneAlert } from '../mockData';

export default function Megaphone() {
  const [alerts, setAlerts] = useState<MegaphoneAlert[]>(initialAlerts);
  const addAlert = (newAlert: MegaphoneAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };
  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<MegaphoneAlert['severity']>('Info');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    // Formatting date as "YYYY-MM-DD hh:mm AM/PM"
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${dateStr} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    const newAlert: MegaphoneAlert = {
      id: `ALERT-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      message: message.trim(),
      severity,
      datePublished: formattedTime
    };

    addAlert(newAlert);
    
    // Reset form
    setTitle('');
    setMessage('');
    setSeverity('Info');
  };

  const getSeverityStyles = (sev: MegaphoneAlert['severity']) => {
    switch (sev) {
      case 'Critical':
        return {
          card: 'border-l-4 border-red-500 bg-red-50/50 hover:bg-red-50',
          badge: 'bg-red-100 text-red-800',
          icon: AlertOctagon,
          iconColor: 'text-red-500',
          bullet: 'bg-red-500'
        };
      case 'Warning':
        return {
          card: 'border-l-4 border-amber-500 bg-amber-50/50 hover:bg-amber-50',
          badge: 'bg-amber-100 text-amber-800',
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          bullet: 'bg-amber-500'
        };
      case 'Info':
        return {
          card: 'border-l-4 border-blue-500 bg-blue-50/50 hover:bg-blue-50',
          badge: 'bg-blue-100 text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500',
          bullet: 'bg-blue-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Title Header (Span full 12 cols) */}
      <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <MegaphoneIcon className="text-primary w-6 h-6" />
          Emergency Broadcast Megaphone
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Instantly publish warning banners, critical safety announcements, or service outages to the citizen app.
        </p>
      </div>

      {/* Left: Alert Creator Panel (5 cols) */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm h-fit">
        <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-1.5">
          <Sparkles size={18} className="text-emerald-600" />
          Create New Broadcast
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Severity selector chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 block">Severity Level</label>
            <div className="flex gap-2">
              {(['Critical', 'Warning', 'Info'] as const).map((sev) => {
                const isActive = severity === sev;
                const isCritical = sev === 'Critical';
                const isWarning = sev === 'Warning';
                
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isActive 
                        ? isCritical
                          ? 'bg-red-100 text-red-800 border-red-300 shadow-sm shadow-red-500/10'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm shadow-blue-500/10'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 block">Broadcast Title</label>
            <input 
              type="text" 
              placeholder="e.g. Water Logging Alert or Power Outage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 placeholder:text-neutral-400 font-semibold"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 block">Detailed Message</label>
            <textarea
              placeholder="Provide guidelines, timings, helpline numbers, or alternative arrangements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 placeholder:text-neutral-400 font-medium"
              required
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-emerald-500/15 transition-all text-xs font-extrabold flex items-center justify-center gap-1.5 mt-2"
          >
            <MegaphoneIcon size={14} />
            Publish Alert Live
          </button>

        </form>
      </div>

      {/* Right: Mock Live Alert Feed (7 cols) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col min-h-[420px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-charcoal">Live Broadcast Feed</h2>
            <p className="text-neutral-500 text-xs mt-0.5">Currently active safety feeds distributed on citizen apps.</p>
          </div>
          <span className="text-[10px] font-bold bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-500">
            {alerts.length} Active
          </span>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[420px] pr-1">
          {alerts.length > 0 ? (
            alerts.map((a) => {
              const styles = getSeverityStyles(a.severity);
              const SeverityIcon = styles.icon;
              
              return (
                <div 
                  key={a.id} 
                  className={`p-4 rounded-xl border border-neutral-200/80 transition-all ${styles.card} flex gap-4`}
                >
                  {/* Status Indicator Icon */}
                  <div className={`w-8 h-8 rounded-lg bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0 ${styles.iconColor}`}>
                    <SeverityIcon size={16} />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="font-bold text-sm text-charcoal leading-snug">{a.title}</span>
                      <span className={`self-start sm:self-center text-[9px] font-bold px-2 py-0.5 rounded-md ${styles.badge}`}>
                        {a.severity}
                      </span>
                    </div>

                    <p className="text-neutral-500 text-xs leading-relaxed font-medium">
                      {a.message}
                    </p>

                    {/* Footer Info & Actions */}
                    <div className="flex items-center justify-between border-t border-neutral-150/50 pt-2 mt-2 text-[10px] text-neutral-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} />
                        <span>Published: {a.datePublished}</span>
                      </div>
                      
                      {/* Delete Action Button */}
                      <button
                        onClick={() => deleteAlert(a.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1"
                        title="Archive Alert"
                      >
                        <Trash2 size={12} />
                        <span>Archive</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 text-sm py-12">
              <MegaphoneIcon size={40} className="text-neutral-300 stroke-[1.5] mb-2" />
              <span>No active broadcasts. Ward feed is clear.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
