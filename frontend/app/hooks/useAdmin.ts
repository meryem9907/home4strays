import { useAccessControl } from "@/contexts/AccessControlContext";

/**
 * Custom hook for checking administrator privileges and access rights.
 *
 * Provides convenient access to admin-specific permissions and status checks.
 * This hook abstracts the access control logic for administrator functionality.
 *
 * @returns {Object} Object containing admin status and access methods
 * @returns {boolean} returns.isAdmin - Whether the current user has admin privileges
 * @returns {boolean} returns.hasAdminAccess - Whether the current user can access admin features (alias for isAdmin)
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { isAdmin, hasAdminAccess } = useAdmin();
 *
 *   if (!isAdmin) {
 *     return <AccessDenied message="Admin access required" />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Admin Panel</h1>
 *       {hasAdminAccess && <NGOVerificationSection />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ConditionalAdminButton() {
 *   const { isAdmin } = useAdmin();
 *
 *   return isAdmin ? (
 *     <button onClick={handleAdminAction}>
 *       Admin Action
 *     </button>
 *   ) : null;
 * }
 * ```
 */
export const useAdmin = () => {
  const { permissions } = useAccessControl();

  return {
    isAdmin: permissions.canAccessNGOVerification,
    hasAdminAccess: permissions.canAccessNGOVerification,
  };
};
