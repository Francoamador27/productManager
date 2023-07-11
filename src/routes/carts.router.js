   import  express  from "express";
 export const cartsRouter = express.Router();
import { CartsService } from "../services/carts.services.js";
import { UserModel } from "../DAO/models/user.models.js";

 const Carts = new CartsService()


 cartsRouter.post('/' ,  async (req, res) => {
   let cartCreate = await  Carts.createOne()
   if(req?.session?.user){
      let userSession = req.session.user
      let email = userSession.email
       let userMongo = await UserModel.findOne({ email});
      req.session.user.cart= cartCreate._id;
      await  UserModel.updateOne(
    { email },
     { $set: { cart: cartCreate._id } })
        }
   return res.status(201).json({
      message:"carrito creado ",
      data: cartCreate});

   });
   cartsRouter.post("/:cid/product/:pid" ,  async (req, res) => {
      try{
         const idCart = req.params.cid;
         const idProduct = req.params.pid;
         let  addProduct = await  Carts.addProdductCart(idCart,idProduct)
      
         return res.status(200).json({
            status: "success",
            msg: "Product add",
            data: addProduct,
          });
      }catch(e){
         return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
          });
      }
      });

      cartsRouter.delete("/:cid/product/:pid" ,  async (req, res) => {
         try{
          const idCart = req.params.cid;
         const idProduct = req.params.pid;
         let  deletProduct = await  Carts.deletProductCart(idCart,idProduct)
         return   res.status(200).json({
            status: "success",
            msg: "Product eliminado",
            data: deletProduct,
          });
         }catch(e){
            return res.status(500).json({
               status: "error",
               msg: "something went wrong :(",
               data: {},
             });
         }
         });


      cartsRouter.get("/:cid" ,  async (req, res) => {
         try{
            const idCart = req.params.cid;
            let  cartById = await  Carts.getById(idCart);
          return res.status(200).json({
               status: "success",
               msg: "Cart found",
               data: cartById,
             });
         }catch(e){
            return res.status(500).json({
               status: "error",
               msg: "something went wrong :(",
               data: {},
             });
         }
       
      
         });
         cartsRouter.get("/" ,  async (req, res) => {
            try{
               let  carts = await  Carts.getAll();
               return res.status(200).json({
                  status: "success",
                  msg: "Carts found",
                  data: carts,
                });
            }catch(e){
               return res.status(500).json({
                  status: "error",
                  msg: "something went wrong :(",
                  data: {},
                });
            }
          
         
            });