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

const Users = () => {
  const dispatch = useDispatch();

  const {
    employees,
    countries,
    loading,
    countriesLoading,
    employeeLoading,
    error,
  } = useSelector((state) => state.Users);

  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    district: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [actionError, setActionError] = useState("");

  // ==========================================
  // GET DATA
  // ==========================================

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

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

  // ==========================================
  // RESET
  // ==========================================

  const resetForm = () => {
    setEmployeeData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      district: "",
    });

    setIsEditing(false);
    setEditEmployeeId(null);
    setShowForm(false);

    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const submitHandle = async (e) => {
    e.preventDefault();
    setActionError("");

    // Country validation
    if (!employeeData.country) {
      setActionError("Please select a country.");
      return;
    }

    // State validation
    if (!employeeData.state.trim()) {
      setActionError("Please enter state.");
      return;
    }

    // District validation
    if (!employeeData.district.trim()) {
      setActionError("Please enter district.");
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
            result.payload || "Failed to update employee."
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
            result.payload || "Failed to add employee."
          );
        }
      }
    } catch (err) {
      console.error(err);
      setActionError(
        "Something went wrong. Please try again."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

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
          result.payload || "Failed to delete employee."
        );
      }
    } catch (err) {
      console.error("Delete error:", err);

      setActionError(
        "Something went wrong while deleting employee."
      );
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const editHandle = (employee) => {
    setEmployeeData({
      name: employee.name || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      country: employee.country || "",
      state: employee.state || "",
      district: employee.district || "",
    });

    setIsEditing(true);
    setEditEmployeeId(employee.id);
    setShowForm(true);

    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  // ==========================================
  // ADD
  // ==========================================

  const addHandle = () => {
    setEmployeeData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      district: "",
    });

    setIsEditing(false);
    setEditEmployeeId(null);
    setShowForm(true);

    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  // ==========================================
  // SEARCH
  // ==========================================

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

      if (fetchEmployeeById.fulfilled.match(result)) {
        setSearchResult(result.payload);
      } else {
        setSearchResult("not-found");
      }
    } catch (err) {
      console.error(err);

      setSearchResult("not-found");
      setActionError("Search failed.");
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  // ==========================================
  // DISPLAY EMPLOYEES
  // ==========================================

  let displayedEmployees = employees;

  if (searchResult === "not-found") {
    displayedEmployees = [];
  } else if (searchResult) {
    const liveMatch = employees.find(
      (emp) => emp.id === searchResult.id
    );

    displayedEmployees = liveMatch ? [liveMatch] : [];
  }

  // ==========================================
  // UI
  // ==========================================

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
          {error}
        </div>
      )}

      {actionError && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          {actionError}
        </div>
      )}

      {/* COUNTRY LOAD ERROR */}

      {!countriesLoading && countries.length === 0 && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          Countries could not be loaded.
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <EmployeeForm
          employeeData={employeeData}
          handleChange={handleChange}
          submitHandle={submitHandle}
          resetForm={resetForm}
          isEditing={isEditing}
          loading={loading}
          countries={countries}
          countriesLoading={countriesLoading}
        />
      )}

      {/* SEARCH LOADING */}

      {employeeLoading && (
        <p className="text-center text-blue-600 font-semibold mt-5">
          Searching employee...
        </p>
      )}

      {/* MAIN LOADING */}

      {loading && !showForm && (
        <p className="text-center text-blue-600 font-semibold mt-5">
          Loading employees...
        </p>
      )}

      {/* NOT FOUND */}

      {searchResult === "not-found" && (
        <p className="text-center text-red-500 text-xl font-semibold mt-8">
          No employee found with ID: {searchTerm}
        </p>
      )}

      {/* EMPLOYEE LIST */}

      {!loading && displayedEmployees.length > 0 && (
        <EmployeeList
          employees={displayedEmployees}
          editHandle={editHandle}
          deleteHandle={deleteHandle}
        />
      )}

      {/* EMPTY */}

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