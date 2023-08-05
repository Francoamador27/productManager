import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
import { UserService } from "../services/users.services.js";
import { UserDTO } from "../DAO/DTO/user.dto.js";
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
          if(req?.session?.user?.email){
            let email = req.session.user.email
            user = await Users.findOnebyEmail(email)
            console.log("usuario en producto antes de dto",user)
            req.session.user.cart= user.cart;
            user = new UserDTO(user);
            console.log("despues de dto",user)
            console.log("session",req.session.user)

          }
          return res.status(201).render('products',{products, pagination,user});
        }catch(e){
          console.log(e)
        }
     }
      async creatProduct (req, res){
        try{
          
          return res.status(201).render('creatProduct',{});
        }catch(e){
          console.log(e)
        }
     }
     async getCardbyId(req, res)  {
      try{
        const idCart = req.params.cid;
        const dataSession = req.session;
        console.log(dataSession)
        console.log("estoy aca",idCart)
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
      async logout (req, res){
        req.session.destroy(err => {
        if (err) {
          return res.json({ status: 'Logout ERROR', body: err })
            }
          res.send('Logout ok!')
            })
          }
}
export const viewsController = new ViewsController();