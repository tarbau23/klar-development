function encodeImageToBase64(file : any) {
  return new Promise((resolve, reject) => {
    const reader : any = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
      resolve(base64String); // Resolve the promise with the base64 string
    };

    reader.onerror = reject;

    reader.readAsDataURL(file); // Start reading the file
  });
}