import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const createChannel = createAsyncThunk("channel/create", async (data) => {
  const res = await api.post("channels", data);
  return res.data;
});

export const getChannelById = createAsyncThunk("channel/get", async (id) => {
  const res = await api.get(`channels/${id}`);
  return res.data;
});

const channelSlice = createSlice({
  name: "channel",
  initialState: { current: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(createChannel.fulfilled, (s,a)=>{ s.current=a.payload; });
    b.addCase(getChannelById.fulfilled, (s,a)=>{ s.current=a.payload; });
  }
});
export default channelSlice.reducer;
