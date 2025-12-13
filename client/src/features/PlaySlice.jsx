import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add new game
export const addPlaystation = createAsyncThunk(
  "playstation/addPlaystation",
  async (gameData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/saveGame",
        gameData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Saving game failed" }
      );
    }
  }
);

// Get all games
export const getPlaystations = createAsyncThunk(
  "playstation/getPlaystations",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5000/showGame");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Fetching games failed" }
      );
    }
  }
);

// Update game
export const updatePlaystation = createAsyncThunk(
  "playstation/updatePlaystation",
  async (gameData, thunkAPI) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/updateGame",
        gameData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Updating game failed" }
      );
    }
  }
);

// Delete game
export const deletePlaystation = createAsyncThunk(
  "playstation/deletePlaystation",
  async (gameId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteGame/${gameId}`
      );
      return { id: gameId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Deleting game failed" }
      );
    }
  }
);

// Get downloaded games
export const getDownloadedGames = createAsyncThunk(
  "playstation/getDownloadedGames",
  async (username, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/downloads/${username}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Fetching downloaded games failed" }
      );
    }
  }
);

// Download a game
export const downloadGame = createAsyncThunk(
  "playstation/downloadGame",
  async ({ username, gameId }, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:5000/downloadGame", {
        username,
        gameId,
      });
      thunkAPI.dispatch(getDownloadedGames(username));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Download failed" }
      );
    }
  }
);

// Delete a downloaded game
export const deleteDownloadedGame = createAsyncThunk(
  "playstation/deleteDownloadedGame",
  async ({ username, gameId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteDownload/${username}/${gameId}`
      );
      thunkAPI.dispatch(getDownloadedGames(username));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Deleting download failed" }
      );
    }
  }
);

const initVal = {
  playstation: [],
  downloaded: [],
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const playSlice = createSlice({
  name: "playstation",
  initialState: initVal,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add playstation game
      .addCase(addPlaystation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(addPlaystation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Game added successfully";
      })
      .addCase(addPlaystation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Saving game failed";
      })

      // get playstation games
      .addCase(getPlaystations.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getPlaystations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playstation = action.payload?.data || [];
      })
      .addCase(getPlaystations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Fetching games failed";
      })

      // update playstation game
      .addCase(updatePlaystation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updatePlaystation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Game updated successfully";
        const updatedGame = action.payload?.data;
        if (updatedGame) {
          const index = state.playstation.findIndex(
            (game) => game._id === updatedGame._id
          );
          if (index !== -1) state.playstation[index] = updatedGame;
        }
      })
      .addCase(updatePlaystation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Updating game failed";
      })

      // delete playstation game
      .addCase(deletePlaystation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deletePlaystation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playstation = state.playstation.filter(
          (game) => game._id !== action.payload.id
        );
        state.message =
          action.payload?.data?.message || "Game deleted successfully";
      })
      .addCase(deletePlaystation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Deleting game failed";
      })

      // get downloaded games
      .addCase(getDownloadedGames.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDownloadedGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.downloaded = action.payload || [];
      })

      .addCase(getDownloadedGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Fetching downloaded games failed";
      })
      .addCase(downloadGame.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(downloadGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload?.message || "Game downloaded successfully";
      })
      .addCase(downloadGame.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message || action.error?.message || "Download failed";
      })
      // delete downloaded game
      .addCase(deleteDownloadedGame.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteDownloadedGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload?.message || "Download deleted successfully";
      })
      .addCase(deleteDownloadedGame.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          "Deleting download failed";
      });
  },
});

export default playSlice.reducer;
