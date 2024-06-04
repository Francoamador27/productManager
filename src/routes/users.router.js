import  express  from "express";
 export const usersRouter = express.Router();
import { userController } from "../controller/user.controller.js";
import { uploadDocument } from "../utils/utils.js";
import {  isAdmin, isUser } from "../middleware/auth.js";

usersRouter.get("/",isAdmin, userController.getAll);
usersRouter.get('/:email', userController.getOnebyEmail);
usersRouter.delete('/:id',isAdmin, userController.deletOne);
usersRouter.delete('/oldconection',isAdmin, userController.deletOldConection);
usersRouter.put("/:id", userController.updateOne);
usersRouter.put("/premium/:id",isAdmin, userController.updatePremium);
usersRouter.post("/:id/documents",isUser, uploadDocument.fields([
    { name: 'dni', maxCount: 1 },
    { name: 'domicilio', maxCount: 1 },
    { name: 'cuenta', maxCount: 1 },
  ]), userController.uploadDocuments);
  
