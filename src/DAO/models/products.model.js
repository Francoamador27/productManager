import CustomError from "../../errors/custom-error.js";
import EErrors from "../../errors/enums.js";
import { logger } from "../../utils/logger.js";
import { ProductsSchema } from "../schema/products.schema.js";

export class ProductsModel {
  async getAll(filters,limit,page, order) {
    try {
      const products = await ProductsSchema.paginate(filters,{limit:limit || 3 ,page: page || 1, sort:([['price', order]])});
     if(!products){
      throw new Error("error")

     }
      return products;
    } catch (error) {
throw new Error(error)
  }
  }

  async getById(idProduct) {
    try {
      logger.debug({message:"id product en model" ,data: idProduct})
        let product = await ProductsSchema.findOne({_id:idProduct})
   
        return product;
      
    } catch (error) {
      throw  new Error("Nuevo error")     
    }
  }
  async checkOwner(_id,owner) {
    try {
        let product = await ProductsSchema.find({ _id, owner:owner });
    
        return product;
      
    } catch (error) {
      throw  new Error("Nuevo error")     
    }
  }

  async createOne(title, price,description,code,thumbnail,category,stock,owner) {
    try {
        const cartCreated = await ProductsSchema.create({ title, price,description,code,thumbnail,category,stock,owner});
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
      const productUpdated = await ProductsSchema.findByIdAndUpdate(_id,{ $set: updateData },{ new: true });
      return productUpdated;
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

