import { useState } from "react";

/**
 * Custom hook for geolocation-based filtering support.
 *
 * This hook provides functionality to access the user's current location
 * and extract country and city information for use in location-based filtering.
 * It integrates with the browser's Geolocation API and external geocoding services.
 *
 * @returns {Object} Geolocation state and control functions
 * @property {string | null} country - Detected country name, null if not available
 * @property {string | null} location - Detected city/location string, null if not available
 * @property {Function} getLocation - Function to trigger location detection
 *
 * @example
 * ```tsx
 * function LocationFilter() {
 *   const { country, location, getLocation } = useGeoLocation();
 *
 *   const handleUseCurrentLocation = async () => {
 *     await getLocation();
 *     if (country && location) {
 *       setFilters(prev => ({
 *         ...prev,
 *         location: {
 *           country: [country],
 *           city: location
 *         }
 *       }));
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleUseCurrentLocation}>
 *       <LocateFixed size={16} />
 *       Use Current Location
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with filter component
 * function AnimalFilter() {
 *   const {
 *     getLocation: fetchGeoLocation,
 *     country: fetchedGeoCountry,
 *     location: fetchedGeoCityString,
 *   } = useGeoLocation();
 *
 *   const handleAutoFillLocation = async () => {
 *     await fetchGeoLocation();
 *     onFilterChange({
 *       location: {
 *         country: fetchedGeoCountry ? [fetchedGeoCountry] : [],
 *         city: fetchedGeoCityString || "",
 *       },
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleAutoFillLocation}>
 *         Auto-detect Location
 *       </button>
 *       {fetchedGeoCountry && (
 *         <span>Detected: {fetchedGeoCityString}, {fetchedGeoCountry}</span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useGeoLocation = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  /**
   * Requests the user's current location and extracts geographic information.
   *
   * This function uses the browser's Geolocation API to get the user's current
   * coordinates, then performs reverse geocoding to determine the country and
   * city. It handles permission requests, loading states, and error scenarios.
   *
   * Process:
   * 1. Request geolocation permission from browser
   * 2. Get current coordinates (latitude/longitude)
   * 3. Perform reverse geocoding to get address information
   * 4. Extract country and city from geocoding results
   * 5. Update state with detected location information
   *
   * @returns {Promise<void>} Promise that resolves when location detection completes
   *
   * @throws {Error} Various geolocation errors:
   *   - Permission denied by user
   *   - Position unavailable (GPS/network issues)
   *   - Request timeout
   *   - Geocoding service failures
   *
   * @example
   * ```tsx
   * const { getLocation } = useGeoLocation();
   *
   * const handleLocationRequest = async () => {
   *   try {
   *     await getLocation();
   *     console.log("Location detected successfully");
   *   } catch (error) {
   *     console.error("Failed to detect location:", error);
   *   }
   * };
   * ```
   */
  const getLocation = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Perform reverse geocoding to get address information
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (response.ok) {
              const data = await response.json();
              setCountry(data.countryName || null);
              setLocation(data.city || data.locality || null);
            } else {
              console.warn("Geocoding service failed, using coordinates only");
              setCountry(null);
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }

            resolve();
          } catch (geocodingError) {
            console.warn("Geocoding failed:", geocodingError);
            // Fallback to coordinates if geocoding fails
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            resolve();
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  return { country, location, getLocation };
};
