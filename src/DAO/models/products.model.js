import { ProductsSchema } from "../schema/products.schema.js";

export class ProductsModel {
  async getAll(filters,limit,page, order) {
    try {
      const carts = await ProductsSchema.paginate(filters,{limit:limit || 4 ,page: page || 1, sort:([['price', order]])});
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(idCart) {
    try {
        let cart = await ProductsSchema.find({_id:idCart})
      console.log("cart en model",cart)
        return cart;
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOne(title, price,description,code,thumbnail,category,stock) {
    try {
        const cartCreated = await ProductsSchema.create({ title, price,description,code,thumbnail,category,stock,});
        return cartCreated;
    } catch (error) {
      console.log(error);
    }
  }
  async findOne(idCart) {
    try {
        let cart = await ProductsSchema.findOne({_id:idCart});
        return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOne(_id,updateData) {
    try {
      const cartUpdated = await ProductsSchema.findByIdAndUpdate(_id,{ $set: updateData },{ new: true });
      return cartUpdated;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAllProducts(id) {
    try {
        let cart =  await ProductsSchema.updateOne( { _id: id },{ $set: { products: [] } })
        return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async deletOne(id) {
    try {
      const cartDeleted = await ProductsSchema.deleteOne({_id: id});
      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}

