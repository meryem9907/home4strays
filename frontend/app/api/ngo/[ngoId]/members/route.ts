import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ngoId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    const { ngoId } = await params;
    const backendUrl = process.env.BACKEND_URL;
    
    const response = await fetch(`${backendUrl}/ngo-members?ngoId=${ngoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": request.headers.get("Accept-Language") || "en",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying NGO members request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 