import multer from "multer";
import path from "path";
import nodemailer from 'nodemailer'

const storage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,(path.join(__dirname, `public/${folder}`)) );
    },
    filename: (req, file, cb) => {
      const fieldName = file.fieldname; // Obtén el nombre del campo
      const extension = path.extname(file.originalname); // Obtén la extensión del archivo original
      const timestamp = Date.now(); // Obtén la marca de tiempo actual en milisegundos
      const filename = `${fieldName}-${timestamp}${extension}`; // Combina nombre del campo, marca de tiempo y extensión
      cb(null, filename);
    },
  });
};

export const uploadDocument = multer({ storage: storage('documents') });
export const uploadProfile = multer({ storage: storage('profiles') });

// Middleware de Multer para archivos de producto
export const uploadProduct = multer({ storage: storage('products') });

// Middleware de Multer para archivos de documento

export const optionalFileUpload = (req, res, next) => {
  uploadProduct.single('thumbnail')(req, res, (err) => {
    // Ignorar errores y continuar incluso si no se proporciona un archivo
    next();
  });
};
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
 const dirnameUtils = path.dirname(__filename);
export const __dirname =  path.resolve(dirnameUtils, "..");


import { connect } from "mongoose";
import config from "../config/config.js";

// CONECTAR MONGO
export async function connectMongo() {
  
  try {
    await connect(
      config.mongoUrl
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
//hash
import bcrypt from 'bcrypt';
import { title } from "process";
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

export const transport = nodemailer.createTransport({
service: 'gmail',
tls: {
  rejectUnauthorized: false
},
port:587,
auth:{
  user:'francohugoamador25@gmail.com',
  pass:config.googlePass
}
})

import {faker} from "@faker-js/faker"
export const generateProducts = () =>{
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    id:faker.database.mongodbObjectId(),
    image: faker.image.url()

  }

}