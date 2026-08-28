
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmployees,
  fetchCountries,
  createEmployee,
  editEmployee,
  removeEmployee,
  fetchEmployeeById,
} from "../redux/userSlice";

import EmployeeForm from "./EmployeeForm";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeList from "./EmployeeList";
import FeedbackMessage from "./FeedbackMessage";

const emptyEmployee = {
  name: "",
  email: "",
  mobile: "",
  country: "",
  state: "",
  district: "",
  department: "",
};

const Users = () => {
  const dispatch = useDispatch();

  const {
    employees,
    countries,
    loading,
    countriesLoading,
    employeeLoading,
    error,
    countriesError,
  } = useSelector((state) => state.Users);

  const [employeeData, setEmployeeData] = useState(emptyEmployee);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const addEmployeeHandle = () => {
    setEmployeeData(emptyEmployee);
    setIsEditing(false);
    setEditId(null);
    setShowForm(true);
    setActionError("");
    setSuccessMessage("");
  };

  const editEmployeeHandle = (employee) => {
    setEmployeeData({
      name: employee.name || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      country: employee.country || "",
      state: employee.state || "",
      district: employee.district || "",
      department: employee.department || "",
    });

    setIsEditing(true);
    setEditId(employee.id);
    setShowForm(true);
    setActionError("");
    setSuccessMessage("");
  };

  const cancelHandle = () => {
    setEmployeeData(emptyEmployee);
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setActionError("");
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    setActionError("");
    setSuccessMessage("");

    try {
      let result;

      if (isEditing) {
        result = await dispatch(
          editEmployee({
            id: editId,
            employee: employeeData,
          })
        );

        if (editEmployee.fulfilled.match(result)) {
          setSuccessMessage("Employee updated successfully.");
          cancelHandle();
        } else {
          setActionError(
            result.payload || "Failed to update employee."
          );
        }
      } else {
        result = await dispatch(
          createEmployee(employeeData)
        );

        if (createEmployee.fulfilled.match(result)) {
          setSuccessMessage("Employee added successfully.");
          cancelHandle();
        } else {
          setActionError(
            result.payload || "Failed to add employee."
          );
        }
      }
    } catch (error) {
      setActionError("Something went wrong.");
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
    setSuccessMessage("");

    try {
      const result = await dispatch(removeEmployee(id));

      if (removeEmployee.fulfilled.match(result)) {
        setSuccessMessage(
          "Employee deleted successfully."
        );
      } else {
        setActionError(
          result.payload || "Failed to delete employee."
        );
      }
    } catch (error) {
      setActionError("Something went wrong.");
    }
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
        result.payload
      ) {
        setSearchResult(result.payload);
      } else {
        setSearchResult("not-found");
        setActionError(
          result.payload || "Employee not found."
        );
      }
    } catch (error) {
      setSearchResult("not-found");
      setActionError("Employee not found.");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(null);
    setActionError("");
  };

  let employeesToShow = employees || [];

  if (searchResult === "not-found") {
    employeesToShow = [];
  }

  if (
    searchResult &&
    typeof searchResult === "object"
  ) {
    employeesToShow = [searchResult];
  }

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b-2 border-blue-500 py-4">

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
          addHandle={addEmployeeHandle}
        />

      </div>

      {error && (
        <FeedbackMessage>
          {error}
        </FeedbackMessage>
      )}

      {actionError && (
        <FeedbackMessage>
          {actionError}
        </FeedbackMessage>
      )}

      {successMessage && (
        <FeedbackMessage tone="success">
          {successMessage}
        </FeedbackMessage>
      )}

      {countriesError && (
        <FeedbackMessage>
          Countries could not be loaded.
        </FeedbackMessage>
      )}

      {showForm && (
        <EmployeeForm
          employeeData={employeeData}
          handleChange={handleChange}
          submitHandle={submitHandle}
          resetForm={cancelHandle}
          isEditing={isEditing}
          loading={loading}
          countries={countries || []}
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

      {!loading &&
        employeesToShow.length > 0 && (
          <EmployeeList
            employees={employeesToShow}
            editHandle={editEmployeeHandle}
            deleteHandle={deleteHandle}
          />
        )}

      {!loading &&
        employeesToShow.length === 0 &&
        searchResult !== "not-found" && (
          <p className="text-center mt-8 text-gray-600 text-lg">
            No employees found.
          </p>
        )}

      {searchResult === "not-found" && (
        <p className="text-center mt-8 text-red-500 text-xl font-semibold">
          No employee found with ID: {searchTerm}
        </p>
      )}

    </div>
  );
};

export default Users;

