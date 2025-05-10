import { apiResponse } from "../helper/response.helper.js";
export const handleError = (error, _req, res, _next) => {
  const statusCode = error.status || error.statusCode || 500;
  const message = error.message || "Server error.";

  const response = apiResponse.error(message, statusCode);
  return res.status(statusCode).json(response.body);
};

export const handleNotFound = (req, res) => {
  const response = apiResponse.notFound("API resource not found.");
  return res.status(response.status).json(response.body);
};
