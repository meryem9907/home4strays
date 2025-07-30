export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const location = searchParams.get("location");
    
    if (!query) {
      return new Response(JSON.stringify({ message: "Search query is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const backendUrl = new URL("/search-animal", process.env.BACKEND_URL);
    backendUrl.searchParams.append("q", query);
    if (location) backendUrl.searchParams.append("location", location);

    const response = await fetch(backendUrl.toString(), {
      headers: {
        "Accept-Language": searchParams.get("lang") || "en",
      },
    });

    if (response.status === 404) {
      return new Response(JSON.stringify({ message: "No results found", pets: [] }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search animals API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 