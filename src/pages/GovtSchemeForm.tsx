import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initialSchemes } from '../mockData';
import type { CitizenScheme } from '../mockData';

const DEFAULT_CATEGORIES = ["Financial", "Housing", "Electricity"];

export default function GovtSchemeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  // Form fields state
  const [name, setName] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [eligibilityList, setEligibilityList] = useState<string[]>([]);
  const [keyBenefitsList, setKeyBenefitsList] = useState<string[]>([]);
  const [requiredDocumentsList, setRequiredDocumentsList] = useState<string[]>([]);
  const [overview, setOverview] = useState('');

  // Category select state
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [categorySelect, setCategorySelect] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Local inputs state for adding tags
  const [eligibilityInput, setEligibilityInput] = useState('');
  const [keyBenefitsInput, setKeyBenefitsInput] = useState('');
  const [requiredDocumentsInput, setRequiredDocumentsInput] = useState('');

  // Load existing categories & edit data
  useEffect(() => {
    const saved = localStorage.getItem('ward18_schemes');
    const list: CitizenScheme[] = saved ? JSON.parse(saved) : initialSchemes;
    const activeCats = list.map(s => s.category).filter(Boolean);
    const combinedCats = Array.from(new Set([...DEFAULT_CATEGORIES, ...activeCats]));
    setExistingCategories(combinedCats);

    if (isEdit) {
      const existing = list.find(s => s.id === id);
      if (existing) {
        setName(existing.name);
        setApplyUrl(existing.applyUrl);
        setEligibilityList(Array.isArray(existing.eligibility) ? existing.eligibility : [existing.eligibility]);
        setKeyBenefitsList(Array.isArray(existing.keyBenefits) ? existing.keyBenefits : [existing.keyBenefits]);
        setRequiredDocumentsList(Array.isArray(existing.requiredDocuments) ? existing.requiredDocuments : [existing.requiredDocuments].filter(Boolean));
        setOverview(existing.overview || '');
        
        const schemeCategory = existing.category || '';
        setCategorySelect(schemeCategory);
      } else {
        navigate('/govt-schemes');
      }
    }
  }, [id, isEdit, navigate]);

  // Eligibility dynamic tag additions/deletions
  const addEligibilityTag = () => {
    if (eligibilityInput.trim() && !eligibilityList.includes(eligibilityInput.trim())) {
      setEligibilityList([...eligibilityList, eligibilityInput.trim()]);
      setEligibilityInput('');
    }
  };

  const removeEligibilityTag = (tagToRemove: string) => {
    setEligibilityList(eligibilityList.filter(t => t !== tagToRemove));
  };

  // Key Benefits dynamic tag additions/deletions
  const addKeyBenefitsTag = () => {
    if (keyBenefitsInput.trim() && !keyBenefitsList.includes(keyBenefitsInput.trim())) {
      setKeyBenefitsList([...keyBenefitsList, keyBenefitsInput.trim()]);
      setKeyBenefitsInput('');
    }
  };

  const removeKeyBenefitsTag = (tagToRemove: string) => {
    setKeyBenefitsList(keyBenefitsList.filter(t => t !== tagToRemove));
  };

  // Required Documents dynamic tag additions/deletions
  const addRequiredDocumentsTag = () => {
    if (requiredDocumentsInput.trim() && !requiredDocumentsList.includes(requiredDocumentsInput.trim())) {
      setRequiredDocumentsList([...requiredDocumentsList, requiredDocumentsInput.trim()]);
      setRequiredDocumentsInput('');
    }
  };

  const removeRequiredDocumentsTag = (tagToRemove: string) => {
    setRequiredDocumentsList(requiredDocumentsList.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent, addFn: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFn();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-commit any remaining text in inputs on submit
    let finalEligibility = [...eligibilityList];
    if (eligibilityInput.trim() && !finalEligibility.includes(eligibilityInput.trim())) {
      finalEligibility.push(eligibilityInput.trim());
    }

    let finalKeyBenefits = [...keyBenefitsList];
    if (keyBenefitsInput.trim() && !finalKeyBenefits.includes(keyBenefitsInput.trim())) {
      finalKeyBenefits.push(keyBenefitsInput.trim());
    }

    let finalRequiredDocuments = [...requiredDocumentsList];
    if (requiredDocumentsInput.trim() && !finalRequiredDocuments.includes(requiredDocumentsInput.trim())) {
      finalRequiredDocuments.push(requiredDocumentsInput.trim());
    }

    const cleanEligibility = finalEligibility.filter(Boolean);
    const cleanKeyBenefits = finalKeyBenefits.filter(Boolean);
    const cleanRequiredDocuments = finalRequiredDocuments.filter(Boolean);
    
    let activeCategory = categorySelect.trim();
    if (isAddingNewCategory && newCategoryInput.trim()) {
      activeCategory = newCategoryInput.trim();
    }

    if (!name.trim() || !activeCategory || !applyUrl.trim() || cleanEligibility.length === 0 || cleanKeyBenefits.length === 0 || cleanRequiredDocuments.length === 0) return;

    const saved = localStorage.getItem('ward18_schemes');
    const list: CitizenScheme[] = saved ? JSON.parse(saved) : initialSchemes;

    const formattedUrl = applyUrl.trim().startsWith('http') ? applyUrl.trim() : `https://${applyUrl.trim()}`;

    if (isEdit) {
      const updatedScheme: CitizenScheme = {
        id: id!,
        name: name.trim(),
        category: activeCategory,
        applyUrl: formattedUrl,
        eligibility: cleanEligibility,
        keyBenefits: cleanKeyBenefits,
        requiredDocuments: cleanRequiredDocuments,
        overview: overview.trim() || "No additional description provided.",
      };
      const updatedList = list.map(s => s.id === id ? updatedScheme : s);
      localStorage.setItem('ward18_schemes', JSON.stringify(updatedList));
    } else {
      const newScheme: CitizenScheme = {
        id: `SCHEME-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        category: activeCategory,
        applyUrl: formattedUrl,
        eligibility: cleanEligibility,
        keyBenefits: cleanKeyBenefits,
        requiredDocuments: cleanRequiredDocuments,
        overview: overview.trim() || "No additional description provided.",
      };
      const updatedList = [newScheme, ...list];
      localStorage.setItem('ward18_schemes', JSON.stringify(updatedList));
    }

    navigate('/govt-schemes');
  };

  return (
    <div className="space-y-6 mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-50 via-neutral-100/35 to-neutral-50 p-6 rounded-3xl border border-neutral-200/70 shadow-xs flex items-center gap-4">
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
            {isEdit && (
              <span className="px-2 py-0 rounded-lg text-[9px] font-bold bg-neutral-200/60 text-neutral-600 border border-neutral-300/40 font-mono">
                {id}
              </span>
            )}
          </div>
          <h1 className="text-xl font-black text-neutral-800 mt-1 tracking-tight">
            {isEdit ? "Modify Welfare Scheme" : "Publish Government Scheme"}
          </h1>
        </div>
      </div>

      {/* Form Container Card */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
          <Building2 className="text-primary w-5 h-5" />
          <h3 className="font-extrabold text-sm text-charcoal tracking-tight">Scheme Specifications</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Name and Category Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-neutral-600 block">Scheme Name</label>
              <Input 
                type="text" 
                placeholder="e.g. Solar Rooftop Subvention"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-600 block">Category</label>
              
              {!isAddingNewCategory ? (
                <div className="space-y-1">
                  <Select value={categorySelect} onValueChange={(val) => setCategorySelect(val ?? '')}>
                    <SelectTrigger className="w-full h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-neutral-200 shadow-lg rounded-xl">
                      {existingCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(true);
                      setCategorySelect('');
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 mt-1 pl-1"
                  >
                    <Plus size={12} />
                    <span>Create New Category</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Category name..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      className="flex-1 h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryInput.trim()) {
                          const newCat = newCategoryInput.trim();
                          if (!existingCategories.includes(newCat)) {
                            setExistingCategories([...existingCategories, newCat]);
                          }
                          setCategorySelect(newCat);
                          setIsAddingNewCategory(false);
                          setNewCategoryInput('');
                        }
                      }}
                      className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95"
                      title="Add category"
                    >
                      Add
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategoryInput('');
                    }}
                    className="text-[11px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors block pl-1"
                  >
                    Back to Select list
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Official Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-600 block">Official Link</label>
            <Input 
              type="text" 
              placeholder="e.g. www.schemeportal.gov.in"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              className="w-full h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Row 3: Eligibility Criteria (Tag Input Style) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-600 block">Eligibility Criteria</label>
            
            {/* Tag Pills Container */}
            {eligibilityList.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border border-neutral-100 bg-neutral-50/50 rounded-2xl">
                {eligibilityList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 border border-neutral-200/50 rounded-xl text-xs font-bold text-neutral-700 animate-fadeIn"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeEligibilityTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input Field */}
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Add eligibility criteria"
                value={eligibilityInput}
                onChange={(e) => setEligibilityInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addEligibilityTag)}
                className="flex-1 h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={addEligibilityTag}
                className="px-3 h-10 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all active:scale-95 shadow-sm"
                title="Add tag"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Row 4: Key Benefits (Tag Input Style) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-600 block">Key Benefits</label>
            
            {/* Tag Pills Container */}
            {keyBenefitsList.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border border-neutral-100 bg-neutral-50/50 rounded-2xl">
                {keyBenefitsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 border border-neutral-200/50 rounded-xl text-xs font-bold text-neutral-700 animate-fadeIn"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyBenefitsTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input Field */}
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Add key benefits"
                value={keyBenefitsInput}
                onChange={(e) => setKeyBenefitsInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addKeyBenefitsTag)}
                className="flex-1 h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={addKeyBenefitsTag}
                className="px-3 h-10 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all active:scale-95 shadow-sm"
                title="Add tag"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Row 5: Required Documents (Tag Input Style) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-600 block">Required Documents</label>
            
            {/* Tag Pills Container */}
            {requiredDocumentsList.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border border-neutral-100 bg-neutral-50/50 rounded-2xl">
                {requiredDocumentsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 border border-neutral-200/50 rounded-xl text-xs font-bold text-neutral-700 animate-fadeIn"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeRequiredDocumentsTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input Field */}
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Add required document (e.g. Aadhaar Card, Income Certificate)"
                value={requiredDocumentsInput}
                onChange={(e) => setRequiredDocumentsInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addRequiredDocumentsTag)}
                className="flex-1 h-10 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={addRequiredDocumentsTag}
                className="px-3 h-10 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all active:scale-95 shadow-sm"
                title="Add tag"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Row 6: Scheme Overview (full width textarea) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-600 block">Scheme Overview</label>
            <textarea 
              placeholder="Detailed description outlining the benefits, scopes, and distributions of the scheme..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-700 placeholder:text-neutral-400 font-semibold"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/govt-schemes')}
              className="px-5 h-11 text-xs font-bold rounded-xl border-neutral-200 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 h-11 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl shadow-md text-xs font-black tracking-wide transition-all active:scale-[0.99] border-t border-emerald-400/20"
            >
              {isEdit ? "Update Scheme" : "Publish Scheme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
