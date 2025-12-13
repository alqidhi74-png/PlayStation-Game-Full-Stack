import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUser = createAsyncThunk("users/getUser", async (udata) => {
  try {
    const response = await axios.post("https://playstation-game-full-stack-6.onrender.com/login", udata);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const addUser = createAsyncThunk(
  "users/addUser",
  async (udata, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://playstation-game-full-stack-6.onrender.com/register",
        udata
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (udata, thunkAPI) => {
    try {
      const response = await axios.put(
        "https://playstation-game-full-stack-6.onrender.com/updateProfile",
        udata
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const savedUser = JSON.parse(localStorage.getItem("user"));

const initVal = {
  // user: {},
  user: savedUser ? savedUser : null,
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initVal,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "User added successfully";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Registration failed";
      })

      // login
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload?.user;
        state.message = action.payload?.message;
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.message = "Profile updated";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Update failed";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
