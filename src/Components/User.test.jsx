import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

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

/* =====================================================
   MOCK REACT REDUX
===================================================== */

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

/* =====================================================
   MOCK REDUX THUNKS
===================================================== */

vi.mock("../reudux/userSlice", () => {
  const createMockThunk = () => {
    const thunk = vi.fn();

    thunk.fulfilled = {
      match: vi.fn(),
    };

    return thunk;
  };

  return {
    fetchEmployees: vi.fn(),
    fetchCountries: vi.fn(),

    createEmployee: createMockThunk(),
    editEmployee: createMockThunk(),
    removeEmployee: createMockThunk(),
    fetchEmployeeById: createMockThunk(),
  };
});

/* =====================================================
   TESTS
===================================================== */

describe("Users Component", () => {
  let mockDispatch;

  /* =====================================================
     DEFAULT STATE
  ===================================================== */

  const createState = (overrides = {}) => ({
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
      countriesError: null,

      ...overrides,
    },
  });

  /* =====================================================
     BEFORE EACH
  ===================================================== */

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch = vi.fn();

    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((selector) =>
      selector(createState())
    );

    /* Initial API thunks */

    fetchEmployees.mockReturnValue({
      type: "fetchEmployees",
    });

    fetchCountries.mockReturnValue({
      type: "fetchCountries",
    });

    createEmployee.mockReturnValue({
      type: "createEmployee",
    });

    editEmployee.mockReturnValue({
      type: "editEmployee",
    });

    removeEmployee.mockReturnValue({
      type: "removeEmployee",
    });

    fetchEmployeeById.mockReturnValue({
      type: "fetchEmployeeById",
    });

    /* Default dispatch */

    mockDispatch.mockResolvedValue({
      payload: null,
    });

    /* Default thunk results */

    createEmployee.fulfilled.match.mockReturnValue(false);

    editEmployee.fulfilled.match.mockReturnValue(false);

    removeEmployee.fulfilled.match.mockReturnValue(false);

    fetchEmployeeById.fulfilled.match.mockReturnValue(false);

    /* Default confirm */

    window.confirm = vi.fn(() => false);
  });

  /* =====================================================
     BASIC RENDER
  ===================================================== */

  test("renders Employee Management heading", () => {
    render(<Users />);

    expect(
      screen.getByText("Employee Management")
    ).toBeInTheDocument();
  });

  /* =====================================================
     FETCH DATA
  ===================================================== */

  test("fetches employees and countries when component loads", () => {
    render(<Users />);

    expect(fetchEmployees).toHaveBeenCalled();

    expect(fetchCountries).toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalled();
  });

  /* =====================================================
     EMPLOYEE DATA
  ===================================================== */

  test("displays employee data", () => {
    render(<Users />);

    expect(
      screen.getByText("Rakesh")
    ).toBeInTheDocument();

    expect(
      screen.getByText("rakesh@gmail.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText("9876543210")
    ).toBeInTheDocument();

    expect(
      screen.getByText("India")
    ).toBeInTheDocument();
  });

  /* =====================================================
     ADD EMPLOYEE
  ===================================================== */

  test("opens Add Employee form", () => {
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

  /* =====================================================
     INPUT
  ===================================================== */

  test("allows user to enter employee information", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    const nameInput =
      screen.getByPlaceholderText("Name");

    const emailInput =
      screen.getByPlaceholderText("Email");

    const mobileInput =
      screen.getByPlaceholderText("Mobile");

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

    expect(emailInput).toHaveValue(
      "john@gmail.com"
    );

    expect(mobileInput).toHaveValue(
      "9876543211"
    );
  });

  test("allows user to enter a department", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    const departmentInput =
      screen.getByPlaceholderText("Department");

    fireEvent.change(departmentInput, {
      target: {
        value: "Engineering",
      },
    });

    expect(departmentInput).toHaveValue("Engineering");
  });

  /* =====================================================
     COUNTRIES
  ===================================================== */

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

  /* =====================================================
     COUNTRY VALIDATION
  ===================================================== */

  test("state and district are disabled before country selection", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    const locationInputs =
      screen.getAllByPlaceholderText(
        "Select country first"
      );

    expect(locationInputs.length).toBeGreaterThanOrEqual(
      2
    );

    expect(locationInputs[0]).toBeDisabled();

    expect(locationInputs[1]).toBeDisabled();
  });

  /* =====================================================
     COUNTRY SELECTION
  ===================================================== */

  test("state and district become available after country selection", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    /*
      Do NOT use:
      getByRole("combobox", { name: /country/i })

      because the country select in Users.jsx does not
      expose "Country" as its accessible name.

      The first combobox is the country select.
    */

    const comboBoxes =
      screen.getAllByRole("combobox");

    expect(comboBoxes.length).toBeGreaterThanOrEqual(
      1
    );

    const countrySelect = comboBoxes[0];

    fireEvent.change(countrySelect, {
      target: {
        value: "India",
      },
    });

    expect(
      screen.getByPlaceholderText("State")
    ).not.toBeDisabled();

    expect(
      screen.getByPlaceholderText("District")
    ).not.toBeDisabled();
  });

  /* =====================================================
     EDIT
  ===================================================== */

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

  /* =====================================================
     CANCEL
  ===================================================== */

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

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  test("search input accepts employee ID", () => {
    render(<Users />);

    const searchInput =
      screen.getByPlaceholderText(
        "Search Employee ID"
      );

    fireEvent.change(searchInput, {
      target: {
        value: "1",
      },
    });

    expect(searchInput).toHaveValue("1");
  });

  /* =====================================================
     EMPTY SEARCH
  ===================================================== */

  test("does not search when search input is empty", () => {
    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Search",
      })
    );

    expect(
      fetchEmployeeById
    ).not.toHaveBeenCalled();
  });

  /* =====================================================
     SEARCH EMPLOYEE
  ===================================================== */

  test("searches employee by ID", async () => {
    mockDispatch.mockResolvedValue({
      payload: {
        id: 1,
        name: "Rakesh",
      },
    });

    fetchEmployeeById.fulfilled.match.mockReturnValue(
      true
    );

    render(<Users />);

    const searchInput =
      screen.getByPlaceholderText(
        "Search Employee ID"
      );

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
      expect(
        fetchEmployeeById
      ).toHaveBeenCalledWith("1");
    });
  });

  /* =====================================================
     DELETE CONFIRMATION
  ===================================================== */

  test("delete employee asks for confirmation", () => {
    window.confirm.mockReturnValue(false);

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "Are you sure you want to delete this employee?"
    );

    expect(
      removeEmployee
    ).not.toHaveBeenCalled();
  });

  /* =====================================================
     DELETE SUCCESS
  ===================================================== */

  test("delete employee dispatches removeEmployee after confirmation", async () => {
    window.confirm.mockReturnValue(true);

    mockDispatch.mockResolvedValue({
      payload: 1,
    });

    removeEmployee.fulfilled.match.mockReturnValue(
      true
    );

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(
        removeEmployee
      ).toHaveBeenCalledWith(1);
    });
  });

  /* =====================================================
     DELETE ERROR
  ===================================================== */

  test("handles delete employee failure", async () => {
    window.confirm.mockReturnValue(true);

    mockDispatch.mockResolvedValue({
      payload: "Failed to delete employee.",
    });

    removeEmployee.fulfilled.match.mockReturnValue(
      false
    );

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to delete employee."
        )
      ).toBeInTheDocument();
    });
  });

  /* =====================================================
     ERROR
  ===================================================== */

  test("shows error message", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
          error: "Something went wrong",
        })
      )
    );

    render(<Users />);

    expect(
      screen.getByText(
        "Something went wrong"
      )
    ).toBeInTheDocument();
  });

  /* =====================================================
     LOADING
  ===================================================== */

  test("shows loading employees message", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
          loading: true,
        })
      )
    );

    render(<Users />);

    expect(
      screen.getByText(
        "Loading employees..."
      )
    ).toBeInTheDocument();
  });

  /* =====================================================
     SEARCH LOADING
  ===================================================== */

  test("shows searching employee message", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
          employeeLoading: true,
        })
      )
    );

    render(<Users />);

    expect(
      screen.getByText(
        "Searching employee..."
      )
    ).toBeInTheDocument();
  });

  /* =====================================================
     EMPTY EMPLOYEES
  ===================================================== */

  test("shows no employees found when employee list is empty", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
        })
      )
    );

    render(<Users />);

    expect(
      screen.getByText(
        "No employees found."
      )
    ).toBeInTheDocument();
  });

  /* =====================================================
     COUNTRIES LOAD ERROR
  ===================================================== */

  test("shows countries unavailable when countries fail to load", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
          countries: [],
          countriesError:
            "Failed to fetch countries",
        })
      )
    );

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Countries could not be loaded."
      )
    ).toBeInTheDocument();
  });

  /* =====================================================
     COUNTRY SELECT DISABLED
  ===================================================== */

  test("country select is disabled when countries are unavailable", () => {
    useSelector.mockImplementation((selector) =>
      selector(
        createState({
          employees: [],
          countries: [],
          countriesError:
            "Failed to fetch countries",
        })
      )
    );

    render(<Users />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    /*
      Country select is the first combobox.
      We intentionally do not search by accessible name
      because Users.jsx does not expose "Country" as the
      select's accessible name.
    */

    const comboBoxes =
      screen.getAllByRole("combobox");

    expect(comboBoxes.length).toBeGreaterThanOrEqual(
      1
    );

    const countrySelect = comboBoxes[0];

    expect(countrySelect).toBeDisabled();
  });
});