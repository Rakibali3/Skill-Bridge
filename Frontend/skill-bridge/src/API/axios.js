import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      !Array.isArray(responseData)
    ) {
      const fieldErrors =
        responseData.fieldErrors &&
        typeof responseData.fieldErrors === "object"
          ? responseData.fieldErrors
          : {};

      // Keep field-level keys available for existing forms, while exposing
      // the structured error payload to newer components.
      error.response.data = {
        ...fieldErrors,
        ...responseData,
        fieldErrors,
      };
    }

    return Promise.reject(error);
  }
);

export default api;
