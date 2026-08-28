import React from "react";

const stylesByTone = {
  error: "bg-red-100 text-red-600",
  success: "bg-green-100 text-green-700",
};

const FeedbackMessage = ({ children, tone = "error" }) => (
  <div
    role="alert"
    className={`mt-4 p-3 text-center rounded-lg ${
      stylesByTone[tone] || stylesByTone.error
    }`}
  >
    {children}
  </div>
);

export default FeedbackMessage;
