import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: unwrap { success, message, data } envelope
api.interceptors.response.use(
  (response) => {
    // If the backend wraps in { success, message, data }, return as-is
    // Individual service functions will access response.data
    return response;
  },
  (error) => {
    // Extract the server error message from the response body
    const serverMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // Create a clean error with the server message
    const enhancedError = new Error(serverMessage);
    (enhancedError as Error & { status: number }).status =
      error.response?.status || 500;

    return Promise.reject(enhancedError);
  }
);

export default api;
