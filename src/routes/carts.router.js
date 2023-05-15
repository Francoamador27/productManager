   import  express  from "express";
 export const cartsRouter = express.Router();
 import cartManager from "../cartManager.js";
 import { v4 as uuidv4 } from 'uuid';


 cartsRouter.post('/' ,  async (req, res) => {
   let id = uuidv4(); 
   await  cartManager.addCart(id)
   return res.status(201).json({message:"carrito creado ",
   data: id});

   });
   cartsRouter.post("/:cid/product/:pid" ,  async (req, res) => {
      const idCart = req.params.cid;
      const idProduct = req.params.pid;
      let  addProduct = await  cartManager.addPrdoductToCart(idCart,idProduct)
      return res.status(201).json(
         {data: addProduct});
   
      });

      cartsRouter.get("/:cid" ,  async (req, res) => {
         const idCart = req.params.cid;
         let  cartById = await  cartManager.getCartById(idCart);
         let productsById = cartById.products;
         return res.status(201).json(
            {MessageEvent:"producto-obtenido ",
            data:productsById});
      
         });