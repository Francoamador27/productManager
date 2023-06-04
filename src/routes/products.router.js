import  express  from "express";
 export const prodructsRouter = express.Router();
import productManager from "../DAO/productManager.js"
import { uploader } from "../utils.js";
import { ProductsModel } from "../DAO/models/products.models.js";
import { ProductsService } from "../services/products.services.js";

const Products = new ProductsService()


prodructsRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const data = await Products.getAll(limit);
        return res.status(200).json({
        status: "success",
        msg: "listado de productos",
        data: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });

// define the home page route


prodructsRouter.get('/:id', async (req, res) => {
  try{
    const _id = req.params.id;
    const data = await Products.getById(_id);
    return res.status(200).json({
      status: "success",
      msg: "product",
      data: data,
    });
  }catch(e){
    return res.status(400).json({
      status: "error",
      msg: "producto no encontrado",
      data: {},
    }); 
  }
});

//POST = CREAR
prodructsRouter.post('/', uploader.single('thumbnail') ,  async (req, res) => {
    try{
     let newProduct = req.body;
     newProduct.thumbnail = "/"+ req.file.filename;
     const productCreated = await Products.createOne(newProduct);
       return  res.status(200).json({
                status: "success",
                msg: "product created",
                data: productCreated,
              });;
     } catch(e) {
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
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
  try{
  const _id = req.params.id;
  const productDelet= await Products.deletOne(_id);
  return res.status(200).json({
    status: "success",
    msg: "product deleted",
    data: productDelet,
  });
  }catch(e){
    res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
    
});


