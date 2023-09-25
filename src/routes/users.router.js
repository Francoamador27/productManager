import  express  from "express";
 export const usersRouter = express.Router();
import { userController } from "../controller/user.controller.js";
import { uploadDocument } from "../utils/utils.js";
import {  isUser } from "../middleware/auth.js";

usersRouter.get("/", userController.getAll);
usersRouter.get('/:email', userController.getOnebyEmail);
usersRouter.delete('/:id', userController.deletOne);
usersRouter.put("/:id", userController.updateOne);
usersRouter.put("/premium/:id", userController.updatePremium);
usersRouter.post("/:id/documents",isUser, uploadDocument.fields([
    { name: 'dni', maxCount: 1 },
    { name: 'domicilio', maxCount: 1 },
    { name: 'cuenta', maxCount: 1 },
  ]), userController.uploadDocuments);
  
