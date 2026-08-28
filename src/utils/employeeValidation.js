const requiredTextFields = [
  ["name", "Please enter name."],
  ["department", "Please enter department."],
  ["state", "Please enter state."],
  ["district", "Please enter district."],
];

export const validateEmployee = (employee) => {
  for (const [field, message] of requiredTextFields) {
    if (typeof employee?.[field] !== "string" || !employee[field].trim()) {
      return message;
    }
  }

  if (!employee.country) {
    return "Please select a country.";
  }

  if (
    typeof employee.email !== "string" ||
    !employee.email.trim() ||
    !/^\S+@\S+\.\S+$/.test(employee.email)
  ) {
    return "Please enter a valid email.";
  }

  if (
    typeof employee.mobile !== "string" ||
    !/^\d{10}$/.test(employee.mobile)
  ) {
    return "Please enter a valid 10-digit mobile number.";
  }

  return "";
};
