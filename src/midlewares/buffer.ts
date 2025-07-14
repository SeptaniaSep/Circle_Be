import { Readable } from "stream";
import cloudinary from "../utils/cloudinary";

// helper upload dari buffer (tidak perlu path)
export function uploadBufferToCloudinary(name:string,buffer: Buffer, filename: string) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: name,
        public_id: filename,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

