"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

/**
 * Defines the different user role types in the application.
 *
 * @type {UserType}
 * @value "Caretaker" - Users who can adopt/care for animals
 * @value "NGOMember" - Regular members of NGO organizations
 * @value "NGOAdmin" - Administrators of NGO organizations
 * @value null - No specific role assigned or unauthenticated user
 */
export type UserType = "Caretaker" | "NGOMember" | "NGOAdmin" | null;

/**
 * Represents the completion status of user profiles and verification state.
 *
 * @interface ProfileStatus
 * @property {UserType} userType - The user's assigned role type
 * @property {boolean} isCaretakerComplete - Whether caretaker profile is fully completed
 * @property {boolean} isNGOMemberComplete - Whether NGO member profile is fully completed
 * @property {boolean} isNGOComplete - Whether NGO organization profile is fully completed
 * @property {boolean} isNGOVerified - Whether NGO organization is verified by administrators
 * @property {boolean} needsCompletion - Whether user needs to complete profile setup
 * @property {string | null} completionStep - Next step required for profile completion
 * @property {string} [ngoId] - ID of associated NGO organization (if applicable)
 */
interface ProfileStatus {
  userType: UserType;
  isCaretakerComplete: boolean;
  isNGOMemberComplete: boolean;
  isNGOComplete: boolean;
  isNGOVerified: boolean;
  needsCompletion: boolean;
  completionStep: string | null;
  ngoId?: string;
}

/**
 * User profile context interface providing profile status and management functions.
 *
 * @interface UserProfileContextType
 * @property {ProfileStatus | null} profileStatus - Current user's profile completion status
 * @property {boolean} isLoading - Whether profile status is being fetched
 * @property {string | null} error - Current error message, null if no error
 * @property {Function} refreshStatus - Function to refresh profile status from server
 * @property {Function} getUserType - Function to get current user's role type
 * @property {Function} needsProfileCompletion - Function to check if profile needs completion
 * @property {Function} getNgoId - Function to get associated NGO ID
 */
interface UserProfileContextType {
  profileStatus: ProfileStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  getUserType: () => UserType;
  needsProfileCompletion: () => boolean;
  getNgoId: () => string | null;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

/**
 * Props for the UserProfileProvider component.
 *
 * @interface UserProfileProviderProps
 * @property {ReactNode} children - Child components to wrap with user profile context
 */
interface UserProfileProviderProps {
  children: ReactNode;
}

/**
 * NGO status interface for profile status computation.
 *
 * @interface NGOStatus
 * @property {boolean} [isNgoUser] - Whether user is associated with an NGO
 * @property {boolean} [hasNgoMembership] - Whether user has NGO membership
 * @property {boolean} [isNgoAdmin] - Whether user is an NGO administrator
 * @property {boolean} [needsNgoProfile] - Whether NGO profile setup is needed
 * @property {boolean} [hasNgoProfile] - Whether NGO profile exists
 * @property {boolean} [isNgoVerified] - Whether NGO is verified by administrators
 * @property {string} [ngoId] - ID of associated NGO organization
 */
interface NGOStatus {
  isNgoUser?: boolean;
  hasNgoMembership?: boolean;
  isNgoAdmin?: boolean;
  needsNgoProfile?: boolean;
  hasNgoProfile?: boolean;
  isNgoVerified?: boolean;
  ngoId?: string;
}

/**
 * Caretaker status interface for profile status computation.
 *
 * @interface CaretakerStatus
 * @property {boolean} [hasCaretakerProfile] - Whether caretaker profile exists
 * @property {boolean} [needsCaretakerProfile] - Whether caretaker profile setup is needed
 */
interface CaretakerStatus {
  hasCaretakerProfile?: boolean;
  needsCaretakerProfile?: boolean;
}

/**
 * Determines user role type based on authentication and profile status.
 *
 * Role Determination Logic:
 * - NGO users with admin membership → "NGOAdmin"
 * - NGO users with regular membership → "NGOMember"
 * - Non-NGO users with caretaker profile → "Caretaker"
 * - Others → null
 *
 * @param {Object | null} user - User authentication data
 * @param {boolean} [user.isNgoUser] - Whether user is NGO-associated
 * @param {NGOStatus | null} ngoStatus - NGO membership and verification status
 * @param {CaretakerStatus | null} caretakerStatus - Caretaker profile status
 * @returns {UserType} Determined user role type
 *
 * @example
 * ```typescript
 * const userType = determineUserType(
 *   { isNgoUser: true },
 *   { hasNgoMembership: true, isNgoAdmin: true },
 *   null
 * );
 * // Returns: "NGOAdmin"
 * ```
 */
const determineUserType = (
  user: { isNgoUser?: boolean } | null,
  ngoStatus: NGOStatus | null,
  caretakerStatus: CaretakerStatus | null
): UserType => {
  if (!user) return null;

  if (user.isNgoUser) {
    if (ngoStatus?.hasNgoMembership && ngoStatus?.isNgoAdmin) {
      return "NGOAdmin";
    } else if (ngoStatus?.hasNgoMembership) {
      return "NGOMember";
    }
    return null;
  } else {
    return caretakerStatus?.hasCaretakerProfile ? "Caretaker" : null;
  }
};

/**
 * Fetches and computes user profile status from multiple API endpoints.
 *
 * Features:
 * - Parallel fetching of NGO and caretaker status
 * - Graceful handling of missing or failed endpoints
 * - Automatic completion step determination
 * - Debug logging for profile status changes
 *
 * @param {string} token - JWT authentication token
 * @returns {Promise<ProfileStatus>} Complete profile status object
 *
 * @throws {Error} If token is invalid or network request fails
 *
 * @example
 * ```typescript
 * const status = await fetchProfileStatus("jwt-token-here");
 * console.log(status.needsCompletion); // true/false
 * console.log(status.completionStep); // "ngo-profile" | "caretaker-profile" | etc.
 * ```
 */
const fetchProfileStatus = async (token: string): Promise<ProfileStatus> => {
  const [ngoResponse, caretakerResponse] = await Promise.allSettled([
    fetch("/api/ngo-status", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("/api/caretaker-status", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  let ngoStatus = null;
  let caretakerStatus = null;

  if (ngoResponse.status === "fulfilled" && ngoResponse.value.ok) {
    ngoStatus = await ngoResponse.value.json();
  }

  if (caretakerResponse.status === "fulfilled" && caretakerResponse.value.ok) {
    caretakerStatus = await caretakerResponse.value.json();
  }

  const userType = determineUserType(
    { isNgoUser: ngoStatus?.isNgoUser },
    ngoStatus,
    caretakerStatus
  );

  const isCaretakerComplete = caretakerStatus?.hasCaretakerProfile || false;
  const isNGOMemberComplete = ngoStatus?.hasNgoMembership || false;
  const isNGOComplete = ngoStatus?.hasNgoProfile || false;
  const isNGOVerified = ngoStatus?.isNgoVerified || false;

  let needsCompletion = false;
  let completionStep = null;

  if (ngoStatus?.isNgoUser) {
    if (ngoStatus?.needsNgoProfile) {
      needsCompletion = true;
      completionStep = "ngo-profile";
      console.log("🏢 Setting completion needed: ngo-profile");
    } else if (!isNGOVerified && userType === "NGOAdmin") {
      needsCompletion = true;
      completionStep = "ngo-verification";
      console.log("🔍 Setting completion needed: ngo-verification");
    }
  } else {
    if (caretakerStatus?.needsCaretakerProfile) {
      needsCompletion = true;
      completionStep = "caretaker-profile";
      console.log("🐾 Setting completion needed: caretaker-profile");
    }
  }

  const finalStatus = {
    userType,
    isCaretakerComplete,
    isNGOMemberComplete,
    isNGOComplete,
    isNGOVerified,
    needsCompletion,
    completionStep,
    ngoId: ngoStatus?.ngoId,
  };

  console.log("🔍 Final Profile Status:", finalStatus);
  return finalStatus;
};

/**
 * User profile provider component that manages user profile status and completion tracking.
 *
 * Features:
 * - Automatic profile status fetching when user is authenticated
 * - React Query integration for caching and refetching
 * - Automatic cache invalidation when user changes
 * - Optimized stale-while-revalidate caching strategy
 *
 * @param {UserProfileProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children with user profile context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <UserProfileProvider>
 *         <YourAppComponents />
 *       </UserProfileProvider>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profileStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => fetchProfileStatus(token!),
    enabled: !!token && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  /**
   * Refreshes user profile status from the server.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { refreshStatus } = useUserProfile();
   * await refreshStatus(); // Fetches latest profile status
   * ```
   */
  const refreshStatus = async () => {
    await refetch();
  };

  /**
   * Gets the current user's role type.
   *
   * @returns {UserType} Current user's role type or null
   *
   * @example
   * ```tsx
   * const { getUserType } = useUserProfile();
   * const userType = getUserType();
   *
   * if (userType === "NGOAdmin") {
   *   return <NGOAdminPanel />;
   * }
   * ```
   */
  const getUserType = (): UserType => {
    return profileStatus?.userType || null;
  };

  /**
   * Checks if the current user needs to complete their profile setup.
   *
   * @returns {boolean} Whether profile completion is required
   *
   * @example
   * ```tsx
   * const { needsProfileCompletion } = useUserProfile();
   *
   * if (needsProfileCompletion()) {
   *   return <ProfileCompletionWizard />;
   * }
   * ```
   */
  const needsProfileCompletion = (): boolean => {
    return profileStatus?.needsCompletion || false;
  };

  /**
   * Gets the NGO ID associated with the current user.
   *
   * @returns {string | null} NGO ID or null if not associated with an NGO
   *
   * @example
   * ```tsx
   * const { getNgoId } = useUserProfile();
   * const ngoId = getNgoId();
   *
   * if (ngoId) {
   *   fetchNGODetails(ngoId);
   * }
   * ```
   */
  const getNgoId = (): string | null => {
    return profileStatus?.ngoId || null;
  };

  React.useEffect(() => {
    if (!user) {
      queryClient.clear();
    }
  }, [user, queryClient]);

  return (
    <UserProfileContext.Provider
      value={{
        profileStatus: profileStatus || null,
        isLoading,
        error: error?.message || null,
        refreshStatus,
        getUserType,
        needsProfileCompletion,
        getNgoId,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Hook to access user profile context and status.
 *
 * Provides access to user profile completion status, role information,
 * and profile management functions.
 *
 * @returns {UserProfileContextType} User profile context with status and methods
 *
 * @throws {Error} If used outside of a UserProfileProvider
 *
 * @example
 * ```tsx
 * function ProfileCompletionPrompt() {
 *   const { profileStatus, needsProfileCompletion, getUserType } = useUserProfile();
 *
 *   if (!needsProfileCompletion()) {
 *     return null;
 *   }
 *
 *   const userType = getUserType();
 *   const step = profileStatus?.completionStep;
 *
 *   return (
 *     <div>
 *       <h2>Complete Your {userType} Profile</h2>
 *       <p>Next step: {step}</p>
 *       <CompleteProfileButton step={step} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
