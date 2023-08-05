import  express  from "express";
 export const mailRouter = express.Router();
import { mailController } from "../controller/mail.controller.js";


mailRouter.get("/", mailController.sendEmail);
