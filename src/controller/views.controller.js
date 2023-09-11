import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
import { UserService } from "../services/users.services.js";
import { UserDTO } from "../DAO/DTO/user.dto.js";
import { generateProducts } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { ProductDTO } from "../DAO/DTO/product.dto.js";
const Users = new UserService()
const Products = new ProductsService()
const Carts = new CartsService()

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
          if(req?.session?.user?.email){
            let email = req.session.user.email
            let role = req.session.user.role
            if (role === "admin" || role === "premium") {
               vfyUoA= true;
               user = await Users.findOnebyEmail(email)
            }
            req.session.user.cart= user.cart;
            user = new UserDTO(user);
          }
          return res.status(201).render('products',{products, pagination,user,vfyUoA});
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
      async creatProduct (req, res){
        try{
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
          return res.status(201).render('creatProduct',{user,vfyUoA});
        }catch(e){
          console.log(e)
        }
     }
     async getCardbyId(req, res)  {
      try{
        const idCart = req.params.cid;
        let  products = await  Carts.getById(idCart);
        console.log(products)
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
          console.log("view controller",product)
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