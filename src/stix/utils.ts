export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    throw new Error("crypto.randomUUID is not supported in this environment");
  }
}
