   import  express  from "express";
 export const cartsRouter = express.Router();
import { cartController } from "../controller/carts.controller.js";
import { isCart, isNotOwner, isUser } from "../middleware/auth.js";


 cartsRouter.post('/' ,isUser,  cartController.creatCart);
 cartsRouter.post("/:cid/product/:pid" ,isUser,isCart,isNotOwner, cartController.addProductToCart);
 cartsRouter.delete("/:cid/product/:pid" ,isUser,isCart, cartController.deletOneProductbyCart);
 cartsRouter.get("/:cid" ,isUser, isCart, cartController.getById);
 cartsRouter.post("/:cid/purchase/",isUser,isCart, cartController.purchase);
 cartsRouter.get("/" , cartController.getCarts);
