// Dedicated Local Storage service. Every read is validated and guarded so
// corrupted or tampered data can never crash the app.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.warn(`[storage] Could not read "${key}":`, err);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] Could not write "${key}":`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[storage] Could not remove "${key}":`, err);
  }
}

// Read a value and validate it with a predicate; fall back if invalid.
export function readValidated(key, validate, fallback) {
  const value = readJSON(key, undefined);
  if (value === undefined) return fallback;
  try {
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
