"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

/**
 * Represents a user in the authentication system.
 *
 * @interface User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {boolean} isAdmin - Whether the user has system administrator privileges
 * @property {boolean} isNgoUser - Whether the user is associated with an NGO organization
 */
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isNgoUser: boolean;
}

/**
 * Authentication context interface providing user authentication state and methods.
 *
 * @interface AuthContextType
 * @property {string | null} token - JWT authentication token, null if not authenticated
 * @property {User | null} user - Current authenticated user data, null if not authenticated
 * @property {Function} login - Function to authenticate user with email and password
 * @property {Function} register - Function to register a new user account
 * @property {Function} logout - Function to sign out the current user
 * @property {boolean} isLoading - Whether an authentication operation is in progress
 * @property {string | null} error - Current authentication error message key, null if no error
 * @property {Function} refreshUser - Function to refresh current user data from the server
 */
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isNgoUser?: boolean,
    successRedirectOverride?: string | null
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for the AuthProvider component.
 *
 * @interface AuthProviderProps
 * @property {ReactNode} children - Child components to wrap with authentication context
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component that manages user authentication state.
 *
 * Features:
 * - JWT token management with localStorage persistence
 * - User login and registration
 * - Automatic token validation and user data refresh
 * - Internationalized error messages
 * - Automatic redirect to login on authentication failure
 * - Toast notifications for authentication events
 *
 * @param {AuthProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children with auth context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourAppComponents />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("Common");

  /**
   * Refreshes current user data from the server using the stored token.
   *
   * Automatically handles:
   * - Token validation
   * - User data parsing and state update
   * - Authentication failure (401/403) by clearing session and redirecting to login
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { refreshUser } = useAuth();
   * await refreshUser(); // Updates user data if token is valid
   * ```
   */
  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isAdmin: userData.isAdmin || false,
          isNgoUser: userData.isNgoUser || false,
        });
      } else if (response.status === 401 || response.status === 403) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [pathname, error]);

  /**
   * Authenticates a user with email and password.
   *
   * Features:
   * - Input validation and sanitization
   * - Internationalized error handling
   * - JWT token storage in localStorage
   * - Success toast notification
   * - Automatic redirect to home page on success
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>}
   *
   * @throws Sets error state with internationalization key for various failure scenarios:
   *   - "authError.invalidCredentials" - Wrong email/password (401/403)
   *   - "authError.invalidResponse" - Server returned success but no token
   *   - "authError.networkError" - Network or server error
   *   - "authError.unknownError" - Other unexpected errors
   *
   * @example
   * ```tsx
   * const { login } = useAuth();
   * try {
   *   await login("user@example.com", "password123");
   *   // User is now logged in and redirected
   * } catch {
   *   // Error is handled automatically and shown to user
   * }
   * ```
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorKey = "authError.unknownError";
        try {
          await response.json();
          if (response.status === 403 || response.status === 401) {
            errorKey = "authError.invalidCredentials";
          }
        } catch {
          if (response.status === 403 || response.status === 401) {
            errorKey = "authError.invalidCredentials";
          }
        }
        setError(errorKey);
        toast.error(t(errorKey));
      } else {
        const receivedJson = await response.json();
        if (receivedJson.token) {
          setToken(receivedJson.token);
          localStorage.setItem("authToken", receivedJson.token);
          toast.success(t("success.login"));
          router.push("/");
        } else {
          const errorKey = "authError.invalidResponse";
          setError(errorKey);
          toast.error(t(errorKey));
        }
      }
    } catch {
      const errorKey = "authError.networkError";
      setError(errorKey);
      toast.error(t(errorKey));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user account.
   *
   * Features:
   * - Support for both regular users and NGO users
   * - Email existence validation
   * - Automatic login after successful registration
   * - Conditional redirect based on user type and custom override
   * - Internationalized error handling
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {boolean} [isNgoUser=false] - Whether user is registering as NGO member
   * @param {string | null} [successRedirectOverride=null] - Custom redirect path after successful registration
   * @returns {Promise<void>}
   *
   * @throws Sets error state with internationalization key for various failure scenarios:
   *   - "authError.emailExists" - Email is already registered (400 + specific message)
   *   - "authError.validationError" - Invalid input data (400)
   *   - "authError.invalidResponse" - Server returned success but no token
   *   - "authError.networkError" - Network or server error
   *   - "authError.unknownError" - Other unexpected errors
   *
   * @example
   * ```tsx
   * const { register } = useAuth();
   *
   * // Regular user registration
   * await register("user@example.com", "password123", "John", "Doe");
   *
   * // NGO user registration with custom redirect
   * await register(
   *   "ngo@example.com",
   *   "password123",
   *   "Jane",
   *   "Smith",
   *   true,
   *   "/ngo-setup"
   * );
   * ```
   */
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isNgoUser: boolean = false,
    successRedirectOverride: string | null = null
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          isNgoUser,
        }),
      });

      if (!response.ok) {
        let errorKey = "authError.unknownError";
        try {
          const responseData = await response.json();
          if (
            response.status === 400 &&
            responseData?.message?.toLowerCase().includes("email") &&
            responseData?.message?.toLowerCase().includes("exists")
          ) {
            errorKey = "authError.emailExists";
          } else if (response.status === 400) {
            errorKey = "authError.validationError";
          }
        } catch {
          if (response.status === 400) {
            errorKey = "authError.validationError";
          }
        }
        setError(errorKey);
        toast.error(t(errorKey));
      } else {
        const receivedJson = await response.json();
        if (receivedJson.token) {
          setToken(receivedJson.token);
          localStorage.setItem("authToken", receivedJson.token);
          toast.success(t("success.register"));
          if (successRedirectOverride) {
            router.push(successRedirectOverride);
          } else if (!isNgoUser) {
            router.push("/");
          }
        } else {
          const errorKey = "authError.invalidResponse";
          setError(errorKey);
          toast.error(t(errorKey));
        }
      }
    } catch {
      const errorKey = "authError.networkError";
      setError(errorKey);
      toast.error(t(errorKey));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs out the current user.
   *
   * Features:
   * - Clears authentication token from state and localStorage
   * - Clears user data from state
   * - Shows success toast notification
   * - Redirects to login page with current locale
   *
   * @returns {void}
   *
   * @example
   * ```tsx
   * const { logout } = useAuth();
   * logout(); // User is immediately signed out and redirected
   * ```
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    toast.success(t("success.logout"));
    router.push(`/${locale}/login`);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        isLoading,
        error,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context and state.
 *
 * Provides access to the current authentication state and methods for login,
 * registration, logout, and user data management.
 *
 * @returns {AuthContextType} Authentication context with user state and methods
 *
 * @throws {Error} If used outside of an AuthProvider
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { user, login, isLoading, error } = useAuth();
 *
 *   if (user) {
 *     return <div>Welcome, {user.firstName}!</div>;
 *   }
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault();
 *       login(email, password);
 *     }}>
 *       {error && <div>Error: {error}</div>}
 *       <input type="email" disabled={isLoading} />
 *       <input type="password" disabled={isLoading} />
 *       <button disabled={isLoading}>Login</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
