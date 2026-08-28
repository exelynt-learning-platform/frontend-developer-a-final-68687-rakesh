import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";


import Users from "./Users";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchEmployees,
  fetchCountries,
  createEmployee,
  editEmployee,
  removeEmployee,
  fetchEmployeeById,
} from "../reudux/userSlice";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock("../reudux/userSlice", () => ({
  fetchEmployees: vi.fn(),
  fetchCountries: vi.fn(),
  createEmployee: {
    fulfilled: {
      match: vi.fn(),
    },
  },
  editEmployee: {
    fulfilled: {
      match: vi.fn(),
    },
  },
  removeEmployee: {
    fulfilled: {
      match: vi.fn(),
    },
  },
  fetchEmployeeById: {
    fulfilled: {
      match: vi.fn(),
    },
  },
}));

describe("Users Component", () => {
  let mockDispatch;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch = vi.fn();

    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((selector) =>
      selector({
        Users: {
          employees: [
            {
              id: 1,
              name: "Rakesh",
              email: "rakesh@gmail.com",
              mobile: "9876543210",
              country: "India",
              state: "Maharashtra",
              district: "Pune",
            },
          ],
          countries: [
            {
              id: 1,
              name: "India",
            },
            {
              id: 2,
              name: "USA",
            },
          ],
          loading: false,
          countriesLoading: false,
          employeeLoading: false,
          error: null,
        },
      })
    );

    fetchEmployees.mockReturnValue({
      type: "fetchEmployees",
    });

    fetchCountries.mockReturnValue({
      type: "fetchCountries",
    });
  });

  test("renders Employee Management heading", () => {
    render(<Users />);

    expect(
      screen.getByText("Employee Management")
    ).toBeInTheDocument();
  });

  test("fetches employees and countries when component loads", () => {
    render(<Users />);

    expect(fetchEmployees).toHaveBeenCalled();
    expect(fetchCountries).toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalled();
  });

  test("displays employee data", () => {
    render(<Users />);

    expect(screen.getByText("Rakesh")).toBeInTheDocument();
    expect(
      screen.getByText("rakesh@gmail.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText("9876543210")
    ).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  test("opens Add Employee form", () => {
    render(<Users />);

    const addButton = screen.getByRole("button", {
      name: "Add Employee",
    });

    fireEvent.click(addButton);

    expect(
      screen.getByRole("heading", {
        name: "Add Employee",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Mobile")
    ).toBeInTheDocument();
  });

  test("allows user to enter employee information", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const mobileInput = screen.getByPlaceholderText("Mobile");

    fireEvent.change(nameInput, {
      target: {
        value: "John",
      },
    });

    fireEvent.change(emailInput, {
      target: {
        value: "john@gmail.com",
      },
    });

    fireEvent.change(mobileInput, {
      target: {
        value: "9876543211",
      },
    });

    expect(nameInput).toHaveValue("John");
    expect(emailInput).toHaveValue("john@gmail.com");
    expect(mobileInput).toHaveValue("9876543211");
  });

  test("displays countries in select box", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByRole("option", {
        name: "India",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "USA",
      })
    ).toBeInTheDocument();
  });

  test("opens edit employee form", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Edit Employee",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Name")
    ).toHaveValue("Rakesh");

    expect(
      screen.getByPlaceholderText("Email")
    ).toHaveValue("rakesh@gmail.com");
  });

  test("cancel button closes the form", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Add Employee",
      })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(
      screen.queryByRole("heading", {
        name: "Add Employee",
      })
    ).not.toBeInTheDocument();
  });

  test("search input accepts employee ID", () => {
    render(<Users />);

    const searchInput =
      screen.getByPlaceholderText("Search Employee ID");

    fireEvent.change(searchInput, {
      target: {
        value: "1",
      },
    });

    expect(searchInput).toHaveValue("1");
  });

  test("does not search when search input is empty", async () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Search",
      })
    );

    expect(fetchEmployeeById).not.toHaveBeenCalled();
  });

  test("clear button clears search result", async () => {
    fetchEmployeeById.mockReturnValue({
      type: "fetchEmployeeById",
    });

    mockDispatch.mockResolvedValue({
      payload: {
        id: 1,
        name: "Rakesh",
      },
    });

    fetchEmployeeById.fulfilled.match.mockReturnValue(true);

    render(<Users />);

    const searchInput =
      screen.getByPlaceholderText("Search Employee ID");

    fireEvent.change(searchInput, {
      target: {
        value: "1",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Search",
      })
    );

    await waitFor(() => {
      expect(fetchEmployeeById).toHaveBeenCalledWith("1");
    });
  });

  test("delete employee asks for confirmation", async () => {
    window.confirm = vi.fn(() => false);

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this employee?"
    );

    expect(removeEmployee).not.toHaveBeenCalled();
  });

  test("delete employee dispatches removeEmployee after confirmation", async () => {
    window.confirm = vi.fn(() => true);

    removeEmployee.mockReturnValue({
      type: "removeEmployee",
    });

    mockDispatch.mockResolvedValue({});

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(removeEmployee).toHaveBeenCalledWith(1);
    });
  });

  test("shows error message", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        Users: {
          employees: [],
          countries: [],
          loading: false,
          countriesLoading: false,
          employeeLoading: false,
          error: "Something went wrong",
        },
      })
    );

    render(<Users />);

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();
  });

  test("shows loading employees message", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        Users: {
          employees: [],
          countries: [],
          loading: true,
          countriesLoading: false,
          employeeLoading: false,
          error: null,
        },
      })
    );

    render(<Users />);

    expect(
      screen.getByText("Loading employees...")
    ).toBeInTheDocument();
  });

  test("shows searching employee message", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        Users: {
          employees: [],
          countries: [],
          loading: false,
          countriesLoading: false,
          employeeLoading: true,
          error: null,
        },
      })
    );

    render(<Users />);

    expect(
      screen.getByText("Searching employee...")
    ).toBeInTheDocument();
  });

  test("shows no employees found when employee list is empty", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        Users: {
          employees: [],
          countries: [],
          loading: false,
          countriesLoading: false,
          employeeLoading: false,
          error: null,
        },
      })
    );

    render(<Users />);

    expect(
      screen.getByText("No employees found.")
    ).toBeInTheDocument();
  });
});