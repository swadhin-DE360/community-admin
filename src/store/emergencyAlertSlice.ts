import { createSlice } from '@reduxjs/toolkit';
import { service } from '@/shared/_services/api_service';

export interface EmergencyAlertItem {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  datePublished?: string;
  wardId?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface EmergencyAlertState {
  alerts: EmergencyAlertItem[];
  loading: boolean;
  error: string | null;
}

const initialState: EmergencyAlertState = {
  alerts: [],
  loading: false,
  error: null,
};

export const emergencyAlertSlice = createSlice({
  name: 'emergencyAlert',
  initialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loading = action.payload;
    },
    setAlerts(state, action) {
      const list = (action.payload || []).map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
      state.alerts = list;
      state.loading = false;
      state.error = null;
    },
    addAlertSuccess(state, action) {
      const newItem = {
        ...action.payload,
        id: action.payload._id || action.payload.id,
      };
      state.alerts.unshift(newItem);
      state.loading = false;
    },
    updateAlertSuccess(state, action) {
      const updatedId = action.payload._id || action.payload.id;
      const index = state.alerts.findIndex((item) => (item._id || item.id) === updatedId);
      if (index !== -1) {
        state.alerts[index] = {
          ...action.payload,
          id: updatedId,
        };
      }
      state.loading = false;
    },
    deleteAlertSuccess(state, action) {
      const idToDelete = action.payload;
      state.alerts = state.alerts.filter((item) => (item._id || item.id) !== idToDelete);
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoadingStatus,
  setAlerts,
  addAlertSuccess,
  updateAlertSuccess,
  deleteAlertSuccess,
  setError,
} = emergencyAlertSlice.actions;

export default emergencyAlertSlice.reducer;

/* THUNKS */
export function fetchEmergencyAlerts(wardId?: string, search?: string, severity?: string) {
  return async function fetchEmergencyAlertsThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.getEmergencyAlerts(wardId, search, severity);
      if (response.data) {
        dispatch(setAlerts(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to fetch emergency alerts', error);
    }
  };
}

export function createEmergencyAlert(data: Partial<EmergencyAlertItem>) {
  return async function createEmergencyAlertThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.createEmergencyAlert(data);
      if (response.data) {
        dispatch(addAlertSuccess(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to create emergency alert', error);
    }
  };
}

export function updateEmergencyAlert(payload: { id: string; data: Partial<EmergencyAlertItem> }) {
  return async function updateEmergencyAlertThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.updateEmergencyAlert(payload.id, payload.data);
      if (response.data) {
        dispatch(updateAlertSuccess(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to update emergency alert', error);
    }
  };
}

export function deleteEmergencyAlert(id: string) {
  return async function deleteEmergencyAlertThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      await service.deleteEmergencyAlert(id);
      dispatch(deleteAlertSuccess(id));
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to delete emergency alert', error);
    }
  };
}
