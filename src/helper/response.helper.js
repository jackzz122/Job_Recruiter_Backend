/*
 * @param {boolean} success - Trạng thái thành công
 * @param {string} message - Thông điệp trả về
 * @param {any} data - Dữ liệu trả về
 * @param {number} statusCode - Mã HTTP status
 */
function createResponse(
  success = true,
  message = "",
  data = null,
  statusCode = null
) {
  if (statusCode === null) {
    statusCode = success ? 200 : 400;
  }
  return {
    status: statusCode,
    body: {
      success,
      message,
      data,
    },
  };
}
export const apiResponse = {
  success: (data, message = "Operation successful") =>
    createResponse(true, message, data, 200),
  created: (data, message = "Resource created successfully") =>
    createResponse(true, message, data, 201),
  badRequest: (message = "Invalid request") =>
    createResponse(false, message, null, 400),
  notFound: (message = "Resource not found") =>
    createResponse(false, message, null, 404),
  notFoundList: (message = "Not found data") =>
    createResponse(true, message, [], 200),
  serverError: (message = "Server error") =>
    createResponse(false, message, null, 500),
  error: (message = "An error occurred", statusCode = 500) =>
    createResponse(false, message, null, statusCode),
};
