export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "No authorization token" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const backendUrl = new URL("/my-pets", process.env.BACKEND_URL);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Accept-Language": lang,
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
    console.error("My pets API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
