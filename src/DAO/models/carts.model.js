import { CartsSchema } from "../schema/carts.schema.js";

export class CartsModel{
  async getAll(){
    try{
      const carts = await CartsSchema.find({}).populate("products.product");
      return carts;
    }catch(e){
      console.log(e);
    }
  }
  async getById(idCart){
    try{
      let cart = await CartsSchema.findOne({_id:idCart}).populate("products.product")
      return cart;
    }catch(e){
      console.log(e)
    }
  }
  async createOne(){
    try{
      const cartCreated = await CartsSchema.create({});
              return cartCreated;
    }catch(e){
      console.log(e)
    }
      
}
  async updateOne(idCart,cart){
    try{
      const cartCreated = await  CartsSchema.updateOne({_id:idCart},cart);
              return cartCreated;
    }catch(e){
      console.log(e)
    }
      
}
async delectAllProducts(idCart){
  try{
    let cart =  await CartsSchema.updateOne( { _id: idCart },{ $set: { products: [] } })
    return cart;
  }catch(e){
    console.log(e);
  }
}

}