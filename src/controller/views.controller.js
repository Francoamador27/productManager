import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
import { UserService } from "../services/users.services.js";
import { UserDTO } from "../DAO/DTO/user.dto.js";
import { generateProducts } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { ProductDTO } from "../DAO/DTO/product.dto.js";
import { tr } from "@faker-js/faker";
import { OrdersService } from "../services/orders.services.js";
import { format } from 'date-fns';

const Users = new UserService()
const Products = new ProductsService()
const Carts = new CartsService()
const Orders = new OrdersService();
class ViewsController{
      async getAll (req, res){
        try{
          // OBTENGO LOS QUERYS PARA VISTA DE PRODUCTOS
          var currentUrl = req.url
          const {page} = req.query;
          const {limit}= req.query;
          const {maxPrice}= req.query;
          const {order}= req.query;
          const category = req.query.category || "";
          // BUSCO LOS PRODUCTOS SEGUN EL QUERY
          const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl);
          let products = data.products;
          let pagination = data.pagination;
          // BUSCO SI EXISTE SESSION Y USUARIO
          let user ="";
          let vfyUoA= false;
          let vfyAdmin= false;

          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            req.session.user.cart= user.cart;
            user = await Users.findOnebyEmail(email)
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }
            if (role === "admin") {
              vfyAdmin= true;
            }   
            user = new UserDTO(user);
          }
          return res.status(201).render('products',{products, pagination,user,vfyUoA,vfyAdmin});
        }catch(e){
          console.log(e)
        }
     }
      async getAllUsers (req, res){
        try{
          // OBTENGO LOS QUERYS PARA VISTA DE PRODUCTOS
          var currentUrl = req.url
          const {page} = req.query;
          const {limit}= req.query;
          let {lastTwo}= req.query;
          const status = req.query.status || "";
          const role =req.query.role;
          const data = await Users.getAll(limit,page,status,currentUrl,lastTwo,role);
          let users = data.users;
          let pagination = data.pagination;
          let user ="";
          let vfyUoA= false;
          let vfyAdmin=false;
          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            user = await Users.findOnebyEmail(email)
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }           
            if (role === "admin") {
              vfyAdmin= true;
            }           
            req.session.user.cart= user.cart;
            user = new UserDTO(user);
          }
          return res.status(201).render('users',{users, pagination,user,vfyUoA,vfyAdmin});
        }catch(e){
          console.log(e)
        }
     }
     async getMyProducts(req, res)  {
      try {
          var currentUrl = req.url
          const {page} = req.query;
          const {limit}= req.query;
          const {maxPrice}= req.query;
          const {order}= req.query;
          let user = "";
          let vfyUoA= false;

          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }
            user = await Users.findOnebyEmail(email)
            user = new UserDTO(user);

          }
          let owner ;
          let session = req.session.user.role;
          if (session != 'admin') {
            owner = req.session.user.email;
          }          
          const category = req.query.category || "";
          const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl,owner);
          let products = data.products;
          let pagination = data.pagination;
          return res.status(201).render('my-products',{products, pagination,user,vfyUoA});

      } catch (e) {
        console.log(e);
        return res.status(501).render('error',{});

      }
  }
      async bePremium (req, res){
        try{
          let vfyUoA= false;
          if(req.session.user){
            let user = req.session.user
            let role = req.session.user.role
            console.log(role);
            if (role === "admin" || role === "premium") {
              vfyUoA= true;
            }
            return res.status(201).render('documents',{user,vfyUoA});

          }
        } catch(e){
          console.log(e)
        }

      }
      async creatProduct (req, res){
        try{
          let user = "";
          let vfyUoA= false;
          let vfyAdmin= false;

          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }
            if (role === "admin") {
              vfyAdmin= true;
            }   
            user = await Users.findOnebyEmail(email)
            user = new UserDTO(user);

          }
          let owner ;
          let session = req.session.user.role;
          if (session != 'admin') {
            owner = req.session.user.email;
          }         
          return res.status(201).render('creatProduct',{user,vfyUoA,vfyAdmin});
        }catch(e){
          console.log(e)
        }
     }
     async getCardbyId(req, res)  {
      try{
        const idCart = req.params.cid;
        let  products = await  Carts.getById(idCart);
        return res.status(201).render('cart',{products,idCart});
        }catch(e){
          return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
            });
          }}
      async showSession  (req, res)  {
        try{
         const dataSession = req.session;
         return res.status(201).send(JSON.stringify(dataSession));
          }catch(e){
          return res.status(500).json({ });
          }}
      async orders  (req, res)  {
        try{
          let user = req.session.user;
          let vfyUoA= false;
            let email = user.email
            let role = user.role
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }
            user = await Users.findOnebyEmail(email)
            user = new UserDTO(user);
          let session = req.session.user.role;
        
        let Orderfound = await Orders.getAll(role,email)
console.log(Orderfound);
          return res.status(201).render('orders',{user,vfyUoA,Orderfound});
          }catch(e){
            console.log(e)
          return res.status(500).json({ });
          }}
     async editProductbyId(req, res)  {
      try{
        const id = req.params.id;
        let  product = await  Products.getById(id);
        let user = "";
          let vfyUoA= false;

          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
            }
            user = await Users.findOnebyEmail(email)
            user = new UserDTO(user);

          }
         let  productDto = new ProductDTO(product)
        return res.status(201).render('edit-product',{product:productDto,vfyUoA,user,id});
        }catch(e){
          return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
            });
          }}
      async showSession  (req, res)  {
        try{
         const dataSession = req.session;
         return res.status(201).send(JSON.stringify(dataSession));
          }catch(e){
          return res.status(500).json({ });
          }}
        
          async creatFake  (req, res)  {
            try{
              const products = [];
              for(let i= 0; i<200; i++){
                products.push(generateProducts())
              }
             return res.status(201).send(JSON.stringify(products));
            }catch(e){
            return res.status(500).json({ });
              }}

      async logout (req, res){
        req.session.destroy(err => {
        if (err) {
          return res.json({ status: 'Logout ERROR', body: err })
            }
          res.send('Logout ok!')
            })
          }
      async testingLoggers (req,res){
        logger.debug("ESTE ES UN DEBUG");
        logger.http("ESTE ES UN HTTP");
        logger.info("ACA ES INFORMACION");
        logger.error("TODO MAL");
        logger.warn("ALGO NO TAN MAL");
        res.send({message:"Hola Mundo"})
      }    

}
export const viewsController = new ViewsController();