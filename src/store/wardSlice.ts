import { createSlice } from '@reduxjs/toolkit';
import { service } from '@/shared/_services/api_service';

export interface WardItem {
  _id?: string;
  id?: string;
  name: string;
  fullName: string;
  wardNumber?: string;
  code?: string;
  description?: string;
  status?: string;
}

interface WardState {
  wards: WardItem[];
  selectedWardId: string;
  loading: boolean;
  error: string | null;
}



const initialState: WardState = {
  wards: [],
  selectedWardId: localStorage.getItem('selected_ward_id') ,
  loading: false,
  error: null,
};

export const wardSlice = createSlice({
  name: 'ward',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSelectedWardId(state, action) {
      state.selectedWardId = action.payload;
      localStorage.setItem('selected_ward_id', action.payload);
    },
    setWards(state, action) {
      const fetchedWards = action.payload.map((item) => ({
        ...item,
        id: item._id || item.id,
      }));
      state.wards = fetchedWards.length > 0 ? fetchedWards : state.wards;
      state.loading = false;
      state.error = null;
    },
    addWardSuccess(state, action) {
      const newWard = {
        ...action.payload,
        id: action.payload._id || action.payload.id || `ward-${Date.now()}`,
      };
      state.wards.unshift(newWard);
      state.selectedWardId = newWard.id;
      localStorage.setItem('selected_ward_id', newWard.id);
      state.loading = false;
    },
    updateWardSuccess(state, action) {
      const updatedId = action.payload._id || action.payload.id;
      const index = state.wards.findIndex((w) => (w._id || w.id) === updatedId);
      if (index !== -1) {
        state.wards[index] = {
          ...action.payload,
          id: updatedId,
        };
      }
      state.loading = false;
    },
    deleteWardSuccess(state, action) {
      const idToDelete = action.payload;
      state.wards = state.wards.filter((w) => (w._id || w.id) !== idToDelete);
      if (state.selectedWardId === idToDelete && state.wards.length > 0) {
        const fallbackId = state.wards[0]._id || state.wards[0].id || '';
        state.selectedWardId = fallbackId;
        localStorage.setItem('selected_ward_id', fallbackId);
      }
      state.loading = false;
    },
    setWardError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setSelectedWardId,
  setWards,
  addWardSuccess,
  updateWardSuccess,
  deleteWardSuccess,
  setWardError,
} = wardSlice.actions;

export default wardSlice.reducer;

/* THUNKS */
export function fetchWards() {
  return async function fetchWardsThunk(dispatch: any) {
    dispatch(setLoading(true));
    try {
      const response = await service.getWards();
      if (response.data && Array.isArray(response.data)) {
        dispatch(setWards(response.data));
      } else {
        dispatch(setLoading(false));
      }
    } catch (err: any) {
      console.error('Failed to fetch wards from API, using default wards', err);
      dispatch(setLoading(false));
    }
  };
}

export function createWardThunk(data: { name: string; fullName?: string }) {
  return async function addWardThunk(dispatch: any) {
    dispatch(setLoading(true));
    try {
      const response = await service.createWard(data);
      if (response.data) {
        dispatch(addWardSuccess(response.data));
      }
    } catch (err: any) {
      // Fallback for offline/local simulation
      const fallbackWard: WardItem = {
        id: `ward-${Date.now()}`,
        name: data.name,
        fullName: data.fullName || data.name,
      };
      dispatch(addWardSuccess(fallbackWard));
    }
  };
}

export function updateWardThunk(wardId: string, data: { name?: string; fullName?: string }) {
  return async function editWardThunk(dispatch: any) {
    dispatch(setLoading(true));
    try {
      const response = await service.updateWard(wardId, data);
      if (response.data) {
        dispatch(updateWardSuccess(response.data));
      }
    } catch (err: any) {
      // Fallback update for local item
      dispatch(
        updateWardSuccess({
          id: wardId,
          _id: wardId,
          name: data.name || '',
          fullName: data.fullName || data.name || '',
        })
      );
    }
  };
}

export function deleteWardThunk(wardId: string) {
  return async function removeWardThunk(dispatch: any) {
    dispatch(setLoading(true));
    try {
      await service.deleteWard(wardId);
      dispatch(deleteWardSuccess(wardId));
    } catch (err: any) {
      // Fallback delete for local item
      dispatch(deleteWardSuccess(wardId));
    }
  };
}
