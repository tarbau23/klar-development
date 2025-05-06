import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { refnr } = await req.json();

    if (!refnr) {
      return NextResponse.json({ error: "Missing 'refnr'" }, { status: 400 });
    }

    // Encode refnr to Base64
    const encodedRefnr = Buffer.from(refnr).toString("base64");

    // Fetch job detail
    const res = await fetch(
      `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v3/jobdetails/${encodedRefnr}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-API-Key": "jobboerse-jobsuche",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch job details" },
        { status: res.status }
      );
    }

    const jobDetails = await res.json();
    return NextResponse.json(jobDetails);
  } catch (error) {
    console.error("Job detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
