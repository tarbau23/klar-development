import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'tmp', 'chatImages');

export async function POST(req: Request) {
  try {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get the file from the request FormData
    const formData = await req.formData();
    const file = formData.get('file') as Blob | any;

    if (!file) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    // Read the file content and save it to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // Return the URL of the uploaded file
    const fileUrl = `/tmp/chatImages/${fileName}`;
    return NextResponse.json({ url: process.env.NEXT_PUBLIC_SITE_URL+fileUrl });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}


























































// import { NextRequest, NextResponse } from "next/server"; // Correct import for NextResponse

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).single("file");

// let filePath : any;

// // Handler for the upload route
// export async function POST(req: any, res: any) {

//   upload(req, res, (err) => {
//     if (err) {
//       return NextResponse.json({ error: "Went wrong" }, { status: 500 });
//     }
//     filePath = req.file.path;
//   });
//   // Respond with the image URL
//   return NextResponse.json({ imageUrl: filePath }, { status: 200 });
// }










