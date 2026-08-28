export const getErrorMessage = (error, defaultMessage) => {
  if (typeof error === "string") {
    return error;
  }

  const message =
    error?.message ||
    error?.response?.data?.message ||
    error?.data?.message;

  return typeof message === "string" && message.trim()
    ? message
    : defaultMessage;
};
