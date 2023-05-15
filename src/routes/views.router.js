import  express  from "express";
export const viewsRouter = express.Router();
import productManager from "../productManager.js";


// define the home page route
viewsRouter.get('/realtimeproducts', async (req, res) => {
let products = await productManager.getProducts();

    return res.status(201).render('index',{products});

});
