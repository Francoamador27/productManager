import  express  from "express";
export const viewsRouter = express.Router();
import productManager from "../DAO/productManager.js";
import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
const Products = new ProductsService()
const Carts = new CartsService()

// define the home page route
viewsRouter.get('/realtimeproducts', async (req, res) => {
let products = await productManager.getProducts();

    return res.status(201).render('index',{products});

});
viewsRouter.get('/products', async (req, res) => {
        var currentUrl = req.url;
        var orderAsc = req.query.orderAsc;
        var orderDesc = req.query.orderDesc;
        var maxPrice = req.query.maxPrice;

        console.log(maxPrice);
        const {page} = req.query;
       const {limit}= req.query;
       const category = req.query.category || "";
       const {filter} = req.query;
        let dataProducts = await Products.getProducts(limit,page,category,filter,currentUrl,orderAsc,orderDesc,maxPrice);
        let products = dataProducts.products;
        let pagination = dataProducts.pagination;
        return res.status(201).render('products',{products, pagination});
    
    });
    viewsRouter.get("/cart/:cid" ,  async (req, res) => {
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
