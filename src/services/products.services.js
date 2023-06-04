import { ProductsModel } from "../DAO/models/products.models.js";

export class ProductsService{

    async getAll(limit){
         const products = await ProductsModel.find({}).limit(limit);
        return products;
    }

    async getById(_id){
        const product = await ProductsModel.find({_id:_id})
        if(!product){
            throw new Error("validation error: id cannot finded");
        }
       return product;
   }
    async createOne(newProduct){
        try{
            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail ||
               !newProduct.code ||
               !newProduct.category ||
               !newProduct.stock
            ){
                throw new Error("Complete campos")
            }
            let title = newProduct.title  ;
            let description = newProduct.description ;
            let price = parseInt(newProduct.price) ;
            let code = newProduct.code ;
            let stock = parseInt(newProduct.stock);
            let category = newProduct.category;
            let thumbnail =newProduct.thumbnail;
            const productCreated = await ProductsModel.create({ title, price,description,code,thumbnail,category,stock,});
            return productCreated;
         }catch(e){
            throw new Error("Complete campos")
            }
    }
    
    async deletOne(_id){
       try{
          if(_id){
             let productDelet = await ProductsModel.deleteOne({_id: _id});
             return productDelet;
        }
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }

    async updateOne(_id,firstName, lastName, email){
      try{
          this.validate(firstName, lastName, email);
          const userUptaded = await ProductsModel.updateOne( { _id: _id },{ firstName, lastName, email });
          return userUptaded;
       }
      catch(e){
      throw  new Error("Error")     
      }
   }

   
}