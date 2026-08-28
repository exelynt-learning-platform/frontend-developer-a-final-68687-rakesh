import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getCountries,
} from "../axios/userApi";

import { getErrorMessage } from "../utils/errorMessage";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      return await getEmployees();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch employees")
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      return await getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.status === 404
          ? "Employee not found"
          : getErrorMessage(error, "Failed to find employee")
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employee, { rejectWithValue }) => {
    try {
      return await addEmployee(employee);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add employee")
      );
    }
  }
);

export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id, employee }, { rejectWithValue }) => {
    try {
      return await updateEmployee(id, employee);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update employee")
      );
    }
  }
);

export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete employee")
      );
    }
  }
);

export const fetchCountries = createAsyncThunk(
  "employees/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      return await getCountries();
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch countries")
      );
    }
  }
);

const initialState = {
  employees: [],
  countries: [],
  loading: false,
  countriesLoading: false,
  error: null,
  countriesError: null,
  employeeLoading: false,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEmployeeById.pending, (state) => {
        state.employeeLoading = true;
        state.error = null;
      })

      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.employeeLoading = false;

        const employee = action.payload;

        if (
          !employee ||
          typeof employee !== "object" ||
          employee.id == null
        ) {
          return;
        }

        const index = state.employees.findIndex(
          (emp) => emp?.id === employee.id
        );

        if (index !== -1) {
          state.employees[index] = employee;
        } else {
          state.employees.push(employee);
        }
      })

      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.employeeLoading = false;
        state.error = action.payload;
      })

      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;

        if (
          action.payload &&
          typeof action.payload === "object"
        ) {
          state.employees.push(action.payload);
        }
      })

      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;

        if (
          !action.payload ||
          typeof action.payload !== "object"
        ) {
          return;
        }

        const index = state.employees.findIndex(
          (emp) => emp?.id === action.payload.id
        );

        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })

      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;

        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload
        );
      })

      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCountries.pending, (state) => {
        state.countriesLoading = true;
        state.countriesError = null;
      })

      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchCountries.rejected, (state, action) => {
        state.countriesLoading = false;
        state.countriesError = action.payload;
      });
  },
});

export const { clearError } = employeeSlice.actions;

export default employeeSlice.reducer;