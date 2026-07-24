import { createSlice } from '@reduxjs/toolkit';
import { service } from '@/shared/_services/api_service';

export interface ImportantContactItem {
  _id?: string;
  id?: string;
  title: string;
  desc: string;
  no: string;
  type?: string;
  wardId?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface ImportantContactsState {
  contacts: ImportantContactItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ImportantContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

export const importantContactsSlice = createSlice({
  name: 'importantContacts',
  initialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loading = action.payload;
    },
    setContacts(state, action) {
      const list = (action.payload || []).map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
      state.contacts = list;
      state.loading = false;
      state.error = null;
    },
    addContactSuccess(state, action) {
      const newItem = {
        ...action.payload,
        id: action.payload._id || action.payload.id,
      };
      state.contacts.unshift(newItem);
      state.loading = false;
    },
    updateContactSuccess(state, action) {
      const updatedId = action.payload._id || action.payload.id;
      const index = state.contacts.findIndex((item) => (item._id || item.id) === updatedId);
      if (index !== -1) {
        state.contacts[index] = {
          ...action.payload,
          id: updatedId,
        };
      }
      state.loading = false;
    },
    deleteContactSuccess(state, action) {
      const idToDelete = action.payload;
      state.contacts = state.contacts.filter((item) => (item._id || item.id) !== idToDelete);
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
  setContacts,
  addContactSuccess,
  updateContactSuccess,
  deleteContactSuccess,
  setError,
} = importantContactsSlice.actions;

export default importantContactsSlice.reducer;

/* THUNKS */
export function fetchImportantContacts(wardId?: string, search?: string, type?: string) {
  return async function fetchImportantContactsThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.getImportantContacts(wardId, search, type);
      if (response.data) {
        dispatch(setContacts(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to fetch important contacts', error);
    }
  };
}

export function createImportantContact(data: Partial<ImportantContactItem>) {
  return async function createImportantContactThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.createImportantContact(data);
      if (response.data) {
        dispatch(addContactSuccess(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to create important contact', error);
    }
  };
}

export function updateImportantContact(payload: { id: string; data: Partial<ImportantContactItem> }) {
  return async function updateImportantContactThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      const response = await service.updateImportantContact(payload.id, payload.data);
      if (response.data) {
        dispatch(updateContactSuccess(response.data));
      } else {
        dispatch(setLoadingStatus(false));
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to update important contact', error);
    }
  };
}

export function deleteImportantContact(id: string) {
  return async function deleteImportantContactThunk(dispatch: any) {
    dispatch(setLoadingStatus(true));
    try {
      await service.deleteImportantContact(id);
      dispatch(deleteContactSuccess(id));
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      console.error('Failed to delete important contact', error);
    }
  };
}
