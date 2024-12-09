
import { UserSchema } from "../schema/user.schema.js";

 class UsersModel {
  async getAll(filters,limit, page) {
    try {
      const users = await UserSchema.paginate(filters, { limit: limit || 4, page: page || 1 });
      return users;
    } catch (error) {
      return res.status(400).json({ error: "ID de productos no válido" });
    }
  }
  async findOnebyEmail(email){
    try{
      let user = await UserSchema.findOne({email:email})
      return user;
    }catch{
      console.log(e)
      throw new Error("validation error: please complete firstName, lastname and email.");
    }
  }
  async findOnebyId(id){
    try{
      let user = await UserSchema.findOne({_id:id})
      return user;
    }catch{
      throw new Error("validation error: please complete firstName, lastname and email.");
    }
  }
  async checkCart(email,cart){
    let user = await UserSchema.findOne({
      email: email,
      cart: cart
    });
    return user;
  }
  async createOne(firstName, lastName, email){
    try{
      const userCreated = await UserSchema.create({ firstName, lastName, email });
      return userCreated;
    }catch(e){

        throw new Error("No es posible la creacion");

    }
  }
 
  async deletOne(_id){
    try{
          let productDelet = await UserSchema.findOneAndDelete({ _id: _id });
          return productDelet;
    }
   catch(e){
     throw  new Error("Nuevo error")     
   }
 }
 async deletOldConection( tenMinutesAgo){
    try {
      const result = await UserSchema.deleteMany({
        lastConnection: { $lt: tenMinutesAgo },
      });
           return result;
     }
    catch(e){
      throw  new Error("Nuevo error")     
    }
  }
  async addCart(email,id){
    try{
      let data = await  UserSchema.updateOne({ email },{ $set: { cart: id } })
      return data;
    }catch(e){
      throw  new Error("Nuevo error")     

    } 
  }
  async updateOne(_id,firstName, lastName, email){
    try{
        const userUptaded = await UserSchema.updateOne( { _id: _id },{ firstName, lastName, email });
        return userUptaded;
     }
    catch(e){
    throw  new Error("Id no encontrado")     
    }
 }
 async updatePremium(id){
    try{
        const userUptaded = await UserSchema.findOneAndUpdate(
          { _id: id },
          { $set: {'status': 'checked','role':'premium' } },
          { new: true });
        return userUptaded;
     }
    catch(e){
    throw  new Error("Id no encontrado")     
    }
 }
 async updateDocuments(id,newDocumentProperties){
    try{
        const userUptaded = await UserSchema.findOneAndUpdate(
          { _id: id },
          { $set: { 'documents': newDocumentProperties, 'status': 'processing' } },
          { new: true })
        return userUptaded;
     }
    catch(e){
    throw  new Error("Id no encontrado")     
    }
 }
 async updateStatus(id){
    try{
        const userUptaded = await UserSchema.findOneAndUpdate(
          { _id: id },
          { $set: { 'status': 'processing' } },
          { new: true })
        return userUptaded;
     }
    catch(e){
    throw  new Error("Id no encontrado")     
    }
 }
 async updatePassword(email,password){
    try{
        const userUptaded = await UserSchema.findOneAndUpdate(
          { email },
          { password },
          { new: true } // Devuelve el documento actualizado
        );
        return userUptaded;
     }
    catch(e){
      console.log(e)
    throw  new Error("No fue posible cambiar la contraseña")     
    }
 }
 async updateConection(email,lastConnection){
    try{
        const userLastConection = await UserSchema.findOneAndUpdate(
          { email },
          { lastConnection },
          { new: true } // Devuelve el documento actualizado
        );
        return userLastConection;
     }
    catch(e){
      console.log(e)
    throw  new Error("No fue posible cambiar la contraseña")     
    }
 }

}

export const  UserModel = new UsersModel();
