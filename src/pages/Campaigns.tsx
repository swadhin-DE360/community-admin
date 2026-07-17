import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Search, 
  Trash2,
  Eye,
  Pencil
} from 'lucide-react';
import { initialCampaigns } from '../mockData';
import type { Campaign } from '../mockData';

// Shadcn UI Library Imports
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Campaigns() {
  const navigate = useNavigate();
  
  // Initialize state from localStorage or fallback to mock data
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('ward18_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Showing 2 items per page to demonstrate pagination

  // Delete Dialog States
  const [campaignIdToDelete, setCampaignIdToDelete] = useState<string | null>(null);

  const handleDeleteCampaign = (id: string) => {
    const updatedList = campaigns.filter(c => c.id !== id);
    setCampaigns(updatedList);
    localStorage.setItem('ward18_campaigns', JSON.stringify(updatedList));
  };

  const getTypeStyles = (cType: Campaign['type']) => {
    switch (cType) {
      case 'Cleanliness':
        return {
          theme: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        };
      case 'Health Screening':
        return {
          theme: 'bg-red-50 text-red-700 border-red-200/60',
        };
      case 'Awareness':
        return {
          theme: 'bg-blue-50 text-blue-700 border-blue-200/60',
        };
      default:
        return {
          theme: 'bg-neutral-50 text-neutral-700 border-neutral-200/60',
        };
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredCampaigns = campaigns
    .filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;
      
      let matchesDateRange = true;
      if (startDate) {
        matchesDateRange = matchesDateRange && c.date >= startDate;
      }
      if (endDate) {
        matchesDateRange = matchesDateRange && c.date <= endDate;
      }
      
      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Calendar className="text-primary w-6 h-6" />
            Ward Campaigns & Drives
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Browse and manage environmental cleanliness drives, public health camps, and civic awareness drives scheduled in Ward 18.
          </p>
        </div>
        <button
          onClick={() => navigate('/campaign/new')}
          className="flex-shrink-0 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          Add / Create Drive
        </button>
      </div>

      {/* Table Actions / Search (Shadcn style) */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" size={15} />
            <Input 
              type="text" 
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 font-medium text-xs rounded-xl h-9"
            />
          </div>

          {/* Category Filter Select */}
          <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val ?? 'All'); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 text-xs font-semibold text-neutral-700 rounded-xl min-w-[145px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Cleanliness">Cleanliness</SelectItem>
              <SelectItem value="Health Screening">Health Screening</SelectItem>
              <SelectItem value="Awareness">Awareness</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-50/50 px-2.5 py-1.5 rounded-xl border border-neutral-200/50">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">From</span>
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="h-8 w-[120px] font-semibold text-xs rounded-lg text-neutral-700 bg-white border-neutral-200"
            />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">To</span>
            <Input 
              type="date" 
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="h-8 w-[120px] font-semibold text-xs rounded-lg text-neutral-700 bg-white border-neutral-200"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider pl-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
          Showing {Math.min(startIndex + 1, filteredCampaigns.length)} to {Math.min(startIndex + itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
        </div>
      </div>

      {/* Shadcn UI Styled Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200">
              <TableHead className="p-4 w-[120px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign ID</TableHead>
              <TableHead className="p-4 w-[220px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Title / Type</TableHead>
              <TableHead className="p-4 w-[140px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Schedule</TableHead>
              <TableHead className="p-4 w-[180px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Venue</TableHead>
              <TableHead className="p-4 w-[160px] text-xs font-semibold text-neutral-500 uppercase tracking-wider">Organizer</TableHead>
              <TableHead className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description</TableHead>
              <TableHead className="p-4 w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
            {paginatedCampaigns.length > 0 ? (
              paginatedCampaigns.map((c) => {
                const style = getTypeStyles(c.type);
                return (
                  <TableRow 
                    key={c.id} 
                    className="hover:bg-neutral-50/40 transition-colors border-b border-neutral-100"
                  >
                    {/* ID */}
                    <TableCell className="p-4 font-bold text-neutral-800">
                      {c.id}
                    </TableCell>
                    {/* Title & Type */}
                    <TableCell className="p-4">
                      <div className="flex flex-col gap-1.5 max-w-[220px] whitespace-normal">
                        <span className="font-bold text-neutral-800 text-sm leading-snug">{c.title}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold w-fit border ${style.theme}`}>
                          {c.type}
                        </span>
                      </div>
                    </TableCell>
                    {/* Schedule */}
                    <TableCell className="p-4 text-neutral-500">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-neutral-700">{c.date}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">{c.time}</span>
                      </div>
                    </TableCell>
                    {/* Venue */}
                    <TableCell className="p-4 font-semibold text-neutral-800 max-w-[150px] truncate" title={c.venue}>
                      {c.venue}
                    </TableCell>
                    {/* Organizer */}
                    <TableCell className="p-4 text-neutral-600 max-w-[160px] truncate" title={c.organizer}>
                      {c.organizer}
                    </TableCell>
                    {/* Description */}
                    <TableCell className="p-4 text-neutral-400 italic font-medium max-w-[280px] truncate" title={c.description}>
                      "{c.description}"
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/campaign/details/${c.id}`)}
                          className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/campaign/edit/${c.id}`)}
                          className="text-neutral-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Campaign"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setCampaignIdToDelete(c.id)}
                          className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-neutral-400 font-medium">
                  No campaigns found matching your query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Shadcn UI Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 p-4 bg-neutral-50/40">
            <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Page {activePage} of {totalPages}
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                {/* Previous Button */}
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

                {/* Page Number Buttons */}
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

                {/* Next Button */}
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

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!campaignIdToDelete} onOpenChange={(open) => { if (!open) setCampaignIdToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign drive and remove it from our active planner database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCampaignIdToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive"
              onClick={() => {
                if (campaignIdToDelete) {
                  handleDeleteCampaign(campaignIdToDelete);
                  setCampaignIdToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
