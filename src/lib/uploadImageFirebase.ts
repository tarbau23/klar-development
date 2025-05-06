import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {storage} from './firebsae'

export const uploadImageFirebase = async (file: File): Promise<string> => {
  // console.log(file)
  if (!file) {
    throw new Error("No file provided");
  }

  const fileRef = ref(storage, `images/${Date.now()}-${file.name}`);
  try {
    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
