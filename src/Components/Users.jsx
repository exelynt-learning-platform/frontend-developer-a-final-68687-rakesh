
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchEmployees,
  fetchCountries,
  createEmployee,
  editEmployee as editEmployeeAction,
  removeEmployee,
  fetchEmployeeById,
} from "../reudux/userSlice";

import EmployeeForm from "./EmployeeForm";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeList from "./EmployeeList";

const emptyEmployee = () => ({
  name: "",
  email: "",
  mobile: "",
  country: "",
  state: "",
  district: "",
  department: "",
});

const normalizeEmployee = (employee = {}) => ({
  name: typeof employee.name === "string" ? employee.name : "",
  email: typeof employee.email === "string" ? employee.email : "",
  mobile: typeof employee.mobile === "string" ? employee.mobile : "",
  country: typeof employee.country === "string" ? employee.country : "",
  state: typeof employee.state === "string" ? employee.state : "",
  district: typeof employee.district === "string" ? employee.district : "",
  department:
    typeof employee.department === "string" ? employee.department : "",
});

const Users = () => {
  const dispatch = useDispatch();

  const {
    employees = [],
    countries = [],
    loading,
    countriesLoading,
    employeeLoading,
    error,
  } = useSelector((state) => state.Users);
  const safeEmployees = Array.isArray(employees)
    ? employees.filter(Boolean)
    : [];
  const safeCountries = Array.isArray(countries) ? countries : [];

  const [employeeData, setEmployeeData] = useState({
    ...emptyEmployee(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setEmployeeData({
        ...employeeData,
        country: value,
        state: "",
        district: "",
      });
    } else {
      setEmployeeData({
        ...employeeData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setEmployeeData(emptyEmployee());

    setIsEditing(false);
    setEditEmployeeId(null);
    setShowForm(false);
    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  const getErrorMessage = (payload, defaultMessage) => {
    if (typeof payload === "string") {
      return payload;
    }

    const message =
      payload?.message ||
      payload?.response?.data?.message ||
      payload?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    return defaultMessage;
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setActionError("");

    if (!employeeData.country) {
      setActionError("Please select a country.");
      return;
    }

    if (!employeeData.state.trim()) {
      setActionError("Please enter state.");
      return;
    }

    if (!employeeData.district.trim()) {
      setActionError("Please enter district.");
      return;
    }

    if (!employeeData.department.trim()) {
      setActionError("Please enter department.");
      return;
    }

    try {
      if (isEditing) {
        const result = await dispatch(
          editEmployeeAction({
            id: editEmployeeId,
            employee: employeeData,
          })
        );

        if (editEmployeeAction.fulfilled.match(result)) {
          alert("Employee updated successfully!");
          resetForm();
        } else {
          setActionError(
            getErrorMessage(
              result.payload,
              "Failed to update employee."
            )
          );
        }
      } else {
        const result = await dispatch(
          createEmployee(employeeData)
        );

        if (createEmployee.fulfilled.match(result)) {
          alert("Employee added successfully!");
          resetForm();
        } else {
          setActionError(
            getErrorMessage(
              result.payload,
              "Failed to add employee."
            )
          );
        }
      }
    } catch (err) {
      console.error("Employee operation failed:", err);

      setActionError(
        err?.message || "Something went wrong. Please try again."
      );
    }
  };

  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    setActionError("");

    try {
      const result = await dispatch(removeEmployee(id));

      if (removeEmployee.fulfilled.match(result)) {
        alert("Employee deleted successfully!");
      } else {
        setActionError(
          getErrorMessage(
            result.payload,
            "Failed to delete employee."
          )
        );
      }
    } catch (err) {
      console.error("Delete employee failed:", err);

      setActionError(
        err?.message ||
          "Something went wrong while deleting employee."
      );
    }
  };

  const editHandle = (employee) => {
    setEmployeeData(normalizeEmployee(employee));

    setIsEditing(true);
    setEditEmployeeId(employee.id);
    setShowForm(true);

    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  const addHandle = () => {
    setEmployeeData(emptyEmployee());

    setIsEditing(false);
    setEditEmployeeId(null);
    setShowForm(true);

    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  const searchHandle = async () => {
    if (!searchTerm.trim()) {
      setSearchResult(null);
      return;
    }

    setActionError("");

    try {
      const result = await dispatch(
        fetchEmployeeById(searchTerm.trim())
      );

      if (
        fetchEmployeeById.fulfilled.match(result) &&
        result.payload &&
        typeof result.payload === "object"
      ) {
        setSearchResult(result.payload);
      } else {
        setSearchResult("not-found");

        setActionError(
          getErrorMessage(
            result.payload,
            "Employee not found."
          )
        );
      }
    } catch (err) {
      console.error("Search employee failed:", err);

      setSearchResult("not-found");

      setActionError(
        err?.message ||
          "Something went wrong while searching."
      );
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  let displayedEmployees = safeEmployees;

  if (searchResult === "not-found") {
    displayedEmployees = [];
  } else if (searchResult && typeof searchResult === "object") {
    const liveMatch = safeEmployees.find(
      (emp) => emp?.id === searchResult.id
    );

    displayedEmployees = liveMatch ? [liveMatch] : [];
  }

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto">

      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 border-b-2 border-blue-500 py-4 px-4">

        <h2 className="text-2xl md:text-4xl font-bold text-blue-600">
          Employee Management
        </h2>

        <EmployeeSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchHandle={searchHandle}
          clearSearch={clearSearch}
          searchResult={searchResult}
          showForm={showForm}
          addHandle={addHandle}
        />

      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong."}
        </div>
      )}

      {actionError && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          {actionError}
        </div>
      )}

      {!countriesLoading && safeCountries.length === 0 && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          Countries could not be loaded.
        </div>
      )}

      {showForm && (
        <EmployeeForm
          employeeData={employeeData}
          handleChange={handleChange}
          submitHandle={submitHandle}
          resetForm={resetForm}
          isEditing={isEditing}
          loading={loading}
          countries={safeCountries}
          countriesLoading={countriesLoading}
        />
      )}

      {employeeLoading && (
        <p className="text-center text-blue-600 font-semibold mt-5">
          Searching employee...
        </p>
      )}

      {loading && !showForm && (
        <p className="text-center text-blue-600 font-semibold mt-5">
          Loading employees...
        </p>
      )}

      {searchResult === "not-found" && (
        <p className="text-center text-red-500 text-xl font-semibold mt-8">
          No employee found with ID: {searchTerm}
        </p>
      )}

      {!loading && displayedEmployees.length > 0 && (
        <EmployeeList
          employees={displayedEmployees}
          editHandle={editHandle}
          deleteHandle={deleteHandle}
        />
      )}

      {!loading &&
        displayedEmployees.length === 0 &&
        searchResult !== "not-found" && (
          <p className="text-center mt-8 text-gray-600 text-lg">
            No employees found.
          </p>
        )}

    </div>
  );
};

export default Users;

