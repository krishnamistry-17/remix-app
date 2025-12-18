import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../redux/post/postSlice";

export default configureStore({
  reducer: {
    post: postReducer,
  },
});
