import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";

const conn = mongoose.connection;

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "image",
  });
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI!,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "image",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

export { upload, gfs };
