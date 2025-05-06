import imageCompression from 'browser-image-compression';

export default async function compressImage(file : any) {
    const options = {
        maxSizeMB: 0.5, // Compress to under 0.5MB
        maxWidthOrHeight: 1024, // Resize dimensions
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Error compressing image:", error);
    }
}
