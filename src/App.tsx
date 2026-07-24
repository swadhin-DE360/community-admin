import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Overview from './pages/Overview';
import Sanitition from './pages/Sanitition';
import Campaigns from './pages/Campaigns';
import CampaignForm from './pages/CampaignForm';
import CampaignDetails from './pages/CampaignDetails';
import Citizens from './pages/Citizens';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';
import GovtSchemes from './pages/GovtSchemes';
import GovtSchemeForm from './pages/GovtSchemeForm';
import GovtSchemeDetails from './pages/GovtSchemeDetails';
import ImportantContacts from './pages/ImportantContacts';
import Emergency from './pages/Emergency';
import Staff from './pages/Staff';
import LatestAnnouncements from './pages/LatestAnnouncements';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/authSlice';
import { fetchImportantContacts } from './store/importantContactsSlice';
import { fetchEmergencyAlerts } from './store/emergencyAlertSlice';
import { fetchSanitationSchedule } from './store/sanitationSlice';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const { selectedWardId } = useSelector((state: any) => state.ward);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile() as any);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchImportantContacts(selectedWardId) as any);
      dispatch(fetchEmergencyAlerts(selectedWardId) as any);
      dispatch(fetchSanitationSchedule(selectedWardId) as any);
    }
  }, [dispatch, isAuthenticated, selectedWardId]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Overview />} />
        <Route path="sanitation" element={<Sanitition />} />
        <Route path="latest-announcements" element={<LatestAnnouncements />} />
        <Route path="campaign" element={<Campaigns />} />
        <Route path="campaign/new" element={<CampaignForm />} />
        <Route path="campaign/edit/:id" element={<CampaignForm />} />
        <Route path="campaign/details/:id" element={<CampaignDetails />} />
        <Route path="citizens" element={<Citizens />} />
        <Route path="staff" element={<Staff />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
        <Route path="govt-schemes" element={<GovtSchemes />} />
        <Route path="govt-schemes/new" element={<GovtSchemeForm />} />
        <Route path="govt-schemes/edit/:id" element={<GovtSchemeForm />} />
        <Route path="govt-schemes/:id" element={<GovtSchemeDetails />} />
        <Route path="important-contacts" element={<ImportantContacts />} />
        <Route path="emergency-alert" element={<Emergency />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
