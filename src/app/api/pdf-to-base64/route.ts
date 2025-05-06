import { NextRequest, NextResponse } from "next/server";
import { convert } from "pdf-img-convert";

export const config = {
  runtime: "nodejs", // Ensure Node.js runtime for file handling
};

export async function POST(req: NextRequest) {
  try {
    const buffer = await req.arrayBuffer();

    // Validate the buffer
    if (!buffer || buffer.byteLength === 0) {
      return NextResponse.json({ success: false, message: "No file uploaded or invalid file format." }, { status: 400 });
    }

    // Convert the PDF buffer to an array of base64 strings
    const base64Array = await convert(Buffer.from(buffer), { base64: true, scale: 2 });

    return NextResponse.json({ success: true, images: base64Array }, { status: 200 });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ success: false, message: "Failed to process the PDF.", error: String(error) }, { status: 500 });
  }
}
