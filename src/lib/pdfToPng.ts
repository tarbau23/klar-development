import { convert } from "pdf-img-convert";

export async function convertPdfFileToBase64Array(pdfFile: File): Promise<string[]> {
  try {
    if (pdfFile.type !== "application/pdf") {
      throw new Error("Invalid file type. Please upload a PDF file.");
    }

    // Convert the PDF file to a buffer
    const arrayBuffer : any = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert the buffer to an array of base64 images
    const base64Array : any = await convert(buffer, { base64: true });

    return base64Array; // Return the array of base64 strings
  } catch (error) {
    console.error("Error converting PDF to Base64 array:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
