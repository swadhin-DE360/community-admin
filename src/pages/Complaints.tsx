import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';

export default function Complaints() {
  const navigate = useNavigate();

  // Load complaints from localStorage or fallback to initialComplaints
  const [complaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('ward18_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });



  // Sync state if localStorage changes elsewhere
  useEffect(() => {
    const saved = localStorage.getItem('ward18_complaints');
    if (!saved) {
      localStorage.setItem('ward18_complaints', JSON.stringify(initialComplaints));
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Extract unique categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(complaints.map(c => c.category)))];

  // Filter complaints list
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.residentName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleRowClick = (complaint: Complaint) => {
    navigate(`/complaints/details/${complaint.id}`);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 relative">
      
      {/* Search & Filters Section */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Complaints Management Control</h1>
            <p className="text-neutral-500 text-sm mt-1">Review, assign, and resolve resident complaints in real-time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={17} />
            <input 
              type="text" 
              placeholder="Search ID, Title or Citizen..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400 font-semibold"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-400 flex-shrink-0" />
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val ?? 'All'); setCurrentPage(1); }}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-400 flex-shrink-0" />
            <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val ?? 'All'); setCurrentPage(1); }}>
              <SelectTrigger className="w-full h-9 text-xs font-semibold text-neutral-700 rounded-xl bg-neutral-50 border-neutral-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Records Counter */}
          <div className="flex items-center justify-end text-xs font-semibold text-neutral-500 self-center">
            Showing {Math.min(startIndex + 1, filteredComplaints.length)} to {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200">
              <TableHead className="p-4 w-[130px] text-xs font-bold text-neutral-500 uppercase tracking-wider">Complaint ID</TableHead>
              <TableHead className="p-4 w-[160px] text-xs font-bold text-neutral-500 uppercase tracking-wider">Title / Category</TableHead>
              <TableHead className="p-4 w-[160px] text-xs font-bold text-neutral-500 uppercase tracking-wider">Date Filed</TableHead>
              <TableHead className="p-4 w-[160px] text-xs font-bold text-neutral-500 uppercase tracking-wider">Citizen</TableHead>
              <TableHead className="p-4 w-[140px] text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="p-4 w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 text-xs font-semibold text-neutral-700">
            {paginatedComplaints.length > 0 ? (
              paginatedComplaints.map((c) => (
                <TableRow 
                  key={c.id} 
                  onClick={() => handleRowClick(c)}
                  className="hover:bg-neutral-50/40 cursor-pointer transition-colors border-b border-neutral-100 group"
                >
                  {/* ID */}
                  <TableCell className="p-4 font-bold text-neutral-700 group-hover:text-primary transition-colors">
                    {c.id}
                  </TableCell>
                  {/* Title & Category */}
                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-charcoal line-clamp-1">{c.title}</span>
                      <span className="text-xs text-neutral-400 font-semibold mt-0.5">{c.category}</span>
                    </div>
                  </TableCell>
                  {/* Date */}
                  <TableCell className="p-4 text-neutral-500 text-xs font-semibold">
                    {c.dateFiled}
                  </TableCell>
                  {/* Citizen */}
                  <TableCell className="p-4 text-neutral-600 font-semibold">
                    {c.residentName}
                  </TableCell>
                  {/* Status Pill */}
                  <TableCell className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === 'Pending' 
                        ? 'bg-amber-100 text-amber-800' 
                        : c.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.status === 'Pending' 
                          ? 'bg-amber-500' 
                          : c.status === 'In Progress' 
                          ? 'bg-blue-500' 
                          : 'bg-emerald-500'
                      }`}></span>
                      {c.status}
                    </span>
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(c);
                      }}
                      className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="View Complaint Details"
                    >
                      <Eye size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-neutral-400 font-medium">
                  No complaints found matching the filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
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
