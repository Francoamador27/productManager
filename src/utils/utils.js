import multer from "multer";
import path from "path";
import nodemailer from 'nodemailer'
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