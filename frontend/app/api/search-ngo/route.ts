import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const location = searchParams.get("location");

    if (!query) {
      return NextResponse.json(
        { message: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const backendUrl = new URL("/search-ngo", process.env.BACKEND_URL);
    backendUrl.searchParams.append("q", query);
    if (location) {
      backendUrl.searchParams.append("location", location);
    }

    const acceptLanguage = request.headers.get("accept-language") || "en";

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ ngos: [] }, { status: 200 });
      }
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in search-ngo API route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 