import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Menu, 
  X,
  Truck,
  Users,
  Building2,
  Contact
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  complaintsCount: number;
  alertsCount: number;
}

export default function Sidebar({ 
  isOpen, 
  setIsOpen,
  complaintsCount,
  alertsCount
}: SidebarProps) {
  
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      path: '/sanitition', 
      label: 'Sanitition', 
      icon: Truck,
      badge: null
    },
    { 
      path: '/campaign', 
      label: 'campaign', 
      icon: Calendar,
      badge: null
    },
    { 
      path: '/citizens', 
      label: 'Citizens', 
      icon: Users,
      badge: null
    },
    { 
      path: '/complaints', 
      label: 'Complaints', 
      icon: FileText,
      badge: complaintsCount > 0 ? complaintsCount : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    { 
      path: '/govt-schemes', 
      label: 'Govt Schemes', 
      icon: Building2,
      badge: null
    },
    { 
      path: '/important-contacts', 
      label: 'Imortant contacts', 
      icon: Contact,
      badge: null
    },
    { 
      path: '/emergency-alert', 
      label: 'Emergency alert', 
      icon: Megaphone,
      badge: alertsCount > 0 ? alertsCount : null,
      badgeColor: 'bg-red-500 text-white'
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md border border-neutral-200 text-neutral-800 lg:hidden hover:bg-neutral-50 transition-colors focus:outline-none"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-35 flex flex-col bg-white text-neutral-800 border-r border-neutral-200 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            {isOpen && (
              <div className="flex flex-col select-none">
                <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">WARD 18</span>
                <span className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase">Admin Panel</span>
              </div>
            )}
          </div>
          
          {/* Collapse Arrow Toggle (Desktop only) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1.5 rounded-lg bg-neutral-100 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false); // Auto close mobile
                }}
                className={({ isActive }) => `w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 font-medium group text-sm relative ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-emerald-700/20' 
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-white" />
                    )}
                    
                    <Icon 
                      size={19} 
                      className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'
                      }`} 
                    />
                    
                    {isOpen && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {/* Collapsed Hover Tooltip (Desktop only) */}
                    {!isOpen && (
                      <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left duration-200 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        {item.badge !== null && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-primary rounded-full text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-neutral-100 text-center overflow-hidden">
          {isOpen ? (
            <p className="text-[10px] text-neutral-400 font-medium">© 2026 Ward 18 BBMP</p>
          ) : (
            <span className="text-[10px] text-neutral-400 font-semibold">W18</span>
          )}
        </div>
      </aside>
    </>
  );
}
