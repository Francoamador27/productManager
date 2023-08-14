import CustomError from "../../errors/custom-error.js";
import EErrors from "../../errors/enums.js";
import { logger } from "../../utils/logger.js";
import { ProductsSchema } from "../schema/products.schema.js";

export class ProductsModel {
  async getAll(filters,limit,page, order) {
    try {
      const products = await ProductsSchema.paginate(filters,{limit:limit || 4 ,page: page || 1, sort:([['price', order]])});
      return products;
    } catch (error) {
      return res.status(400).json({ error: "ID de productos no válido" });
    }
  }

  async getById(idProduct) {
    try {
      logger.debug({message:"id product en model" ,data: idProduct})
        let product = await ProductsSchema.find({_id:idProduct})
        if (product.length === 0) {
          logger.info({message:"product no encontrado en el model" })
          CustomError.createError({
            name:"User creation errror",
            cause:"El id no se encontro",
            message:"Ese producto no se encontro",
            code: EErrors.PRODUCTS_NO_FIND,
        })
        }
        return product;
      
    } catch (error) {
      throw  new Error("Nuevo error")     
    }
  }

  async createOne(title, price,description,code,thumbnail,category,stock) {
    try {
        const cartCreated = await ProductsSchema.create({ title, price,description,code,thumbnail,category,stock,});
        return cartCreated;
    } catch (error) {
      throw  new Error("Nuevo error")     
    }
  }
  async findOne(idCart) {
    try {
        let cart = await ProductsSchema.findOne({_id:idCart});
        return cart;
    } catch (error) {
      throw  new Error("Nuevo error")     
    }
  }

  async updateOne(_id,updateData) {
    try {
      const cartUpdated = await ProductsSchema.findByIdAndUpdate(_id,{ $set: updateData },{ new: true });
      return cartUpdated;
    } catch (error) {
      logger.error({message:error.message});
      throw  new Error("Nuevo error")     
    }
  }
  async deleteAllProducts(id) {
    try {
        let cart =  await ProductsSchema.updateOne( { _id: id },{ $set: { products: [] } })
        return cart;
    } catch (error) {
      logger.error({message:error.message});

      throw  new Error("Nuevo error")     
    }
  }

  async deletOne(id) {
    try {
      const cartDeleted = await ProductsSchema.deleteOne({_id: id});
      logger.info({message:"Producto a eliminado",data: cartDeleted});

      return cartDeleted;
    } catch (error) {
      logger.error({message:error.message});
    }
  }
}

