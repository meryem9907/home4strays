export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get("species");

    if (!species) {
      return new Response(JSON.stringify({ message: "Species parameter is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const backendUrl = new URL("/breeds", process.env.BACKEND_URL);
    backendUrl.searchParams.append("species", species);

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
    console.error("Breeds API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 