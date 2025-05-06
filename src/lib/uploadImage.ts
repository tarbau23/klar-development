const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type });
};

const uploadImage = async (blobUrl: string) => {
  // console.log(blobUrl)
  const blob = await fetch(blobUrl).then((res) => res.blob());

  const file = blobToFile(blob, "image.jpg"); // Create a File object from the Blob
  const formData = new FormData();
  formData.append("image", file); // Append the file to FormData

  const response = await fetch("/api/uploadImage", {
    method: "POST", // Ensure it's a POST request
    body: formData, // Send the FormData
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.imageUrl;
};

export default uploadImage;
