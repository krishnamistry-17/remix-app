import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const initialState: {
  posts: Post[];
  currentPost: Post | null;
  status: "idle" | "loading" | "succeeded" | "failed";
} = { posts: [], currentPost: null, status: "idle" };

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  const postLength = 10;
  const sortedPosts = posts
    .sort((a: Post, b: Post) => a.id - b.id)
    .slice(0, postLength);
  return sortedPosts;
});

export const fetchPostDetail = createAsyncThunk(
  "post/fetchPostDetail",
  async (id: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.json();
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = "failed";
      action.error.message = "Failed to fetch posts";
    });
    builder.addCase(fetchPosts.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchPostDetail.fulfilled, (state, action) => {
      state.currentPost = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchPostDetail.rejected, (state, action) => {
      state.status = "failed";
      action.error.message = "Failed to fetch post detail";
    });
    builder.addCase(fetchPostDetail.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;
