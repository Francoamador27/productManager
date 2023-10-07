import { TicketsModel } from "../DAO/schema/tickets.schema.js";

export class OrdersService{
 
async getAll(role,email){
    try{
        if(role==="admin"){
            const orders = await TicketsModel.find({}).lean();
            
            return orders;
        }
        const orders = await TicketsModel.find({purchaser:email}).lean();
        return orders;
    }catch(e){
        console.log(e)
    }


  }

}