import { ProductsService } from "../services/products.services.js";
import { logger } from "../utils/logger.js";

const Products = new ProductsService()

class ProductsController {
  async getAll(req, res) {
    try {
      var currentUrl = req.url;
      const { page } = req.query;
      const { limit } = req.query;
      const { maxPrice } = req.query;
      const { order } = req.query;
      const category = req.query.category || "";
      const data = await Products.getProducts(limit, page, category, order, maxPrice, currentUrl);
      return res.status(200).json({
        status: "success",
        msg: "listado de productos",
        data: data,
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  async getAllUbicacion(req, res) {
    try {
     
      const data = await Products.getUbicacions();
      return res.status(200).json({
        status: "success",
        msg: "listado de ubicacion",
        data: data,
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  async getMyProducts(req, res) {
    try {
      var currentUrl = req.url
      const { page } = req.query;
      const { limit } = req.query;
      const { maxPrice } = req.query;
      const { order } = req.query;
      let owner = req.session.user.role;
      if (owner != 'admin') {
        owner = req.session.user.email;
      }
      const category = req.query.category || "";
      const data = await Products.getProducts(limit, page, category, order, maxPrice, currentUrl, owner);
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
  async getbyId(req, res) {
    try {
      const _id = req.params.id;
      const data = await Products.getById(_id);
      return res.status(200).json({
        status: "success",
        msg: "product",
        data: data,
      });
    } catch (e) {
      logger.error({ message: "Producto no encontrado", error: e.message });
      return res.status(400).json({
        status: "error",
        msg: "producto no encontrado",
        data: {},
      });
    }
  }

  async createOne(req, res) {
    try {
      let newProduct = req.body;
      newProduct.thumbnail = "/" + req.file.filename;
      let userEmail = req.session.user.email;
      let userRole = req.session.user.role;
      newProduct.owner = 'admin';
      if (userRole === 'premium') {
        newProduct.owner = userEmail;
      }
      const productCreated = await Products.createOne(newProduct);
      return res.status(200).json({
        status: "success",
        msg: "product created",
        data: productCreated,
      });;
    } catch (e) {
      console.log(e)
      logger.error({ message: "Producto no creado", error: e.message });
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: { e },
      });
    }
  }
  async createGallery(req, res) {
    try {
      let newProduct = req.body;
      // newProduct.thumbnail = "/"+ req.file.filename;
      newProduct.availability = JSON.parse(newProduct.availability);
      newProduct.ubicacion = JSON.parse(newProduct.ubicacion);
      // newProduct.description = JSON.parse(newProduct.description);
      console.log("parseada",newProduct)
      newProduct.thumbnail = [];
      req.files.forEach(item => {
        newProduct.thumbnail.push(item.filename);
      });
      let userEmail = req.session.user.email;
      let userRole = req.session.user.role;
      newProduct.owner = 'admin';
      if (userRole === 'premium') {
        newProduct.owner = userEmail;
      }
      const productCreated = await Products.createGallery(newProduct);
      return res.status(200).json({
        status: "success",
        msg: "product created",
        data: productCreated,
      });;
    } catch (e) {
      console.log(e)
      logger.error({ message: "Producto no creado", error: e.message });
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: { e },
      });
    }
  }
  async updateOne(req, res) {
    try {
      let updatedProduct = req.body;
      console.log("req.body", req.body);
      console.log("req.params", req.params);
      const idSearch = req.params.id;
  
      // Verificación de datos antes de parsear
      if (updatedProduct.availability !== 'undefined' && typeof updatedProduct.availability === 'string') {
        updatedProduct.availability = JSON.parse(updatedProduct.availability);
      } else {
        updatedProduct.availability = {};
      }
  
      if (updatedProduct.ubicacion && typeof updatedProduct.ubicacion === 'string') {
        updatedProduct.ubicacion = JSON.parse(updatedProduct.ubicacion);
      }
  
      console.log(updatedProduct);
  
      // Normalización de la ubicación
      updatedProduct.location = {
        lat: updatedProduct.lat,
        lng: updatedProduct.lng
      };
  
      // Manejo de archivos subidos
      if (req.files && req.files[0]) {
        const data = await Products.getById(updatedProduct._id);
        updatedProduct.thumbnail = data.thumbnail || [];
        req.files.forEach(item => {
          updatedProduct.thumbnail.push(item.filename);
        });
      }
  
      // Actualización del producto
      let product = await Products.updateOne(idSearch, updatedProduct);
      return res.status(200).json({ product });
  
    } catch (e) {
      console.log("error", e);
      logger.error({ message: "Error al actualizar el producto", error: e });
      return res.status(400).json({ error: "Error al actualizar el producto" });
    }
  }
  async deletOne(req, res) {
    try {
      const _id = req.params.id;
      const productDelet = await Products.deletOne(_id);
      return res.status(200).json({
        status: "success",
        msg: "product deleted",
        data: { productDelet },
      });
    } catch (e) {
      logger.error({ message: "No se encontro el producto" })

      res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }

  }
  async deletImages(req, res) {
    try {
        const id = req.params.id;
        const image = req.params.image;
      
        const result = await Products.deleteImage(id, image);
        if (result.success) {
            return res.status(200).json({ message: 'Image deleted successfully' ,data:result.data});
        } else {
            return res.status(result.errorCode).json({ error: result.message });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
}



export const productsController = new ProductsController();