import  express  from "express";
export const viewsRouter = express.Router();
import { viewsController } from "../controller/views.controller.js";
import { checkOwner, iAdminoPremium, isAdmin, isUser } from "../middleware/auth.js";
import { validateQueryParameters } from "../middleware/checkQuery.js";


viewsRouter.get('/products',validateQueryParameters, viewsController.getAll);
viewsRouter.get('/creatProduct', iAdminoPremium, viewsController.creatProduct);
viewsRouter.get('/myProducts',iAdminoPremium, viewsController.getMyProducts);
viewsRouter.get('/bepremium',isUser, viewsController.bePremium);
viewsRouter.get('/editProduct/:id',iAdminoPremium,checkOwner, viewsController.editProductbyId);
viewsRouter.get('/orders/',isUser, viewsController.orders);
viewsRouter.get("/cart/:cid" ,isUser, viewsController.getCardbyId)
viewsRouter.get("/carts/:cid" ,  viewsController.getCardbyId)
viewsRouter.get("/show-session" , viewsController.showSession )
viewsRouter.get("/mockingproducts" , viewsController.creatFake )
viewsRouter.get("/testing",viewsController.testingLoggers)
viewsRouter.get("/users",isAdmin,viewsController.getAllUsers)

viewsRouter.get('/logout', viewsController.logout)

              
  
  
