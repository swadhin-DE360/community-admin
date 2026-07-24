import axios from "axios";
import { authHeader } from "../_helper/auth-header";

export const rootUrl = 'http://localhost:3430/api/v1/';

const authURL = rootUrl + 'admin';
const wardURL = rootUrl + 'ward';

// Auth
async function login(data: any) {
  return await axios.post(authURL + '/login', data);
}

async function getProfile() {
  return await axios.get(authURL + '/profile', {
    headers: await authHeader(''),
  });
}

// Ward APIs
async function getWards() {
  return await axios.get(wardURL + '/list');
}

async function createWard(data: { name: string; fullName?: string; wardNumber?: string; code?: string; description?: string }) {
  return await axios.post(wardURL + '/create', data);
}

async function updateWard(wardId: string, data: { name?: string; fullName?: string; wardNumber?: string; code?: string; description?: string; status?: string }) {
  return await axios.patch(`${wardURL}/update/${wardId}`, data);
}

async function deleteWard(wardId: string) {
  return await axios.delete(`${wardURL}/delete/${wardId}`);
}

// Important Contacts APIs
const importantContactsURL = rootUrl + 'important-contacts';

async function getImportantContacts(wardId?: string, search?: string, type?: string) {
  const params: any = {};
  if (wardId) params.wardId = wardId;
  if (search) params.search = search;
  if (type) params.type = type;
  return await axios.get(importantContactsURL, { params });
}

async function createImportantContact(data: any) {
  return await axios.post(importantContactsURL, data);
}

async function updateImportantContact(id: string, data: any) {
  return await axios.put(`${importantContactsURL}/${id}`, data);
}

async function deleteImportantContact(id: string) {
  return await axios.delete(`${importantContactsURL}/${id}`);
}

// Emergency Alert APIs
const emergencyAlertURL = rootUrl + 'emergency-alert';

async function getEmergencyAlerts(wardId?: string, search?: string, severity?: string) {
  const params: any = {};
  if (wardId) params.wardId = wardId;
  if (search) params.search = search;
  if (severity) params.severity = severity;
  return await axios.get(emergencyAlertURL, { params });
}

async function createEmergencyAlert(data: any) {
  return await axios.post(emergencyAlertURL, data);
}

async function updateEmergencyAlert(id: string, data: any) {
  return await axios.put(`${emergencyAlertURL}/${id}`, data);
}

async function deleteEmergencyAlert(id: string) {
  return await axios.delete(`${emergencyAlertURL}/${id}`);
}

// Sanitation APIs
const sanitationURL = rootUrl + 'sanitation';

async function getSanitationSchedule(wardId?: string) {
  return await axios.get(sanitationURL, {
    params: wardId ? { wardId } : {},
  });
}

async function updateWeeklySchedule(wardId: string | undefined, weeklySchedule: any[]) {
  return await axios.put(`${sanitationURL}/weekly-schedule`, { wardId, weeklySchedule });
}

async function addScheduleChange(wardId: string | undefined, change: { date: string; time: string; reason: string }) {
  return await axios.post(`${sanitationURL}/schedule-change`, { wardId, change });
}

async function updateScheduleChange(wardId: string | undefined, changeId: string, change: { date: string; time: string; reason: string }) {
  return await axios.put(`${sanitationURL}/schedule-change/${changeId}`, { wardId, change });
}

async function deleteScheduleChange(wardId: string | undefined, changeId: string) {
  return await axios.delete(`${sanitationURL}/schedule-change/${changeId}`, {
    params: wardId ? { wardId } : {},
  });
}

export const service = {
  login,
  getProfile,
  getWards,
  createWard,
  updateWard,
  deleteWard,
  getImportantContacts,
  createImportantContact,
  updateImportantContact,
  deleteImportantContact,
  getEmergencyAlerts,
  createEmergencyAlert,
  updateEmergencyAlert,
  deleteEmergencyAlert,
  getSanitationSchedule,
  updateWeeklySchedule,
  addScheduleChange,
  updateScheduleChange,
  deleteScheduleChange,
  // Backwards compatibility aliases
  getImportantAnnouncements: getImportantContacts,
  createImportantAnnouncement: createImportantContact,
  updateImportantAnnouncement: updateImportantContact,
  deleteImportantAnnouncement: deleteImportantContact,
};