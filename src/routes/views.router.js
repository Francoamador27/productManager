import  express  from "express";
export const viewsRouter = express.Router();
import productManager from "../DAO/productManager.js";
import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
import { UserModel } from "../DAO/models/user.models.js";
const Products = new ProductsService()
const Carts = new CartsService()

// define the home page route
viewsRouter.get('/realtimeproducts', async (req, res) => {
    console.log(req.session.user, req.session.admin)

let products = await productManager.getProducts();

    return res.status(201).render('index',{products});

});
viewsRouter.get('/products', async (req, res) => {
  let email ="";
  let firstNameUser ="";
  if(req?.session?.email){
    email = req.session.email
    var usuarioEncontrado = await UserModel.findOne({email:email})
    firstNameUser = usuarioEncontrado.firstName
      }

        var currentUrl = req.url;
        var orderAsc = req.query.orderAsc;
        var orderDesc = req.query.orderDesc;
        var maxPrice = req.query.maxPrice;

        const {page} = req.query;
       const {limit}= req.query;
       const category = req.query.category || "";
       const {filter} = req.query;
        let dataProducts = await Products.getProducts(limit,page,category,filter,currentUrl,orderAsc,orderDesc,maxPrice);
        let products = dataProducts.products;
        let pagination = dataProducts.pagination;
        return res.status(201).render('products',{products, pagination,firstNameUser});
    
    });
    viewsRouter.get("/cart/:cid" ,  async (req, res) => {
        console.log(req?.session?.user, req?.session?.admin)
        try{
           const idCart = req.params.cid;
           let  products = await  Carts.getById(idCart);
           let cartString = JSON.stringify(idCart)
            console.log(cartString)
            return res.status(201).render('cart',{products,cartString});
        }catch(e){
           return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              data: {},
            });
        }})

        //Login
        viewsRouter.get("/show-session" ,  async (req, res) => {
            try{
               const dataSession = req.session;
                return res.status(201).send(JSON.stringify(dataSession));
            }catch(e){
               return res.status(500).json({
                 
                });
            }})


            viewsRouter.get('/logout', (req, res) => {
                // console.log(req?.session?.user, req?.session?.admin)
                console.log(req.session.user,req.session.admin)

                req.session.destroy(err => {
                  if (err) {
                    return res.json({ status: 'Logout ERROR', body: err })
                  }
                  res.send('Logout ok!')
                })
                // console.log(req?.session?.user,req?.session?.admin)

               })

               viewsRouter.get('/login', (req, res) => {
                const { username, password } = req.query

                if (username !== 'pepe' || password !== 'pepepass') {
                  return res.send('login failed')
                }
                req.session.user = username;
                req.session.admin = true;
                res.send('login success!')
                console.log(req.session.user,req.session.admin)

               })
               

               