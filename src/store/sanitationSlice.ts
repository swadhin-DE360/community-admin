import { createSlice } from '@reduxjs/toolkit';
import { service } from '@/shared/_services/api_service';

export interface DayScheduleItem {
  day: string;
  isOff: boolean;
  time: string;
}

export interface ScheduleChangeItem {
  _id?: string;
  id?: string;
  date: string;
  time: string;
  reason: string;
  isOff?: boolean;
}

interface SanitationState {
  weeklySchedule: DayScheduleItem[];
  scheduleChanges: ScheduleChangeItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SanitationState = {
  weeklySchedule: [
    { day: 'Sunday', isOff: false, time: '08:00 AM' },
    { day: 'Monday', isOff: false, time: '08:00 AM' },
    { day: 'Tuesday', isOff: false, time: '08:00 AM' },
    { day: 'Wednesday', isOff: false, time: '08:00 AM' },
    { day: 'Thursday', isOff: false, time: '08:00 AM' },
    { day: 'Friday', isOff: false, time: '08:00 AM' },
    { day: 'Saturday', isOff: false, time: '08:00 AM' },
  ],
  scheduleChanges: [],
  loading: false,
  error: null,
};

export const sanitationSlice = createSlice({
  name: 'sanitation',
  initialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loading = action.payload;
    },
    setSanitationData(state, action) {
      if (action.payload) {
        state.weeklySchedule = action.payload.weeklySchedule || state.weeklySchedule;
        state.scheduleChanges = (action.payload.scheduleChanges || []).map((item: any) => ({
          ...item,
          id: item._id || item.id,
        }));
      }
      state.loading = false;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoadingStatus, setSanitationData, setError } = sanitationSlice.actions;

export default sanitationSlice.reducer;

/* THUNKS */
export function fetchSanitationSchedule(wardId?: string) {
  return async function fetchSanitationScheduleThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.getSanitationSchedule(wardId);
      if (response.data) {
        dispatch(setSanitationData(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to fetch sanitation schedule', error);
    }
  };
}

export function saveWeeklySchedule(wardId: string | undefined, weeklySchedule: DayScheduleItem[]) {
  return async function saveWeeklyScheduleThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.updateWeeklySchedule(wardId, weeklySchedule);
      if (response.data) {
        dispatch(setSanitationData(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to save weekly schedule', error);
    }
  };
}

export function addScheduleChangeThunk(wardId: string | undefined, change: { date: string; time: string; reason: string }) {
  return async function addScheduleChangeThunkInner(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.addScheduleChange(wardId, change);
      if (response.data) {
        dispatch(setSanitationData(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to add schedule change', error);
    }
  };
}

export function updateScheduleChangeThunk(wardId: string | undefined, changeId: string, change: { date: string; time: string; reason: string }) {
  return async function updateScheduleChangeThunkInner(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.updateScheduleChange(wardId, changeId, change);
      if (response.data) {
        dispatch(setSanitationData(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to update schedule change', error);
    }
  };
}

export function deleteScheduleChangeThunk(wardId: string | undefined, changeId: string) {
  return async function deleteScheduleChangeThunkInner(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.deleteScheduleChange(wardId, changeId);
      if (response.data) {
        dispatch(setSanitationData(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to delete schedule change', error);
    }
  };
}
