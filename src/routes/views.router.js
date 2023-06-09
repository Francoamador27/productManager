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
let products = await productManager.getProducts();

    return res.status(201).render('index',{products});

});
viewsRouter.get('/products', async (req, res) => {
  let email ="";
  let firstNameUser ="";
  let cartId = false;
  if(req?.session?.user?.email){
    email = req.session.user.email
    var usuarioEncontrado = await UserModel.findOne({email:email})
    firstNameUser = usuarioEncontrado.firstName
    cartId = req.session.user.cart;
    console.log("ID CART FALSE",cartId)
    if(cartId != undefined){
      console.log("id Cart",cartId)
      let cartProduct = await Carts.getById(cartId);

    }
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
        return res.status(201).render('products',{products, pagination,firstNameUser,});
    
    });
viewsRouter.get("/cart/:cid" ,  async (req, res) => {
    try{
      const idCart = req.params.cid;
      let  products = await  Carts.getById(idCart);
      let cartString = JSON.stringify(idCart)
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
  req.session.destroy(err => {
  if (err) {
    return res.json({ status: 'Logout ERROR', body: err })
      }
    res.send('Logout ok!')
      })
    })

               
viewsRouter.get('/login-github', async (req, res) => {
  res.render('login-github');
  });
              