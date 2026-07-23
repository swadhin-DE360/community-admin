import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initialSchemes } from '../mockData';
import type { CitizenScheme } from '../mockData';
import { getPdfFromIndexedDB } from '../db';

export default function GovtSchemeDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [scheme, setScheme] = useState<CitizenScheme | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ward18_schemes');
    if (saved) {
      const list: CitizenScheme[] = JSON.parse(saved);
      const existing = list.find(s => s.id === id);
      if (existing) {
        const match = initialSchemes.find(i => i.id === existing.id);
        
        let sOverview = existing.overview;
        if (!sOverview) {
          // @ts-ignore
          sOverview = existing.description || (match ? match.overview : '');
        }

        let sCategory = existing.category;
        if (!sCategory) {
          sCategory = match ? match.category : 'General';
        }

        let sKeyBenefits = existing.keyBenefits;
        if (!sKeyBenefits || !Array.isArray(sKeyBenefits)) {
          sKeyBenefits = match ? match.keyBenefits : [];
        }

        let sEligibility = existing.eligibility;
        if (!sEligibility || !Array.isArray(sEligibility)) {
          if (match && Array.isArray(match.eligibility)) {
            sEligibility = match.eligibility;
          } else {
            // @ts-ignore
            sEligibility = sEligibility ? [String(sEligibility)] : [];
          }
        }

        let sRequiredDocs = existing.requiredDocuments;
        if (!sRequiredDocs || !Array.isArray(sRequiredDocs)) {
          sRequiredDocs = match ? match.requiredDocuments : [];
        }

        setScheme({
          ...existing,
          overview: sOverview,
          category: sCategory,
          keyBenefits: sKeyBenefits,
          eligibility: sEligibility,
          requiredDocuments: sRequiredDocs
        });

        if (existing.pdfUrl) {
          getPdfFromIndexedDB(existing.id).then(storedPdf => {
            if (storedPdf) {
              setScheme(prev => prev ? { ...prev, pdfUrl: storedPdf } : null);
            }
          });
        }
      } else {
        navigate('/govt-schemes');
      }
    } else {
      const existing = initialSchemes.find(s => s.id === id);
      if (existing) {
        setScheme(existing);
      } else {
        navigate('/govt-schemes');
      }
    }
  }, [id, navigate]);

  if (!scheme) return null;

  return (
    <div className="space-y-6 mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-50 via-neutral-100/35 to-neutral-50 p-6 rounded-3xl border border-neutral-200/70 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/govt-schemes')}
            className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
            title="Back to Schemes"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-400">Government Schemes</span>
              <span className="px-2 py-0 rounded-lg text-[9px] font-bold bg-neutral-200/60 text-neutral-600 border border-neutral-300/40 font-mono">
                {scheme.id}
              </span>
            </div>
            <h1 className="text-xl font-black text-neutral-800 mt-1 tracking-tight">
              Scheme Directory Profile
            </h1>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/govt-schemes/edit/${scheme.id}`)}
          className="px-4 h-11 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold tracking-wide shadow-md flex items-center gap-1"
        >
          <Edit size={14} />
          <span>Edit</span>
        </Button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
        
        {/* Title and Category */}
        <div className="space-y-3 pb-6 border-b border-neutral-100">
          <span className="inline-flex items-center bg-neutral-50 text-neutral-600 border border-neutral-200 px-3 py-1 rounded-xl text-xs font-bold shadow-xxs">
            {scheme.category || 'General'}
          </span>
          <h2 className="text-xl font-black text-neutral-800 tracking-tight leading-snug">{scheme.name}</h2>
        </div>

        {/* Scheme Overview */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Scheme Overview</label>
          <div className="p-5 bg-neutral-50 border border-neutral-200/50 rounded-2xl text-xs font-semibold text-neutral-600 leading-relaxed">
            {scheme.overview}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Eligibility Criteria</label>
          <div className="p-5 bg-emerald-50/30 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-800 leading-relaxed">
            {Array.isArray(scheme.eligibility) ? (
              <ul className="list-disc pl-4 space-y-1">
                {scheme.eligibility.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{scheme.eligibility}</p>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Key Benefits</label>
          <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-xs font-semibold text-indigo-800 leading-relaxed">
            {Array.isArray(scheme.keyBenefits) ? (
              <ul className="list-disc pl-4 space-y-1">
                {scheme.keyBenefits.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{scheme.keyBenefits}</p>
            )}
          </div>
        </div>

        {/* Required Documents */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Required Documents</label>
          <div className="p-5 bg-amber-50/30 border border-amber-100 rounded-2xl text-xs font-semibold text-amber-800 leading-relaxed">
            {Array.isArray(scheme.requiredDocuments) ? (
              <ul className="list-disc pl-4 space-y-1">
                {scheme.requiredDocuments.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{scheme.requiredDocuments}</p>
            )}
          </div>
        </div>

        {/* URL Link Button */}
        <div className="space-y-2 pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Official Portal URL</span>
            <a 
              href={scheme.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-neutral-600 font-semibold break-all animate-fadeIn"
            >
              {scheme.applyUrl}
            </a>
          </div>
          <a 
            href={scheme.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-md"
          >
            <Globe size={14} />
            <span>Apply Portal</span>
            <ExternalLink size={12} className="opacity-80" />
          </a>
        </div>

        {/* PDF Document Section */}
        {scheme.pdfUrl && (
          <div className="space-y-2 pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">Official Scheme Document</span>
              <span className="text-xs text-neutral-600 font-bold break-all animate-fadeIn">
                {scheme.pdfName || "Scheme_Document.pdf"}
              </span>
            </div>
            <button 
              onClick={() => {
                if (!scheme.pdfUrl) return;
                const link = document.createElement('a');
                link.href = scheme.pdfUrl;
                link.target = '_blank';
                link.download = scheme.pdfName || 'Scheme_Document.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-2 px-5 h-11 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95"
            >
              <span>View/Download Document</span>
              <ExternalLink size={12} className="opacity-80" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
