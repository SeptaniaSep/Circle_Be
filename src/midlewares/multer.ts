import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Konfigurasi tempat penyimpanan file
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../../uploads"),
//   filename: (_req, file, cb) => {
//     const cleanName = file.originalname.replace(/\s+/g, "-").toLowerCase();
//     cb(null, `${Date.now()}-${cleanName}`);
//   },
// });

// // Validasi jenis file yang diperbolehkan
// const fileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if ([".jpg", ".jpeg", ".png"].includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpg, .jpeg, .png allowed"));
//   }
// };

// // Middleware multer utama, tanpa batas ukuran global
// export const upload = multer({
//   storage,
//   fileFilter,
//   // ❌ fileSize global dihapus → supaya bisa custom per field
// });

// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (_req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });


const storage = multer.memoryStorage();

// filter jenis file
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});



export function checkCustomFileSize(req: Request, res: Response, next: NextFunction) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const avatar = files?.avatar?.[0];
  const banner = files?.banner?.[0];

  const maxAvatarSize = 1 * 1024 * 1024; // 1MB
  const maxBannerSize = 3 * 1024 * 1024; // 3MB

  if (avatar && avatar.size > maxAvatarSize) {
    res.status(400).json({ message: "Ukuran avatar maksimal 1MB" });
    return 
  } 

  if (banner && banner.size > maxBannerSize) {
    res.status(400).json({ message: "Ukuran banner maksimal 3MB" });
    return
  } 

  next();
}


