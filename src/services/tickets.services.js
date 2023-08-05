import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { TicketsModel } from '../DAO/models/tickets.models.js';

export class ticketsService{

    async getProducts(limit,page,category,order,maxPrice,currentUrl){
    
    }

    async getById(_id){
        const product = await ProductsModel.find({_id:_id})
        if(!product){
            throw new Error("validation error: id cannot finded");
        }
       return product;
   }
   
    async createOne(newTicket){
        try{
            let purchase_datetime = new Date() ;
            let code = uuidv4(); 
            let products =newTicket.products;
            let amount = newTicket.amount;
            let purchaser =newTicket.email;
            const productCreated = await TicketsModel.create({ purchase_datetime, code,products,amount,purchaser});
            return productCreated;
         }catch(e){
            throw new Error("<Error inesperado>")
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
   async updateStock(_id,updateStock){
    try{
        const filtro = { _id: _id };
        const actualizacion = { $set: { stock: updateStock } }; // Nuevo valor del stock que quieres establecer
      
        let productUpdate = await ProductsModel.updateOne(filtro, actualizacion) 
        return productUpdate;
     }
    catch(e){
    throw  new Error("Error")     
    }
 }
 async creatProductNoStock(_id,productsNoStock){
    try{
      
        const filtro = { _id: _id };
        const actualizacion = { $set: { productsNoStock: productsNoStock } };
      
        let productUpdate = await ProductsModel.updateOne(filtro, actualizacion) 
        return productUpdate;
     }
    catch(e){
    throw  new Error("Error")     
    }
 }

   
}