import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/auth";

export const login = createAsyncThunk("auth/login", async (data) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
});

export const register = createAsyncThunk("auth/register", async (data) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    logout: (state) => { state.user = null; state.token = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
