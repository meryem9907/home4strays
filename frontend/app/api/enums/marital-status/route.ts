export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    const backendUrl = new URL("/enum", process.env.BACKEND_URL);
    backendUrl.searchParams.append("types", "maritalStatus");

    const response = await fetch(backendUrl.toString(), {
      headers: {
        "Accept-Language": lang,
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
    console.error("Marital status enum API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
