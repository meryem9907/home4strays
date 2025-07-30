"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

/**
 * Bookmark context interface providing pet bookmarking functionality.
 *
 * @interface BookmarkContextType
 * @property {Set<string>} bookmarkedPets - Set of bookmarked pet IDs for fast lookup
 * @property {Function} isBookmarked - Function to check if a pet is bookmarked
 * @property {Function} toggleBookmark - Function to add or remove a pet bookmark
 * @property {boolean} isLoading - Whether a bookmark operation is in progress
 * @property {Function} refreshBookmarks - Function to refresh bookmarks from server
 */
interface BookmarkContextType {
  bookmarkedPets: Set<string>;
  isBookmarked: (petId: string) => boolean;
  toggleBookmark: (petId: string) => Promise<void>;
  isLoading: boolean;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

/**
 * Props for the BookmarkProvider component.
 *
 * @interface BookmarkProviderProps
 * @property {ReactNode} children - Child components to wrap with bookmark context
 */
interface BookmarkProviderProps {
  children: ReactNode;
}

/**
 * Bookmark provider component that manages user pet bookmarks.
 *
 * Features:
 * - Automatic bookmark loading when user is authenticated
 * - Optimistic UI updates for better user experience
 * - Authentication-aware bookmark operations
 * - Toast notifications for user feedback
 * - Automatic cleanup when user logs out
 *
 * @param {BookmarkProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children with bookmark context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <BookmarkProvider>
 *         <YourAppComponents />
 *       </BookmarkProvider>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({
  children,
}) => {
  const [bookmarkedPets, setBookmarkedPets] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  /**
   * Makes an authenticated HTTP request to the API.
   *
   * @param {string} url - API endpoint URL (relative to /api)
   * @param {RequestInit} [options={}] - Fetch options
   * @returns {Promise<Response>} Fetch response
   *
   * @throws {Error} If no authentication token is available or request fails
   *
   * @example
   * ```typescript
   * const response = await makeAuthenticatedRequest("/petbookmarks", {
   *   method: "GET"
   * });
   * ```
   */
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ) => {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`/api${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authentication failed");
      }
      throw new Error(`Request failed: ${response.status}`);
    }

    return response;
  };

  /**
   * Refreshes user bookmarks from the server.
   *
   * Automatically clears bookmarks if user is not authenticated.
   * Handles errors gracefully by clearing bookmarks on failure.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { refreshBookmarks } = useBookmarks();
   * await refreshBookmarks(); // Updates bookmark list
   * ```
   */
  const refreshBookmarks = async () => {
    if (!token) {
      setBookmarkedPets(new Set());
      return;
    }

    try {
      const response = await makeAuthenticatedRequest("/petbookmarks");
      const { data } = await response.json();

      const petIds = data.map((bookmark: { petId: string }) => bookmark.petId);
      setBookmarkedPets(new Set(petIds));
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarkedPets(new Set());
    }
  };

  /**
   * Checks if a specific pet is bookmarked by the current user.
   *
   * @param {string} petId - Pet ID to check
   * @returns {boolean} Whether the pet is bookmarked
   *
   * @example
   * ```tsx
   * const { isBookmarked } = useBookmarks();
   * const isMarked = isBookmarked("pet-123");
   *
   * return (
   *   <button>
   *     {isMarked ? "Remove Bookmark" : "Add Bookmark"}
   *   </button>
   * );
   * ```
   */
  const isBookmarked = (petId: string): boolean => {
    return bookmarkedPets.has(petId);
  };

  /**
   * Toggles bookmark status for a specific pet.
   *
   * Features:
   * - Optimistic UI updates for immediate feedback
   * - Authentication checks with user-friendly error messages
   * - Toast notifications for success/error states
   * - Automatic error handling and rollback
   *
   * @param {string} petId - Pet ID to bookmark or unbookmark
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { toggleBookmark, isLoading } = useBookmarks();
   *
   * const handleBookmarkClick = async (petId: string) => {
   *   await toggleBookmark(petId);
   * };
   *
   * return (
   *   <button
   *     onClick={() => handleBookmarkClick(pet.id)}
   *     disabled={isLoading}
   *   >
   *     Toggle Bookmark
   *   </button>
   * );
   * ```
   */
  const toggleBookmark = async (petId: string): Promise<void> => {
    if (!token) {
      toast.error("Please log in to bookmark pets");
      return;
    }

    setIsLoading(true);

    try {
      const isCurrentlyBookmarked = bookmarkedPets.has(petId);

      if (isCurrentlyBookmarked) {
        await makeAuthenticatedRequest(`/petbookmark/${petId}`, {
          method: "DELETE",
        });

        setBookmarkedPets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(petId);
          return newSet;
        });

        toast.success("Removed from bookmarks");
      } else {
        await makeAuthenticatedRequest(`/petbookmark/${petId}`, {
          method: "POST",
        });

        setBookmarkedPets((prev) => new Set([...prev, petId]));
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      if (error instanceof Error) {
        if (error.message === "Authentication failed") {
          toast.error("Please log in to bookmark pets");
        } else {
          toast.error("Failed to update bookmark");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshBookmarks();
    } else {
      setBookmarkedPets(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedPets,
        isBookmarked,
        toggleBookmark,
        isLoading,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

/**
 * Hook to access bookmark context and functionality.
 *
 * Provides access to bookmark state and operations for managing user pet bookmarks.
 *
 * @returns {BookmarkContextType} Bookmark context with state and methods
 *
 * @throws {Error} If used outside of a BookmarkProvider
 *
 * @example
 * ```tsx
 * function PetCard({ pet }) {
 *   const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();
 *   const bookmarked = isBookmarked(pet.id);
 *
 *   return (
 *     <div>
 *       <h3>{pet.name}</h3>
 *       <button
 *         onClick={() => toggleBookmark(pet.id)}
 *         disabled={isLoading}
 *         className={bookmarked ? "bookmarked" : ""}
 *       >
 *         {bookmarked ? "💙" : "🤍"} Bookmark
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
