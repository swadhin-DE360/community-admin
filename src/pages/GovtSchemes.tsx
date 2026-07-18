import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash, 
  Edit,
  Eye
} from 'lucide-react';
import { initialSchemes } from '../mockData';
import type { CitizenScheme } from '../mockData';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function GovtSchemes() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<CitizenScheme[]>(() => {
    const saved = localStorage.getItem('ward18_schemes');
    if (saved) {
      const parsed: CitizenScheme[] = JSON.parse(saved);
      let updated = false;
      const verified = parsed.map(s => {
        let needsUpdate = false;
        const match = initialSchemes.find(i => i.id === s.id);
        
        let sOverview = s.overview;
        if (!sOverview) {
          // @ts-ignore
          sOverview = s.description || (match ? match.overview : '');
          needsUpdate = true;
        }

        let sCategory = s.category;
        if (!sCategory) {
          sCategory = match ? match.category : 'General';
          needsUpdate = true;
        }

        let sKeyBenefits = s.keyBenefits;
        if (!sKeyBenefits || !Array.isArray(sKeyBenefits)) {
          sKeyBenefits = match ? match.keyBenefits : [];
          needsUpdate = true;
        }

        let sEligibility = s.eligibility;
        if (!sEligibility || !Array.isArray(sEligibility)) {
          if (match && Array.isArray(match.eligibility)) {
            sEligibility = match.eligibility;
          } else {
            // @ts-ignore
            sEligibility = sEligibility ? [String(sEligibility)] : [];
          }
          needsUpdate = true;
        }

        let sRequiredDocs = s.requiredDocuments;
        if (!sRequiredDocs || !Array.isArray(sRequiredDocs)) {
          sRequiredDocs = match ? match.requiredDocuments : [];
          needsUpdate = true;
        }

        if (needsUpdate) {
          updated = true;
          return {
            ...s,
            category: sCategory,
            keyBenefits: sKeyBenefits,
            eligibility: sEligibility,
            requiredDocuments: sRequiredDocs,
            overview: sOverview
          };
        }
        return s;
      });
      if (updated) {
        localStorage.setItem('ward18_schemes', JSON.stringify(verified));
      }
      return verified;
    }
    localStorage.setItem('ward18_schemes', JSON.stringify(initialSchemes));
    return initialSchemes;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDeleteScheme = (id: string) => {
    const updated = schemes.filter(s => s.id !== id);
    setSchemes(updated);
    localStorage.setItem('ward18_schemes', JSON.stringify(updated));
    
    // Auto-adjust page if current page becomes empty
    const newTotalPages = Math.ceil(updated.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Filter schemes
  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.overview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedSchemes = filteredSchemes.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
            <input 
              type="text" 
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400 font-medium text-neutral-700"
            />
          </div>

          {/* Category Select Filter */}
          <div className="w-full sm:w-44">
            <Select 
              value={selectedCategory} 
              onValueChange={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full h-8 text-[11px] font-bold text-neutral-600 rounded-xl bg-neutral-50 border-neutral-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-neutral-200 shadow-lg rounded-xl">
                <SelectItem value="All">All Categories</SelectItem>
                {Array.from(new Set(schemes.map(s => s.category).filter(Boolean))).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          onClick={() => navigate('/govt-schemes/new')}
          className="w-full sm:w-auto py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-emerald-500/10 transition-colors text-xs font-extrabold flex items-center justify-center gap-1.5"
        >
          <Plus size={14} />
          Add Scheme
        </button>
      </div>

      {/* Schemes Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden animate-fadeIn flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 border-b border-neutral-200 hover:bg-neutral-50/80">
              <TableHead className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest w-[15%] h-auto">ID</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest w-[45%] h-auto">Scheme Name</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest w-[20%] h-auto">Category</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest w-[20%] text-right h-auto pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100">
            {paginatedSchemes.length > 0 ? (
              paginatedSchemes.map((s) => (
                <TableRow key={s.id} className="hover:bg-neutral-50/30 transition-colors">
                  
                  {/* ID */}
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-500/10 px-2 py-0.5 rounded-lg w-fit font-mono">
                      <span>{s.id}</span>
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="px-6 py-4 align-middle whitespace-normal">
                    <h4 className="font-extrabold text-sm text-charcoal leading-snug">{s.name}</h4>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-6 py-4 align-middle">
                    <span className="inline-flex items-center bg-neutral-50 text-neutral-600 border border-neutral-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xxs">
                      {s.category}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 align-middle text-right pr-6">
                    <div className="flex items-center justify-end gap-3.5">
                      <button 
                        onClick={() => navigate(`/govt-schemes/${s.id}`)}
                        className="text-neutral-400 hover:text-primary p-1.5 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>

                      <button 
                        onClick={() => navigate(`/govt-schemes/edit/${s.id}`)}
                        className="text-neutral-400 hover:text-primary p-1.5 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200"
                        title="Edit Scheme"
                      >
                        <Edit size={14} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center border border-transparent hover:border-neutral-200"
                            title="Delete Scheme"
                          >
                            <Trash size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border border-neutral-200 shadow-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm font-bold text-neutral-800">Delete Welfare Scheme</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs text-neutral-500">
                              Are you sure you want to delete "{s.name}"? This action cannot be undone and will remove the scheme from the public directory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel className="text-xs font-semibold rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteScheme(s.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                            >
                              Delete Scheme
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-neutral-400 font-semibold text-xs">
                  No government welfare schemes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 p-4 bg-neutral-50/40">
            <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Page {activePage} of {totalPages}
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activePage > 1) setCurrentPage(activePage - 1);
                    }}
                    className={activePage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={activePage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className="cursor-pointer font-extrabold"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activePage < totalPages) setCurrentPage(activePage + 1);
                    }}
                    className={activePage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
