import React from "react";
import Login from "../components/Login";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-mock-store";
import reducer from "../features/UserSlice";

// mock store
const myMockStore = configureStore([]);
const myStore = myMockStore({
  user: {
    user: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
  },
  theme: {
    mode: "light",
  },
});

// Test 1: Match the Login UI snapshot
test("Match the Login UI snapshot...", () => {
  const { container } = render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  screen.debug(container);

  expect(container).toMatchSnapshot();
});

// Test 2: To match the initial state
const myState = {
  user: null,
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

test("To match the initial state....", () => {
  expect(reducer(undefined, { type: undefined })).toEqual(myState);
});

// Test 3: Renders all form fields and buttons
test("Renders all form fields and buttons", () => {
  render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  expect(screen.getByText(/sign up now/i)).toBeInTheDocument();
});

// Test 4: Allows typing in email and password inputs
test("Allows typing in email and password inputs", () => {
  render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  const emailInput = screen.getByPlaceholderText(/email address/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  fireEvent.change(emailInput, { target: { value: "user@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "123456" } });

  expect(emailInput.value).toBe("user@example.com");
  expect(passwordInput.value).toBe("123456");
});

// Test 5: Button is disabled when loading
test("Button is disabled when loading", () => {
  const loadingStore = myMockStore({
    user: {
      user: null,
      isSuccess: false,
      isError: false,
      isLoading: true,
    },
    theme: {
      mode: "light",
    },
  });

  render(
    <Provider store={loadingStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  const submitButton = screen.getByRole("button", { name: /signing in/i });
  expect(submitButton).toBeDisabled();
});
