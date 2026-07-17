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
import ImportantContacts from './pages/ImportantContacts';
import Megaphone from './pages/Megaphone';

const router = createBrowserRouter([
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
        path: 'sanitition',
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
        path: 'complaints',
        element: <Complaints />
      },
      {
        path: 'complaints/details/:id',
        element: <ComplaintDetails />
      },
      {
        path: 'govt-schemes',
        element: <GovtSchemes />
      },
      {
        path: 'important-contacts',
        element: <ImportantContacts />
      },
      {
        path: 'emergency-alert',
        element: <Megaphone />
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
