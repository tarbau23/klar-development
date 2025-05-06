import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

import { uploadImageFirebase } from "./uploadImageFirebase"; // Import the uploadImage function
import compressImage from "./compressImage";

export async function convertPdfToImagesAndUpload(pdfFile: any) {
  try {
    const pdf = await getDocument(await pdfFile.arrayBuffer()).promise;
    const imageUrls = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page: any = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 2 });

      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page into the canvas
      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;

      // Convert canvas to Blob (PNG format)
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob as Blob), "image/png")
      );

      // Wrap Blob into File
      const file = new File([blob], `page-${i + 1}.png`, { type: "image/png" });

      // Upload the image using the provided uploadImage function

      const compressedFile: any = await compressImage(file);

      // console.log(compressedFile.size);

      const uploadedUrl = await uploadImageFirebase(compressedFile);
      
      imageUrls.push(uploadedUrl);

      // Clean up canvas
      canvas.remove();
    }

    return imageUrls;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error("Failed to process PDF");
  }
}
