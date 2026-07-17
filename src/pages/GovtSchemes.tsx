import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ExternalLink, 
  Trash, 
  Globe,
  Sparkles
} from 'lucide-react';
import { initialSchemes } from '../mockData';
import type { CitizenScheme } from '../mockData';

export default function GovtSchemes() {
  const [schemes, setSchemes] = useState<CitizenScheme[]>(initialSchemes);
  const [searchTerm, setSearchTerm] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [schemeEligibility, setSchemeEligibility] = useState('');
  const [schemeUrl, setSchemeUrl] = useState('');
  const [schemeDesc, setSchemeDesc] = useState('');
  const [showSchemeForm, setShowSchemeForm] = useState(false);

  const handleAddSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName.trim() || !schemeEligibility.trim() || !schemeUrl.trim()) return;

    const newScheme: CitizenScheme = {
      id: `SCHEME-${Date.now().toString().slice(-4)}`,
      name: schemeName.trim(),
      eligibility: schemeEligibility.trim(),
      applyUrl: schemeUrl.trim().startsWith('http') ? schemeUrl.trim() : `https://${schemeUrl.trim()}`,
      description: schemeDesc.trim() || "No additional description provided."
    };

    setSchemes(prev => [newScheme, ...prev]);
    
    // Reset Form
    setSchemeName('');
    setSchemeEligibility('');
    setSchemeUrl('');
    setSchemeDesc('');
    setShowSchemeForm(false);
  };

  const handleDeleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
  };

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Widget */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Building2 className="text-primary w-6 h-6" />
            Government Welfare Schemes
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Maintain active citizen benefit schemes, eligibility rules, and official application portals.
          </p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input 
            type="text" 
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400 font-medium text-neutral-700"
          />
        </div>

        <button
          onClick={() => setShowSchemeForm(!showSchemeForm)}
          className="w-full sm:w-auto py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-emerald-500/10 transition-colors text-xs font-extrabold flex items-center justify-center gap-1.5"
        >
          <Plus size={14} />
          Add Welfare Scheme
        </button>
      </div>

      {/* Add Scheme Form */}
      {showSchemeForm && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" />
              Add Government Scheme
            </h3>
            <button 
              onClick={() => setShowSchemeForm(false)}
              className="text-xs text-neutral-400 hover:text-charcoal font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddSchemeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Scheme Name</label>
              <input 
                type="text" 
                placeholder="e.g. Solar Rooftop Subvention"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Apply Portal URL</label>
              <input 
                type="text" 
                placeholder="e.g. www.schemeportal.gov.in"
                value={schemeUrl}
                onChange={(e) => setSchemeUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-neutral-600">Eligibility Rules</label>
              <input 
                type="text" 
                placeholder="e.g. State residents with property size less than 1200 sq ft."
                value={schemeEligibility}
                onChange={(e) => setSchemeEligibility(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-semibold"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-neutral-600">Scheme Description</label>
              <textarea 
                placeholder="Short outline detailing what benefits the scheme distributes..."
                value={schemeDesc}
                onChange={(e) => setSchemeDesc(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 font-medium"
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-extrabold text-xs shadow-sm transition-colors text-center"
            >
              Publish Government Scheme
            </button>
          </form>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((s) => (
            <div 
              key={s.id} 
              className="bg-white p-5 rounded-2xl border border-neutral-200 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-500/10 px-2.5 py-1 rounded-lg w-fit">
                  <Building2 size={13} />
                  <span>{s.id}</span>
                </div>
                
                <h3 className="font-extrabold text-sm text-charcoal leading-snug line-clamp-2">{s.name}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-medium line-clamp-3">{s.description}</p>
              </div>

              <div className="border-t border-neutral-100 mt-4 pt-4 space-y-3">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-150 text-[11px]">
                  <span className="font-bold text-neutral-500 block uppercase tracking-wider">Eligibility Rule:</span>
                  <span className="text-charcoal font-medium mt-0.5 block">{s.eligibility}</span>
                </div>

                <div className="flex items-center justify-between">
                  <a 
                    href={s.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary-dark text-xs font-extrabold flex items-center gap-1 hover:underline"
                  >
                    <Globe size={13} />
                    <span>Official Portal</span>
                    <ExternalLink size={11} />
                  </a>

                  <button 
                    onClick={() => handleDeleteScheme(s.id)}
                    className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors"
                    title="Delete Scheme"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-400 font-medium">
            No government schemes found.
          </div>
        )}
      </div>

    </div>
  );
}
