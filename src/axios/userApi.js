import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1";

const EMPLOYEE_API = `${API_BASE_URL}/employee`;
const COUNTRY_API = `${API_BASE_URL}/country`;

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