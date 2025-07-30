/**
 * POST handler for user registration.
 *
 * This API endpoint handles new user registration requests by forwarding
 * user data to the backend registration service and returning the response.
 * Supports both regular user and NGO user registration.
 *
 * Request Body:
 * - email (string): User's email address
 * - password (string): User's password
 * - firstName (string): User's first name
 * - lastName (string): User's last name
 * - isNgoUser (boolean): Whether user is registering as NGO member
 *
 * Response:
 * - Success (201): Returns authentication token and user data
 * - Error (400): Invalid input data or email already exists
 * - Error (500): Server error
 *
 * @param {Request} request - HTTP request object containing registration data
 * @returns {Promise<Response>} HTTP response with registration result
 *
 * @example
 * ```javascript
 * // Regular user registration
 * const response = await fetch('/api/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'newuser@example.com',
 *     password: 'SecurePass123',
 *     firstName: 'Jane',
 *     lastName: 'Doe',
 *     isNgoUser: false
 *   })
 * });
 * ```
 *
 * @example
 * ```javascript
 * // NGO user registration
 * const response = await fetch('/api/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'ngo@organization.org',
 *     password: 'SecurePass123',
 *     firstName: 'John',
 *     lastName: 'Smith',
 *     isNgoUser: true
 *   })
 * });
 *
 * if (response.ok) {
 *   const { token, user } = await response.json();
 *   // User registered successfully, redirect to profile setup
 * } else if (response.status === 400) {
 *   const { message } = await response.json();
 *   // Handle validation errors (email exists, weak password, etc.)
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, isNgoUser } = body;

    const backendUrl = new URL("/register", process.env.BACKEND_URL);

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName, lastName, isNgoUser }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Register API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
