import  express  from "express";
 export const authRouter = express.Router();
import { ckeckUserPassword, isUser } from "../middleware/auth.js";
import passport from "passport";
import { authController } from "../controller/auth.controller.js";
import { validateRecaptcha } from "../middleware/recaptcha.js";

authRouter.get("/login", authController.renderLogin);

authRouter.post('/login',validateRecaptcha, passport.authenticate('login', { failureRedirect: '/auth/faillogin' }),authController.login);
 
authRouter.get("/perfil",isUser, authController.perfil);
    
authRouter.get('/logout', authController.logut)

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), authController.register);
          
authRouter.get('/failregister', authController.failRegister);

authRouter.get('/faillogin', authController.failLogin);
          
authRouter.get("/register", authController.renderRegister);
authRouter.get("/recover-email", authController.recoverEmail);

authRouter.post("/recover-email", authController.recoverSendEmail);
authRouter.get("/recover-pass", authController.recoverPass);
authRouter.post("/recover-pass", authController.recoverPassPost);
authRouter.put("/update-password",isUser,ckeckUserPassword, authController.updatePassword);