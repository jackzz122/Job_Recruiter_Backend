import { matchedData, validationResult } from "express-validator";
export const validateRequest = (requestData) => {
  const results = validationResult(requestData);
  if (!results.isEmpty()) {
    return { isValid: false, errors: results.array() };
  }
  return { isValid: true, validData: matchedData(requestData) };
};
