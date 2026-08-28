import React from "react";

const EmployeeForm = ({
  employeeData,
  handleChange,
  submitHandle,
  resetForm,
  isEditing,
  loading,
  countries,
  countriesLoading,
}) => {
  // State and district are enabled only after country selection
  const countrySelected = employeeData.country !== "";

  return (
    <div className="w-full max-w-[500px] mx-auto border-2 border-blue-600 p-5 rounded-xl my-5">

      <h2 className="text-3xl font-bold text-blue-600 text-center mb-5">
        {isEditing ? "Edit Employee" : "Add Employee"}
      </h2>

      <form
        onSubmit={submitHandle}
        className="flex flex-col gap-3"
      >

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
          disabled={
            countriesLoading || countries.length === 0
          }
          className="px-5 py-2 border border-blue-600 rounded-full outline-none disabled:bg-gray-200"
        >
          <option value="">
            {countriesLoading
              ? "Loading Countries..."
              : countries.length === 0
              ? "Countries unavailable"
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
          placeholder={
            countrySelected
              ? "State"
              : "Select country first"
          }
          minLength="2"
          maxLength="50"
          required
          disabled={!countrySelected}
          className="px-5 py-2 border border-blue-600 rounded-full outline-none disabled:bg-gray-200"
        />

        {/* DISTRICT */}

        <input
          type="text"
          name="district"
          value={employeeData.district}
          onChange={handleChange}
          placeholder={
            countrySelected
              ? "District"
              : "Select country first"
          }
          minLength="2"
          maxLength="50"
          required
          disabled={!countrySelected}
          className="px-5 py-2 border border-blue-600 rounded-full outline-none disabled:bg-gray-200"
        />

        <div className="flex justify-center gap-3 mt-3">

          <button
            type="submit"
            disabled={
              loading ||
              !countrySelected ||
              !employeeData.state.trim() ||
              !employeeData.district.trim()
            }
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
  );
};

export default EmployeeForm;