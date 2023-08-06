import { UserDTO } from "../DAO/DTO/user.dto.js";
import { CartsService } from "../services/carts.services.js";
import { ProductsService } from "../services/products.services.js";
import { ticketsService } from "../services/tickets.services.js";
import { UserService } from "../services/users.services.js";
import { sessionController } from "./session.controller.js";

const Carts = new CartsService()
const Users = new UserService()
const Products = new ProductsService()
const Tickets = new ticketsService()


class CartController{
 async creatCart (req, res)  {
    try{
       let cartCreate = await  Carts.createOne()
        if(req?.session?.user){
            let userSession = req.session.user
            let email = userSession.email
            await Users.findOnebyEmail(email);
            req.session.user.cart= cartCreate._id;
            await Users.addCart(email,cartCreate._id)
         }
       return res.status(201).json({
       message:"carrito creado ",
       data: cartCreate});  
    }catch(e){
        res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }
    }
    async addProductToCart (req, res) {
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
        }
        async deletOneProductbyCart  (req, res)  {
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
            }
            async getById  (req, res)  {
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
                }
            async getCarts   (req, res)  {
                try{
                  const idCart = req.params.cid;
                  let  cartById = await  Carts.getById(idCart);

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
              
             
                }
            async purchase(req, res)  {
               try{
                  const idCart = req.params.cid;
                  let  cartById = await  Carts.getById(idCart);
                  console.log("id en el service",idCart)

                  let amount = 0;
                  for (const item of cartById) {
                     let product = await Products.getById(item.id);
                     product = product[0];
                     console.log("producto en el Carrito",product)
                     if (!product) {
                        return res.status(404).json({ error: 'Producto no encontrado' });
                     }
                     if (product.stock < item.quantity) {
                        let restStock = item.quantity - product.stock;
                        let rest = {};
                        rest.restStock= restStock;
                        rest.id= item.id ;
                        rest.quantity =restStock;
                        await  Products.creatProductNoStock(item.id,rest)
                        return res.status(400).json({ error: 'Stock insuficiente para el producto: ' + product.title });
                     }
                     console.log("producto traido de mongo",product)
                     console.log("producto en el Carrito",item)

                     let updateStock = product.stock -item.quantity
                     console.log("Stock del producto",product.stock)
                     console.log("quantity en el cart",item.quantity)
                    
                     let subtotal = product.price * item.quantity;
                     amount = amount + subtotal
                     let productUpdate = await Products.updateStock(item.id,updateStock)
                     
                  }
                  let  products = await  Carts.getById(idCart);
                  console.log("productos despues de actualizar stock",products)
                  let newTicket ={};
                  newTicket.products = products;
                  newTicket.cartById;
                  newTicket.amount = amount;
                  let userSession = req.session.user
                  newTicket.email = userSession.email;
                  await Carts.delectAllProducts(idCart);
                  let ticket = await Tickets.createOne(newTicket)
                  console.log(ticket);
                  return  res.status(200).json({
                     status: "success",
                     msg: "product created",
                     data: ticket,
                   });;
                     } catch(e) {
                     console.log(e)
                        return res.status(500).json({
                           status: "error",
                           msg: "something went wrong :(",
                           data: {e},
                        });
           }
                
               
                  }      
}

export const cartController = new CartController();