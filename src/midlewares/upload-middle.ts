import { ErrorRequestHandler } from "express";
import multer from "multer";

export const uploadErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    
  // Error dari Multer (misal file terlalu besar, field invalid)
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;    
  }

  // Error custom (fileFilter) atau lainnya
  if (err) {
    if (err.message === "Only .jpg, .jpeg, .png Jangan yang lain yak...") {
      res.status(400).json({
        message: "Invalid image format. Only JPG, JPEG, PNG allowed.",
      });
      return;  
    }

    res.status(400).json({ message: err.message });
    return; 
  }

  // No error → lanjut ke handler berikutnya woi
  next();
};
