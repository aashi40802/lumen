import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "../services/storage.js";

// Generic state hook backed by Local Storage, with a validator so corrupt
// stored data is ignored in favour of the initial value.
export function useLocalStorage(key, initialValue, validate = () => true) {
  const [value, setValue] = useState(() => {
    const stored = readJSON(key, undefined);
    try {
      return stored !== undefined && validate(stored) ? stored : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  const set = useCallback((next) => {
    setValue((prev) => (typeof next === "function" ? next(prev) : next));
  }, []);

  return [value, set];
}

export default useLocalStorage;
