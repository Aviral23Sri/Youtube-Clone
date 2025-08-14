import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const listVideos = createAsyncThunk("videos/list", async (params = {}) => {
  const res = await api.get("videos", { params });
  return res.data;
});

export const getVideoById = createAsyncThunk("videos/getById", async (id) => {
  const res = await api.get(`videos/${id}`);
  return res.data;
});

export const createVideo = createAsyncThunk("videos/create", async (payload) => {
  // payload: { title, description, category, thumbnailFile, videoFile }
  const form = new FormData();
  form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.category) form.append("category", payload.category);
  form.append("thumbnail", payload.thumbnailFile);
  form.append("video", payload.videoFile);

  const res = await api.post("videos", form, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
});

export const updateVideo = createAsyncThunk("videos/update", async ({ id, data }) => {
  const res = await api.patch(`videos/${id}`, data);
  return res.data;
});

export const deleteVideo = createAsyncThunk("videos/delete", async (id) => {
  await api.delete(`videos/${id}`);
  return id;
});

export const incrementView = createAsyncThunk("videos/incrementView", async (id) => {
  const res = await api.patch(`videos/${id}/view`);
  return res.data;
});

const initialState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  status: "idle",
  error: null,
  selected: null,
  loadingSelected: false
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // list
      .addCase(listVideos.pending, (s) => { s.status = "loading"; })
      .addCase(listVideos.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload.items;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.pages = a.payload.pages;
      })
      .addCase(listVideos.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      // getById
      .addCase(getVideoById.pending, (s) => { s.loadingSelected = true; })
      .addCase(getVideoById.fulfilled, (s, a) => { s.loadingSelected = false; s.selected = a.payload; })
      .addCase(getVideoById.rejected, (s, a) => { s.loadingSelected = false; s.error = a.error.message; })
      // create
      .addCase(createVideo.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      // update
      .addCase(updateVideo.fulfilled, (s, a) => {
        const idx = s.items.findIndex(v => v._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
        if (s.selected?._id === a.payload._id) s.selected = a.payload;
      })
      // delete
      .addCase(deleteVideo.fulfilled, (s, a) => {
        s.items = s.items.filter(v => v._id !== a.payload);
        if (s.selected?._id === a.payload) s.selected = null;
      })
      // increment view
      .addCase(incrementView.fulfilled, (s, a) => {
        const idx = s.items.findIndex(v => v._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
        if (s.selected?._id === a.payload._id) s.selected = a.payload;
      });
  }
});

export default videoSlice.reducer;
