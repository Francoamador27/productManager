import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, (path.join(__dirname, "public/img")));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage });

import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import { connect } from "mongoose";

// CONECTAR MONGO
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://francohugoamador25:<password>@cluster0.ad24vck.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}


