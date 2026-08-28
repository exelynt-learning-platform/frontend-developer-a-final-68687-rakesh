import axios from "axios";

const EMPLOYEE_API =
  "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee";

const COUNTRY_API =
  "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country";

// Get all employees
export const getEmployees = async () => {
  const res = await axios.get(EMPLOYEE_API);
  return res.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const res = await axios.get(`${EMPLOYEE_API}/${id}`);
  return res.data;
};

// Add employee
export const addEmployee = async (employee) => {
  const res = await axios.post(EMPLOYEE_API, employee);
  return res.data;
};

// Update employee
export const updateEmployee = async (id, employee) => {
  const res = await axios.put(`${EMPLOYEE_API}/${id}`, employee);
  return res.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  await axios.delete(`${EMPLOYEE_API}/${id}`);
  return id;
};

// Get countries
export const getCountries = async () => {
  const res = await axios.get(COUNTRY_API);
  return res.data;
};