import { plainToInstance } from "class-transformer";
import * as changeCase from "change-case";

/**
 * Formats a time string in "HH:MM:SS" format with leading zeros for each component.
 * This function ensures consistent time string formatting by padding each time unit
 * to two digits. It is designed to work with time strings split into hour, minute,
 * and second components.
 *
 * @param time - A string representing time in "HH:MM:SS" format
 * @returns A string formatted as "HH:MM:SS" with leading zeros for each component
 */
export function formatTime(time: string): string {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Recursively converts object keys to camelCase format while preserving nested structures.
 * This function handles arrays and objects, converting keys to camelCase while maintaining
 * the original data structure. Dates are preserved as-is, and nested objects/arrays are processed recursively.
 *
 * @param obj - The input object or array to process. Can be any type including nested objects/arrays.
 * @returns A new object with keys converted to camelCase, preserving original data types.
 */
export function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToCamelCase(v));
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[changeCase.camelCase(key)] =
        value instanceof Date ? value : convertKeysToCamelCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
}
