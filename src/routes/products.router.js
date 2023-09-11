import  express  from "express";
 export const prodructsRouter = express.Router();
import { productsController } from "../controller/products.controller.js";
import { uploader } from "../utils/utils.js";
import { checkOwner, isUseroPremium } from "../middleware/auth.js";

//GET = OBTENER TODOS
prodructsRouter.get("/", productsController.getAll);
//GET = OBTENER POR ID
prodructsRouter.get('/myProducts',isUseroPremium, productsController.getMyProducts);
prodructsRouter.get('/:id', productsController.getbyId);
//POST = CREAR
prodructsRouter.post('/', uploader.single('thumbnail'),isUseroPremium,  productsController.createOne);
//PUT = MODIFICAR
prodructsRouter.put('/:id',uploader.single('thumbnail'),isUseroPremium,checkOwner, productsController.updateOne);
//ELIMINAR
prodructsRouter.delete('/:id',isUseroPremium,checkOwner, productsController.deletOne);


