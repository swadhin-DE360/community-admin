import { createSlice } from '@reduxjs/toolkit'
import { errorHandler, successHandler } from '../shared/_helper/responseHelper';
import { service } from '@/shared/_services/api_service';
import { localService } from '@/shared/_session/local';



const initialState = {
  loading: false,
  token: "",
  isAuthenticated: localStorage.getItem('accessToken') ? true : false,
  email: '',
  name: '',
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoadingStatus(state, { payload }) {
      state.loading = payload;
    },
    loginSucces(state, { payload }) {
      localStorage.setItem("accessToken", payload.token);
      localStorage.setItem("ward18_admin_logged_in", "true");
      if (payload.name) {
        localStorage.setItem("name", payload.name);
        state.name = payload.name;
      }
      state.token = payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      successHandler("Successfully logged in!..")
    },
    getProfile(state) {
      state.name = localService.get('name') || '';
    },
    setProfile(state, { payload }) {
      state.name = payload.name;
      state.email = payload.email;
    },
    logout(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("ward18_admin_logged_in");
      localStorage.removeItem("name");
      state.isAuthenticated = false;
      state.token = "";
      state.name = "";
      state.email = "";
    }
  }
})

export const { loginSucces, setLoadingStatus, getProfile, setProfile, logout } = authSlice.actions;

export default authSlice.reducer;

/*LOGIN USER THUNK*/
export function loginUser(body: { email: string; password: string; navigate: (path: string) => void }) {
  return async function loginUserThunk(dispatch: any) {
    dispatch(setLoadingStatus(true)); 
    try {
      const response = await service.login({ email: body.email, password: body.password });
      if (response.data) {
        dispatch(loginSucces(response.data));
        body.navigate('/dashboard');
      }
    } catch (error: any) {
      dispatch(setLoadingStatus(false));
      errorHandler(error.response || { status: 500, data: { message: error.message || "Login failed" } });
    }
  }
}

export function fetchProfile() {
  return async function fetchProfileThunk(dispatch) {
    try {
      const response = await service.getProfile();
      if (response.data) {
        dispatch(setProfile(response.data));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  }
}



