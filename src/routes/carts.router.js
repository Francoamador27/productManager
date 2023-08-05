   import  express  from "express";
 export const cartsRouter = express.Router();
import { cartController } from "../controller/carts.controller.js";
import { isUser } from "../middleware/auth.js";


 cartsRouter.post('/' ,isUser,  cartController.creatCart);
 cartsRouter.post("/:cid/product/:pid" ,isUser,  cartController.addProductToCart);
 cartsRouter.delete("/:cid/product/:pid" , cartController.deletOneProductbyCart);
 cartsRouter.get("/:cid" ,  cartController.getById);
 cartsRouter.post("/:cid/purchase/",isUser, cartController.purchase);
 cartsRouter.get("/" , cartController.getCarts);
