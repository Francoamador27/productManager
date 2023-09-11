import { ProductsService } from "../services/products.services.js";
import { logger } from "../utils/logger.js";

const Products = new ProductsService()

class ProductsController{
 async getAll(req, res)  {
    try {
        var currentUrl = req.url
        const {page} = req.query;
        const {limit}= req.query;
        const {maxPrice}= req.query;
        const {order}= req.query;
        const category = req.query.category || "";
        const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl);
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
  }
  async getMyProducts(req, res)  {
    try {
        var currentUrl = req.url
        const {page} = req.query;
        const {limit}= req.query;
        const {maxPrice}= req.query;
        const {order}= req.query;
        let owner = req.session.user.role;
        if (owner != 'admin') {
          owner = req.session.user.email;
        }
      console.log(owner,"ONWER")
        const category = req.query.category || "";
        const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl,owner);
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
  }
  async getbyId (req, res) {
    try{
      const _id = req.params.id;
      const data = await Products.getById(_id);
      return res.status(200).json({
        status: "success",
        msg: "product",
        data: data,
      });
    }catch(e){
      logger.error({message:"Producto no encontrado",error:e.message});
      return res.status(400).json({
        status: "error",
        msg: "producto no encontrado",
        data: {},
      }); 
    }
  }

  async createOne(req, res) {
    try{
     let newProduct = req.body;
     newProduct.thumbnail = "/"+ req.file.filename;
     let userEmail = req.session.user.email;
     let userRole = req.session.user.role;
     logger.debug({message:"rol de usuario",data: userRole});
     newProduct.owner = 'admin';
     if(userRole === 'premium'){
      newProduct.owner = userEmail;
     }
     const productCreated = await Products.createOne(newProduct);
     logger.debug({message:"producto creado",data: productCreated});
     return  res.status(200).json({
                status: "success",
                msg: "product created",
                data: productCreated,
              });;
     } catch(e) {
      logger.error({message:"Producto no creado",error:e.message});
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {e},
        });
      }
    }
    async updateOne (req, res) {
      const updatedProduct = req.body;
      const idSearch = req.params.id;
      const thumbnail = "/" + req.file.filename;
      updatedProduct.thumbnail = thumbnail;
      console.log("product put", updatedProduct)
      console.log("id search",idSearch);
      try{
        let product = await Products.updateOne(idSearch,updatedProduct);
        return res.status(200).json({product})
      }catch{
        logger.error({message:"ID de producto no válido",data: idSearch});
        return res.status(400).json({ error: "ID de producto no válido" });

      }
        }
    async deletOne(req, res)  {
        try{
          const _id = req.params.id;
            const productDelet= await Products.deletOne(_id);
            return res.status(200).json({
              status: "success",
              msg: "product deleted",
              data: {productDelet},
            });
        }catch(e){
          logger.error({message:"No se encontro el producto"})

          res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
          });
        }
          
      }
}



export const productsController = new ProductsController();