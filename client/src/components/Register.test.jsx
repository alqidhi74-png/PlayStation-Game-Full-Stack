import React from "react";
import Register from "./Register";
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
    message: "",
    isSuccess: false,
    isError: false,
    isLoading: false,
  },
  theme: {
    mode: "light",
  },
});

// Test 1: Match the Register UI snapshot
test("Match the Register UI snapshot...", () => {
  const { container } = render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Register />
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

// Test 3: Renders all fields, labels, and button
test("Renders all fields, labels, and button", () => {
  render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/join us/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/^email$/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();

  // Look for any <input type="date"> directly
  const dateInput = document.querySelector('input[type="date"]');
  expect(dateInput).toBeTruthy();

  expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  expect(screen.getByText(/login now/i)).toBeInTheDocument();
});

// Test 4: Allows typing in all text fields
test("Allows typing in all text fields", () => {
  render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );

  const username = screen.getByPlaceholderText(/username/i);
  const email = screen.getByPlaceholderText(/^email$/i);
  const password = screen.getByPlaceholderText(/^password$/i);
  const dateInput = document.querySelector('input[type="date"]');

  fireEvent.change(username, { target: { value: "John Doe" } });
  fireEvent.change(email, { target: { value: "john@example.com" } });
  fireEvent.change(password, { target: { value: "Pass@123" } });
  fireEvent.change(dateInput, { target: { value: "1995-05-10" } });

  expect(username.value).toBe("John Doe");
  expect(email.value).toBe("john@example.com");
  expect(password.value).toBe("Pass@123");
  expect(dateInput.value).toBe("1995-05-10");
});

// Test 5: Button is disabled when loading
test("Button is disabled when loading", () => {
  const loadingStore = myMockStore({
    user: {
      user: null,
      message: "",
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
        <Register />
      </BrowserRouter>
    </Provider>
  );

  const submitButton = screen.getByRole("button", { name: /creating account/i });
  expect(submitButton).toBeDisabled();
});
