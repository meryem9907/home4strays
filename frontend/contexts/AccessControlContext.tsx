"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useUserProfile, UserType } from "./UserProfileContext";

/**
 * Defines the complete set of permissions available in the application.
 *
 * Each permission controls access to specific features and functionality
 * based on user roles and verification status.
 *
 * @interface PermissionSet
 * @property {boolean} canAccessAddAnimals - Can access animal creation forms (NGO members from verified NGOs)
 * @property {boolean} canAccessNGOVerification - Can access NGO verification admin panel (system admins only)
 * @property {boolean} canAccessAdminPanel - Can access system administration features (system admins only)
 * @property {boolean} canManageNGO - Can manage NGO settings and members (NGO admins with complete profiles)
 * @property {boolean} canViewCaretakerProfiles - Can view and browse caretaker profiles (caretakers with complete profiles)
 * @property {boolean} canBookmarkAnimals - Can bookmark animals for later viewing (caretakers with complete profiles)
 * @property {boolean} canCreateAnimals - Can create new animal listings (NGO members from verified NGOs)
 * @property {boolean} canEditOwnProfile - Can edit their own profile information (all authenticated users)
 */
interface PermissionSet {
  canAccessAddAnimals: boolean;
  canAccessNGOVerification: boolean;
  canAccessAdminPanel: boolean;
  canManageNGO: boolean;
  canViewCaretakerProfiles: boolean;
  canBookmarkAnimals: boolean;
  canCreateAnimals: boolean;
  canEditOwnProfile: boolean;
}

/**
 * Access control context interface providing permission checking and user role information.
 *
 * @interface AccessControlContextType
 * @property {PermissionSet} permissions - Complete set of user permissions
 * @property {UserType} userType - Current user's role type
 * @property {boolean} isSystemAdmin - Whether user has system administrator privileges
 * @property {boolean} isNGOAdmin - Whether user is an NGO administrator
 * @property {boolean} isNGOMember - Whether user is an NGO member
 * @property {boolean} isCaretaker - Whether user is a caretaker
 * @property {Function} hasRequiredAccess - Function to check if user has specific permission
 */
interface AccessControlContextType {
  permissions: PermissionSet;
  userType: UserType;
  isSystemAdmin: boolean;
  isNGOAdmin: boolean;
  isNGOMember: boolean;
  isCaretaker: boolean;
  hasRequiredAccess: (permission: keyof PermissionSet) => boolean;
}

const AccessControlContext = createContext<
  AccessControlContextType | undefined
>(undefined);

/**
 * Props for the AccessControlProvider component.
 *
 * @interface AccessControlProviderProps
 * @property {ReactNode} children - Child components to wrap with access control context
 */
interface AccessControlProviderProps {
  children: ReactNode;
}

/**
 * User interface for permission computation.
 *
 * @interface User
 * @property {boolean} [isAdmin] - Whether user has system administrator privileges
 */
interface User {
  isAdmin?: boolean;
}

/**
 * Profile status interface for permission computation.
 *
 * @interface ProfileStatus
 * @property {boolean} [isNGOVerified] - Whether user's NGO is verified by administrators
 * @property {boolean} [isNGOMemberComplete] - Whether NGO member profile is complete
 * @property {boolean} [isCaretakerComplete] - Whether caretaker profile is complete
 */
interface ProfileStatus {
  isNGOVerified?: boolean;
  isNGOMemberComplete?: boolean;
  isCaretakerComplete?: boolean;
}

/**
 * Computes user permissions based on authentication status, user type, and profile completion.
 *
 * Permission Logic:
 * - System Admins: Full access to admin features
 * - NGO Members/Admins: Can manage animals if from verified NGOs
 * - NGO Admins: Can manage NGO if profile is complete
 * - Caretakers: Can browse and bookmark animals if profile is complete
 * - All authenticated users: Can edit their own profiles
 *
 * @param {User | null} user - Current authenticated user
 * @param {UserType} userType - User's role type
 * @param {ProfileStatus | null} profileStatus - User's profile completion status
 * @returns {PermissionSet} Complete set of computed permissions
 *
 * @example
 * ```typescript
 * const permissions = computePermissions(
 *   { isAdmin: false },
 *   "NGOMember",
 *   { isNGOVerified: true, isNGOMemberComplete: true }
 * );
 * // Result: Can access animal creation, cannot access admin panel
 * ```
 */
const computePermissions = (
  user: User | null,
  userType: UserType,
  profileStatus: ProfileStatus | null
): PermissionSet => {
  const isSystemAdmin = user?.isAdmin || false;
  const isNGOVerified = profileStatus?.isNGOVerified || false;
  const isNGOMemberComplete = profileStatus?.isNGOMemberComplete || false;
  const isCaretakerComplete = profileStatus?.isCaretakerComplete || false;

  return {
    // System admin only
    canAccessNGOVerification: isSystemAdmin,
    canAccessAdminPanel: isSystemAdmin,

    // NGO Members from verified NGOs only
    canAccessAddAnimals:
      userType === "NGOMember" || userType === "NGOAdmin" || isNGOVerified,
    canCreateAnimals:
      userType === "NGOMember" || userType === "NGOAdmin" || isNGOVerified,

    // NGO Admins
    canManageNGO: userType === "NGOAdmin" && isNGOMemberComplete,

    // Caretakers
    canViewCaretakerProfiles: userType === "Caretaker" && isCaretakerComplete,
    canBookmarkAnimals: userType === "Caretaker" && isCaretakerComplete,

    // All authenticated users
    canEditOwnProfile: !!user,
  };
};

/**
 * Access control provider component that manages user permissions and role-based access.
 *
 * Features:
 * - Dynamic permission computation based on user authentication and profile status
 * - Role-based access control for different user types
 * - Integration with authentication and user profile contexts
 * - Memoized permission calculation for performance
 *
 * @param {AccessControlProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children with access control context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <UserProfileProvider>
 *         <AccessControlProvider>
 *           <YourAppComponents />
 *         </AccessControlProvider>
 *       </UserProfileProvider>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const { profileStatus, getUserType } = useUserProfile();

  const userType = getUserType();

  const permissions = useMemo(
    () => computePermissions(user, userType, profileStatus),
    [user, userType, profileStatus]
  );

  /**
   * Checks if the current user has a specific permission.
   *
   * @param {keyof PermissionSet} permission - Permission to check
   * @returns {boolean} Whether user has the requested permission
   *
   * @example
   * ```tsx
   * const { hasRequiredAccess } = useAccessControl();
   *
   * if (hasRequiredAccess('canCreateAnimals')) {
   *   return <CreateAnimalButton />;
   * }
   * ```
   */
  const hasRequiredAccess = (permission: keyof PermissionSet): boolean => {
    return permissions[permission];
  };

  return (
    <AccessControlContext.Provider
      value={{
        permissions,
        userType,
        isSystemAdmin: user?.isAdmin || false,
        isNGOAdmin: userType === "NGOAdmin",
        isNGOMember: userType === "NGOMember",
        isCaretaker: userType === "Caretaker",
        hasRequiredAccess,
      }}
    >
      {children}
    </AccessControlContext.Provider>
  );
};

/**
 * Hook to access access control context and permissions.
 *
 * Provides access to user permissions, role information, and permission checking functions.
 *
 * @returns {AccessControlContextType} Access control context with permissions and role info
 *
 * @throws {Error} If used outside of an AccessControlProvider
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { isSystemAdmin, hasRequiredAccess } = useAccessControl();
 *
 *   if (!isSystemAdmin) {
 *     return <AccessDenied />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Admin Panel</h1>
 *       {hasRequiredAccess('canAccessNGOVerification') && (
 *         <NGOVerificationPanel />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAccessControl = (): AccessControlContextType => {
  const context = useContext(AccessControlContext);
  if (context === undefined) {
    throw new Error(
      "useAccessControl must be used within an AccessControlProvider"
    );
  }
  return context;
};
