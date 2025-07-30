export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invite } = body;
    
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ message: "No authorization header" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const backendUrl = new URL("/ngo/invite", process.env.BACKEND_URL);
    backendUrl.searchParams.append("invite", invite);

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Verify invite API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 