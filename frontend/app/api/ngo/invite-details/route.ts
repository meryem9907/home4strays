export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invite = searchParams.get("invite");
    
    if (!invite) {
      return new Response(JSON.stringify({ message: "Invite token is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const backendUrl = new URL("/ngo/invite-details", process.env.BACKEND_URL);
    backendUrl.searchParams.append("invite", invite);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    console.error("Get invite details API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 