import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-mock-store";
import AddPlaystation from "../components/AddPlaystation";
import reducer from "../features/PlaySlice";

// =======================
// Mock Store
// =======================
const mockStore = configureStore([]);

const store = mockStore({
  user: {
    user: { username: "admin" },
  },
  playstation: {
    playstation: [],
    downloaded: [],
    message: "",
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  theme: {
    mode: "light",
  },
});

// Test 1: Snapshot Test
test("Match AddPlaystation UI snapshot", () => {
  const { container } = render(
    <Provider store={store}>
      <BrowserRouter>
        <AddPlaystation />
      </BrowserRouter>
    </Provider>
  );

  expect(container).toMatchSnapshot();
});


// Test 2: Initial reducer state
const initialState = {
  playstation: [],
  downloaded: [],
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

test("Match initial PlaySlice state", () => {
  expect(reducer(undefined, { type: undefined })).toEqual(initialState);
});

// Test 3: Render all fields
test("Renders all input fields and submit button", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AddPlaystation />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/add playstation game/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/game code/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/release year/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/game picture url/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /save game/i })).toBeInTheDocument();
});

// Test 4: Typing in fields
test("Allows typing in all form fields", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AddPlaystation />
      </BrowserRouter>
    </Provider>
  );

  const gameCode = screen.getByPlaceholderText(/game code/i);
  const title = screen.getByPlaceholderText(/title/i);
  const releaseYear = screen.getByPlaceholderText(/release year/i);
  const gamePicture = screen.getByPlaceholderText(/game picture url/i);
  const description = screen.getByPlaceholderText(/description/i);

  fireEvent.change(gameCode, { target: { value: "101" } });
  fireEvent.change(title, { target: { value: "God of War" } });
  fireEvent.change(releaseYear, { target: { value: "2023" } });
  fireEvent.change(gamePicture, {
    target: { value: "https://image.com/game.jpg" },
  });
  fireEvent.change(description, {
    target: { value: "Action adventure game" },
  });

  expect(gameCode.value).toBe("101");
  expect(title.value).toBe("God of War");
  expect(releaseYear.value).toBe("2023");
  expect(gamePicture.value).toBe("https://image.com/game.jpg");
  expect(description.value).toBe("Action adventure game");
});

// Test 5: Loading state
test("Submit button is disabled when loading", () => {
  const loadingStore = mockStore({
    user: {
      user: { username: "admin" },
    },
    playstation: {
      playstation: [],
      downloaded: [],
      message: "",
      isLoading: true,
      isSuccess: false,
      isError: false,
    },
    theme: {
      mode: "light",
    },
  });

  render(
    <Provider store={loadingStore}>
      <BrowserRouter>
        <AddPlaystation />
      </BrowserRouter>
    </Provider>
  );

  const button = screen.getByRole("button", { name: /saving/i });
  expect(button).toBeDisabled();
});
