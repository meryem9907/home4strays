export async function GET() {
  try {
    console.log(`[DEBUG] NGO names API called`);
    console.log(`[DEBUG] BACKEND_URL env var: ${process.env.BACKEND_URL}`);
    
    const backendUrl = new URL("/available-ngo-names", process.env.BACKEND_URL);
    const fullUrl = backendUrl.toString();
    
    console.log(`[DEBUG] Calling backend URL: ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`[DEBUG] Backend response status: ${response.status}`);
    console.log(`[DEBUG] Backend response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[DEBUG] Backend error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[DEBUG] Backend response success, data keys:`, Object.keys(data));
    console.log(`[DEBUG] NGO names data length:`, data?.data?.length || 0);

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[DEBUG] NGO names API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 