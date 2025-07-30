/**
 * POST handler for user authentication.
 *
 * This API endpoint handles user login requests by forwarding credentials
 * to the backend authentication service and returning the response.
 *
 * Request Body:
 * - email (string): User's email address
 * - password (string): User's password
 *
 * Response:
 * - Success (200): Returns authentication token and user data
 * - Error (401/403): Invalid credentials
 * - Error (500): Server error
 *
 * @param {Request} request - HTTP request object containing login credentials
 * @returns {Promise<Response>} HTTP response with authentication result
 *
 * @example
 * ```javascript
 * // Client-side usage
 * const response = await fetch('/api/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     password: 'userpassword'
 *   })
 * });
 *
 * if (response.ok) {
 *   const { token, user } = await response.json();
 *   // Store token and redirect user
 * } else {
 *   // Handle authentication error
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Expected successful response format
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "user-123",
 *     "email": "user@example.com",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "isAdmin": false,
 *     "isNgoUser": false
 *   }
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const backendUrl = new URL("/login", process.env.BACKEND_URL);

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
