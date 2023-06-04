import  express  from "express";
 export const testRouter = express.Router();
import productManager from "../DAO/productManager.js";


// define the home page route
testRouter.get('/', async (req, res) => {
let products = await productManager.getProducts();
let title = "listados de productos"
console.log(products)
    return res.status(201).render('test',{products,title});

});
