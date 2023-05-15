import  express  from "express";
 export const prodructsRouter = express.Router();
import productManager from "../productManager.js"
import { uploader } from "../utils.js";
import { v4 as uuidv4 } from 'uuid';


// define the home page route
prodructsRouter.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    let quantity = products.length; 
    if(limit){
                if(limit <= quantity ){
                    return res.status(200).json(products.slice(0,limit));
                }else{
                    return res.status(400).json({message:"error No tenemos esa cantidad"});
                }
            }
         return res.status(201).json(products);
    });

prodructsRouter.get('/:id', async (req, res) => {
    const idSearch = req.params.id;
    const product = await productManager.getProductsById(idSearch);
    if(product){
        return res.status(201).json(product);
    }
    return res.status(400).json({message:"error No tenemos ese id"});
});

//POST = CREAR
prodructsRouter.post('/', uploader.single('thumbnail') ,  async (req, res) => {
    try{
     let newProduct = req.body;
     if(req.file.filename){
            newProduct.thumbnail = "/"+ req.file.filename;
     } 
        const product = await productManager.addProduct({newProduct})

        res.status(200).json({ product});
   
    }catch(e){
       res.status(409).json({ error: "no se pudo crear"})
    }
    
   
    });

//PUT = MODIFICAR
prodructsRouter.put('/:id', async (req, res) => {
const datosNuevosUsuario = req.body;
const idSearch = req.params.id;
let product = await productManager.updateProduct(idSearch,datosNuevosUsuario);
return res.status(200).json({product})
});


//ELIMINAR
prodructsRouter.delete('/:id', async (req, res) => {
    const idDelet = req.params.id;
    let productDelet = await productManager.deleteProduct(idDelet);
    if(productDelet){
            return res.status(200).json({message: "producto eliminado"})
    }
    res.status(409).json({ error: "id inexistente"})
});


