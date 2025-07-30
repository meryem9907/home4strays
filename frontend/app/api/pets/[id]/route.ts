export async function GET(request: Request, {params}: {params: Promise<{id: string}>}) {
  console.log(`[DEBUG] API Route: GET /api/pets/[id] called`);
  console.log(`[DEBUG] API Route: Request URL:`, request.url);
  
  try {
    const {id} = await params;
    console.log(`[DEBUG] API Route: Extracted ID:`, id);
    
    // Quick test to see if route is working
    if (id === 'test') {
      console.log(`[DEBUG] API Route: Test ID detected, returning test response`);
      return new Response(JSON.stringify({
        message: "API route is working!",
        id: id,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    const backendUrl = new URL(`/pet/${id}`, process.env.BACKEND_URL);
    
    console.log(`[DEBUG] API Route: Calling backend URL: ${backendUrl.toString()}`);
    console.log(`[DEBUG] API Route: BACKEND_URL env var: ${process.env.BACKEND_URL}`);
    console.log(`[DEBUG] API Route: Pet ID: ${id}`);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`[DEBUG] API Route: Backend response status: ${response.status}`);
    console.log(`[DEBUG] API Route: Backend response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 404) {
        const errorText = await response.text();
        console.log(`[DEBUG] API Route: Backend 404 response body:`, errorText);
        return new Response(JSON.stringify({message: "Pet not found"}), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      const errorText = await response.text();
      console.log(`[DEBUG] API Route: Backend error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[DEBUG] API Route: Backend response success, data keys:`, Object.keys(data));

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[DEBUG] API Route: Pet API error:", error);
    return new Response(JSON.stringify({message: "Internal server error"}), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 