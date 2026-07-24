import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { initialComplaints, initialAlerts } from '../mockData';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLoggedIn = localStorage.getItem('ward18_admin_logged_in') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const pendingComplaintsCount = initialComplaints.filter(c => c.status === 'Pending').length;
  const activeAlertsCount = initialAlerts.filter(a => a.severity === 'Critical' || a.severity === 'Warning').length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Side Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        complaintsCount={pendingComplaintsCount}
        alertsCount={activeAlertsCount}
      />

      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col pt-16 lg:pt-0 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
