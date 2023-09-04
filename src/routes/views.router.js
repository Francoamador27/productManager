import  express  from "express";
export const viewsRouter = express.Router();
import { viewsController } from "../controller/views.controller.js";
import { isAdmin, isUser, isUseroPremium } from "../middleware/auth.js";


viewsRouter.get('/products', viewsController.getAll);
viewsRouter.get('/creatProduct',isUseroPremium, viewsController.creatProduct);
viewsRouter.get("/cart/:cid" ,isUser,  viewsController.getCardbyId)
viewsRouter.get("/carts/:cid" ,  viewsController.getCardbyId)
viewsRouter.get("/show-session" , viewsController.showSession )
viewsRouter.get("/mockingproducts" , viewsController.creatFake )
viewsRouter.get("/testing",viewsController.testingLoggers)

viewsRouter.get('/logout', viewsController.logout)

              
  
  
