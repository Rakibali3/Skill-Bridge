const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export default function getApiErrorMessage(error, fallback = FALLBACK_MESSAGE) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }

    if (typeof data.general === "string" && data.general.trim()) {
      return data.general.trim();
    }

    const fieldError = Object.values(data).find(
      (value) => typeof value === "string" && value.trim()
    );

    if (fieldError) {
      return fieldError.trim();
    }
  }

  if (!error?.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return fallback;
}
