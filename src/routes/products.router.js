import  express  from "express";
 export const prodructsRouter = express.Router();
import { productsController } from "../controller/products.controller.js";
import { optionalArrayUpload, optionalFileUpload, uploadProduct } from "../utils/utils.js";
import { checkOwner, iAdminoPremium } from "../middleware/auth.js";

//GET = OBTENER TODOS
prodructsRouter.get("/", productsController.getAll);
prodructsRouter.get("/ubicacion", productsController.getAllUbicacion);
//GET = OBTENER POR ID
prodructsRouter.get('/myProducts',iAdminoPremium, productsController.getMyProducts);
prodructsRouter.get('/edit/myProducts',iAdminoPremium, productsController.getMyProducts);
prodructsRouter.get('/:id', productsController.getbyId);
prodructsRouter.get('/edit/:id',iAdminoPremium,checkOwner, productsController.getbyId);
//POST = CREAR
prodructsRouter.post('/', uploadProduct.single('thumbnail'),iAdminoPremium,  productsController.createOne);
prodructsRouter.post('/galeria', uploadProduct.array('thumbnail'),iAdminoPremium,  productsController.createGallery);
//PUT = MODIFICAR
prodructsRouter.put('/:id',optionalArrayUpload,iAdminoPremium,checkOwner, productsController.updateOne);
//ELIMINAR
prodructsRouter.delete('/:id',iAdminoPremium,checkOwner, productsController.deletOne);
prodructsRouter.delete('/image/:id/:image',iAdminoPremium,checkOwner, productsController.deletImages);


