export async function GET() {
  try {
    const backendUrl = new URL("/enum", process.env.BACKEND_URL);
    backendUrl.searchParams.append("types", "localityType");

    const response = await fetch(backendUrl.toString(), {
      headers: {
        "Accept-Language": "en",
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
    console.error("Locality type enum API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 