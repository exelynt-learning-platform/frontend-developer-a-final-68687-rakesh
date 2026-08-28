
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

  // ==========================================
  // FORM DATA
  // ==========================================

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

  // ==========================================
  // GET EMPLOYEES AND COUNTRIES
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

    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  // ==========================================
  // RESET FORM
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

    // Clear search after add/update/cancel
    setSearchTerm("");
    setSearchResult(null);
  };

  // ==========================================
  // ADD / UPDATE EMPLOYEE
  // ==========================================

  const submitHandle = async (e) => {
    e.preventDefault();

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
        }
      } else {
        const result = await dispatch(
          createEmployee(employeeData)
        );

        if (createEmployee.fulfilled.match(result)) {
          alert("Employee added successfully!");

          resetForm();
        }
      }
    } catch (error) {
      console.error("Employee operation failed:", error);
    }
  };

  // ==========================================
  // DELETE EMPLOYEE
  // ==========================================

  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    const result = await dispatch(removeEmployee(id));

    if (removeEmployee.fulfilled.match(result)) {
      alert("Employee deleted successfully!");
    }
  };

  // ==========================================
  // EDIT EMPLOYEE
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

    // Clear old search result when editing
    setSearchTerm("");
    setSearchResult(null);
  };

  // ==========================================
  // ADD BUTTON
  // ==========================================

  const addHandle = () => {
    // Clear any active search filter
    setSearchTerm("");
    setSearchResult(null);

    setIsEditing(false);
    setEditEmployeeId(null);

    setEmployeeData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      district: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // SEARCH BY ID
  // ==========================================

  const searchHandle = async () => {
    if (!searchTerm.trim()) {
      setSearchResult(null);
      return;
    }

    const result = await dispatch(
      fetchEmployeeById(searchTerm.trim())
    );

    if (fetchEmployeeById.fulfilled.match(result)) {
      setSearchResult(result.payload);
    } else {
      setSearchResult("not-found");
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(null);
  };

  // ==========================================
  // DISPLAY DATA
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
  // RETURN JSX
  // ==========================================

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto">

      {/* HEADER */}

      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 border-b-2 border-blue-500 py-4 px-4">

        <h2 className="text-2xl md:text-4xl font-bold text-blue-600">
          Employee Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Search Employee ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-5 py-2 border-2 border-blue-400 rounded-full outline-none"
          />

          <button
            onClick={searchHandle}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400"
          >
            Search
          </button>

          {searchResult && (
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold"
            >
              Clear
            </button>
          )}

          {!showForm && (
            <button
              onClick={addHandle}
              className="px-7 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400"
            >
              Add Employee
            </button>
          )}

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 text-center rounded-lg">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div className="w-full max-w-[500px] mx-auto border-2 border-blue-600 p-5 rounded-xl my-5">

          <h2 className="text-3xl font-bold text-blue-600 text-center mb-5">
            {isEditing ? "Edit Employee" : "Add Employee"}
          </h2>

          <form
            onSubmit={submitHandle}
            className="flex flex-col gap-3"
          >

            {/* NAME */}

            <input
              type="text"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
              placeholder="Name"
              minLength="2"
              maxLength="50"
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            />

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
              placeholder="Email"
              maxLength="100"
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            />

            {/* MOBILE */}

            <input
              type="tel"
              name="mobile"
              value={employeeData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              minLength="10"
              maxLength="10"
              pattern="[0-9]{10}"
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            />

            {/* COUNTRY */}

            <select
              name="country"
              value={employeeData.country}
              onChange={handleChange}
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            >
              <option value="">
                {countriesLoading
                  ? "Loading Countries..."
                  : "Select Country"}
              </option>

              {countries.map((country) => (
                <option
                  key={country.id}
                  value={country.name || country.country}
                >
                  {country.name || country.country}
                </option>
              ))}
            </select>

            {/* STATE */}

            <input
              type="text"
              name="state"
              value={employeeData.state}
              onChange={handleChange}
              placeholder="State"
              minLength="2"
              maxLength="50"
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            />

            {/* DISTRICT */}

            <input
              type="text"
              name="district"
              value={employeeData.district}
              onChange={handleChange}
              placeholder="District"
              minLength="2"
              maxLength="50"
              required
              className="px-5 py-2 border border-blue-600 rounded-full outline-none"
            />

            {/* BUTTONS */}

            <div className="flex justify-center gap-3 mt-3">

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400 disabled:bg-gray-400"
              >
                {loading
                  ? "Please wait..."
                  : isEditing
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-7 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-400"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
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

      {/* TABLE HEADER */}

      {!loading && displayedEmployees.length > 0 && (
        <div className="hidden lg:flex justify-around items-center border-b-2 border-orange-600 py-3 text-orange-600 text-lg font-bold mt-5">

          <p className="w-[80px] text-center">ID</p>

          <p className="w-[150px] text-center">Name</p>

          <p className="w-[220px] text-center">Email</p>

          <p className="w-[130px] text-center">Mobile</p>

          <p className="w-[130px] text-center">Country</p>

          <p className="w-[100px] text-center">Edit</p>

          <p className="w-[100px] text-center">Delete</p>

        </div>
      )}

      {/* EMPLOYEE LIST */}

      {!loading &&
        displayedEmployees.length > 0 &&
        displayedEmployees.map((employee) => (

          <div
            key={employee.id}
            className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-3 border-b-2 border-blue-600 py-4 mt-3"
          >

            <p className="lg:w-[80px] text-center font-semibold">
              <span className="lg:hidden font-bold">
                ID:{" "}
              </span>
              {employee.id}
            </p>

            <p className="lg:w-[150px] text-center font-semibold">
              <span className="lg:hidden font-bold">
                Name:{" "}
              </span>
              {employee.name}
            </p>

            <p className="lg:w-[220px] text-center font-semibold break-all">
              <span className="lg:hidden font-bold">
                Email:{" "}
              </span>
              {employee.email}
            </p>

            <p className="lg:w-[130px] text-center font-semibold">
              <span className="lg:hidden font-bold">
                Mobile:{" "}
              </span>
              {employee.mobile}
            </p>

            <p className="lg:w-[130px] text-center font-semibold">
              <span className="lg:hidden font-bold">
                Country:{" "}
              </span>
              {employee.country}
            </p>

            <button
              onClick={() => editHandle(employee)}
              className="lg:w-[100px] px-6 py-1 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              onClick={() => deleteHandle(employee.id)}
              className="lg:w-[100px] px-6 py-1 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-400"
            >
              Delete
            </button>

          </div>
        ))}

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

