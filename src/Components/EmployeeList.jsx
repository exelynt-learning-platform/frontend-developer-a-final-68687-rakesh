
import React from "react";
import EmployeeField from "./EmployeeField";

const EmployeeList = ({
  employees,
  editHandle,
  deleteHandle,
}) => {
  return (
    <>
      <div className="hidden lg:flex justify-around items-center border-b-2 border-orange-600 py-3 text-orange-600 text-lg font-bold mt-5">

        <p className="w-[80px] text-center">ID</p>
        <p className="w-[150px] text-center">Name</p>
        <p className="w-[220px] text-center">Email</p>
        <p className="w-[130px] text-center">Mobile</p>
        <p className="w-[130px] text-center">Country</p>
        <p className="w-[100px] text-center">Edit</p>
        <p className="w-[100px] text-center">Delete</p>

      </div>

      {employees.map((employee) => (
        <div
          key={employee.id}
          className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-3 border-b-2 border-blue-600 py-4 mt-3"
        >

          <EmployeeField label="ID" value={employee.id} field="id" />
          <EmployeeField label="Name" value={employee.name} field="name" />
          <EmployeeField label="Email" value={employee.email} field="email" breakAll />
          <EmployeeField label="Mobile" value={employee.mobile} field="mobile" />
          <EmployeeField label="Country" value={employee.country} field="country" />

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

