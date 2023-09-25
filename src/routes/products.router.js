import  express  from "express";
 export const prodructsRouter = express.Router();
import { productsController } from "../controller/products.controller.js";
import { optionalFileUpload, uploadProduct } from "../utils/utils.js";
import { checkOwner, iAdminoPremium } from "../middleware/auth.js";

//GET = OBTENER TODOS
prodructsRouter.get("/", productsController.getAll);
//GET = OBTENER POR ID
prodructsRouter.get('/myProducts',iAdminoPremium, productsController.getMyProducts);
prodructsRouter.get('/:id', productsController.getbyId);
//POST = CREAR
prodructsRouter.post('/', uploadProduct.single('thumbnail'),iAdminoPremium,  productsController.createOne);
//PUT = MODIFICAR
prodructsRouter.put('/:id',optionalFileUpload,iAdminoPremium,checkOwner, productsController.updateOne);
//ELIMINAR
prodructsRouter.delete('/:id',iAdminoPremium,checkOwner, productsController.deletOne);


