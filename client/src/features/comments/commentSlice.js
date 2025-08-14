import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const fetchComments = createAsyncThunk("comments/fetch", async ({ videoId, page = 1 }) => {
  const res = await api.get("comments", { params: { videoId, page } });
  return { videoId, data: res.data };
});

export const addComment = createAsyncThunk("comments/add", async ({ videoId, text }) => {
  const res = await api.post("comments", { videoId, text });
  return res.data;
});

export const updateComment = createAsyncThunk("comments/update", async ({ id, text }) => {
  const res = await api.patch(`comments/${id}`, { text });
  return res.data;
});

export const deleteComment = createAsyncThunk("comments/delete", async (id) => {
  await api.delete(`comments/${id}`);
  return id;
});

const initialState = {
  byVideo: {}, // videoId -> { items, total, page, pages, status }
  error: null
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (s, a) => {
        const { videoId } = a.meta.arg;
        s.byVideo[videoId] = s.byVideo[videoId] || { items: [], total: 0, page: 1, pages: 1, status: "idle" };
        s.byVideo[videoId].status = "loading";
      })
      .addCase(fetchComments.fulfilled, (s, a) => {
        const { videoId, data } = a.payload;
        s.byVideo[videoId] = { ...data, status: "succeeded" };
      })
      .addCase(fetchComments.rejected, (s, a) => { s.error = a.error.message; })
      .addCase(addComment.fulfilled, (s, a) => {
        const vId = a.payload.videoId;
        if (!s.byVideo[vId]) s.byVideo[vId] = { items: [], total: 0, page: 1, pages: 1, status: "idle" };
        s.byVideo[vId].items.unshift(a.payload);
        s.byVideo[vId].total += 1;
      })
      .addCase(updateComment.fulfilled, (s, a) => {
        const vId = a.payload.videoId;
        const list = s.byVideo[vId]?.items || [];
        const idx = list.findIndex(c => c._id === a.payload._id);
        if (idx >= 0) list[idx] = a.payload;
      })
      .addCase(deleteComment.fulfilled, (s, a) => {
        const id = a.payload;
        for (const vId in s.byVideo) {
          const list = s.byVideo[vId]?.items || [];
          const before = list.length;
          s.byVideo[vId].items = list.filter(c => c._id !== id);
          if (s.byVideo[vId].items.length !== before) s.byVideo[vId].total -= 1;
        }
      });
  }
});

export default commentSlice.reducer;
