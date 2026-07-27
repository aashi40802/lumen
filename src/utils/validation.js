// Reusable, framework-agnostic validation helpers.
// Each validator returns an error string, or "" when the value is valid.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export function required(value, label = "This field") {
  return String(value ?? "").trim() ? "" : `${label} is required.`;
}

export function validateEmail(value) {
  if (!String(value).trim()) return "Email is required.";
  return isEmail(value) ? "" : "Enter a valid email address.";
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  return value.length >= 8 ? "" : "Password must be at least 8 characters.";
}

export function validateConfirm(value, other) {
  if (!value) return "Please confirm your password.";
  return value === other ? "" : "Passwords do not match.";
}

export function validateName(value) {
  const v = String(value).trim();
  if (!v) return "Full name is required.";
  return v.length >= 2 ? "" : "Enter your full name.";
}

// US-style ZIP: 5 digits or 5+4. Kept permissive but non-empty + numeric.
export function validatePostal(value) {
  const v = String(value).trim();
  if (!v) return "Postal code is required.";
  return /^\d{5}(-\d{4})?$/.test(v) ? "" : "Enter a valid postal code (e.g. 10001).";
}

export function validatePhone(value) {
  const v = String(value).trim();
  if (!v) return "Phone number is required.";
  return v.replace(/[^\d]/g, "").length >= 10 ? "" : "Enter a valid phone number.";
}

// ---- Simulated payment validation (format only; never processed or stored) ----
export function validateCardName(value) {
  return String(value).trim() ? "" : "Cardholder name is required.";
}
export function validateCardNumber(value) {
  const digits = String(value).replace(/\s+/g, "");
  if (!digits) return "Card number is required.";
  if (!/^\d{16}$/.test(digits)) return "Enter a 16-digit test card number.";
  return luhnValid(digits) ? "" : "This card number is invalid (demo Luhn check).";
}
export function validateExpiry(value) {
  const v = String(value).trim();
  const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return "Use MM/YY format.";
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return "Invalid month.";
  // Compare against a caller-provided "now" is overkill; use a fixed horizon.
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp.getTime() > referenceNow() ? "" : "Card has expired.";
}
export function validateCvc(value) {
  return /^\d{3,4}$/.test(String(value).trim()) ? "" : "Enter a 3–4 digit security code.";
}

// Luhn checksum (used to validate demo card numbers realistically).
export function luhnValid(number) {
  let sum = 0;
  let alt = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let n = Number(number[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// referenceNow is isolated so it is easy to reason about / stub in tests.
function referenceNow() {
  return Date.now();
}

// Format helpers for inputs
export function formatCardNumber(value) {
  return String(value).replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
export function formatExpiry(value) {
  const d = String(value).replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
}
