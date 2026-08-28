import React from "react";

const widthClasses = {
  id: "lg:w-[80px]",
  name: "lg:w-[150px]",
  email: "lg:w-[220px]",
  mobile: "lg:w-[130px]",
  country: "lg:w-[130px]",
};

const EmployeeField = ({ label, value, field, breakAll = false }) => (
  <p
    className={`${widthClasses[field]} text-center font-semibold${
      breakAll ? " break-all" : ""
    }`}
  >
    <span className="lg:hidden font-bold">
      {label}: {" "}
    </span>
    {value ?? "-"}
  </p>
);

export default EmployeeField;
