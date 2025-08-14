import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/videos/videoSlice";
import commentReducer from "../features/comments/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videoReducer,
    comments: commentReducer
  }
});
