import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Overview />
      },
      {
        path: 'sanitation',
        element: <Sanitition />
      },
      {
        path: 'campaign',
        element: <Campaigns />
      },
      {
        path: 'campaign/new',
        element: <CampaignForm />
      },
      {
        path: 'campaign/edit/:id',
        element: <CampaignForm />
      },
      {
        path: 'campaign/details/:id',
        element: <CampaignDetails />
      },
      {
        path: 'citizens',
        element: <Citizens />
      },
      {
        path: 'staff',
        element: <Staff />
      },
      {
        path: 'complaints',
        element: <Complaints />
      },
      {
        path: 'complaints/:id',
        element: <ComplaintDetails />
      },
      {
        path: 'govt-schemes',
        element: <GovtSchemes />
      },
      {
        path: 'govt-schemes/new',
        element: <GovtSchemeForm />
      },
      {
        path: 'govt-schemes/edit/:id',
        element: <GovtSchemeForm />
      },
      {
        path: 'govt-schemes/:id',
        element: <GovtSchemeDetails />
      },
      {
        path: 'important-contacts',
        element: <ImportantContacts />
      },
      {
        path: 'emergency-alert',
        element: <Emergency />
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
