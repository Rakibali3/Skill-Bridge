export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data.general === "string" && data.general.trim()) {
      return data.general;
    }

    const fieldErrors = getApiFieldErrors(error);
    const firstFieldError = Object.values(fieldErrors).find(
      (message) => typeof message === "string" && message.trim()
    );

    if (firstFieldError) {
      return firstFieldError;
    }
  }

  if (error?.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Check your connection and try again.";
  }

  return fallback;
}

export function getApiFieldErrors(error) {
  const data = error?.response?.data;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  if (data.fieldErrors && typeof data.fieldErrors === "object") {
    return data.fieldErrors;
  }

  // Supports legacy validation responses such as { email: "Email is required" }.
  const metadataKeys = new Set([
    "timestamp",
    "status",
    "error",
    "message",
    "path",
    "general",
    "fieldErrors",
  ]);

  return Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) =>
        !metadataKeys.has(key) &&
        typeof value === "string"
    )
  );
}
