export async function GET() {
  const backendUrl = new URL("/species", process.env.BACKEND_URL);
  
  try {
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
    console.error("Species API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 