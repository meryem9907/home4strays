export async function GET(
  request: Request,
  { params }: { params: Promise<{ caretakerId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "Authorization header required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error("Missing BACKEND_URL");
      return new Response(
        JSON.stringify({ message: "Server misconfiguration" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const {caretakerId} = await params;
    const response = await fetch(`${backendUrl}/caretaker/${caretakerId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON from backend:", e);
      return new Response(JSON.stringify({ message: "Invalid response from backend" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Caretaker GET API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
