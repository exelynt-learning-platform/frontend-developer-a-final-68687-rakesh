import React from "react";

const EmployeeList = ({
  employees,
  editHandle,
  deleteHandle,
}) => {
  return (
    <>

      {/* TABLE HEADER */}

      <div className="hidden lg:flex justify-around items-center border-b-2 border-orange-600 py-3 text-orange-600 text-lg font-bold mt-5">

        <p className="w-[80px] text-center">ID</p>
        <p className="w-[150px] text-center">Name</p>
        <p className="w-[220px] text-center">Email</p>
        <p className="w-[130px] text-center">Mobile</p>
        <p className="w-[130px] text-center">Country</p>
        <p className="w-[100px] text-center">Edit</p>
        <p className="w-[100px] text-center">Delete</p>

      </div>

      {/* EMPLOYEE LIST */}

      {employees.map((employee) => (
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

    </>
  );
};

export default EmployeeList;