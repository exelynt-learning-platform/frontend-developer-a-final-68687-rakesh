import React from "react";

const EmployeeSearch = ({
  searchTerm,
  setSearchTerm,
  searchHandle,
  clearSearch,
  searchResult,
  showForm,
  addHandle,
}) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        searchHandle();
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <label
        htmlFor="employee-search"
        className="sr-only"
      >
        Search Employee ID
      </label>

      <input
        id="employee-search"
        type="text"
        placeholder="Search Employee ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 border-2 border-blue-400 rounded-full outline-none"
      />

      <button
        type="submit"
        aria-label="Search"
        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400"
      >
        Search
      </button>

      {searchResult && (
        <button
          type="button"
          onClick={clearSearch}
          className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold"
        >
          Clear
        </button>
      )}

      {!showForm && (
        <button
          type="button"
          onClick={addHandle}
          aria-label="Add Employee"
          className="px-7 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-400"
        >
          Add Employee
        </button>
      )}
    </form>
  );
};

export default EmployeeSearch;