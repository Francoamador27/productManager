import { UserDTO } from "../DAO/DTO/user.dto.js";
import { UserModel } from "../DAO/schema/user.schema.js";
import url, { fileURLToPath } from "url"

export class UserService{
    
  async getAll(limit,page,status,currentUrl,lastTwo,role) {
    let filters = {};
    if (status) {
      filters.status = { $regex: status, $options: 'i' };
    }
    if (lastTwo) {
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10); // Resta 10 minutos a la fecha actual
      filters.lastConnection = { $lt: tenMinutesAgo.getTime() };
    }
    if (role) {
      filters.role = role; 
    }
    const usersData = await UserModel.paginate(filters, { limit: limit || 4, page: page || 1 });
      const {docs, ...rest} = usersData;
      let users =  docs.map((doc)=>{
        return {id: doc.id,
             email: doc.email, 
             firstName:doc.firstName,
             lastName: doc.lastName,
             role: doc.role,
             cart:doc.cart,
            status: doc.status,
          documents:doc.documents}
    })

    let pagination = rest;
    if(pagination.hasNextPage){
      let parsedUrl = url.parse(currentUrl,true)
      parsedUrl.query.page= pagination.nextPage;
      let nextLink = url.format({
          pathname: parsedUrl.pathname,
          query : parsedUrl.query,
      })
      pagination.nextLink = nextLink;
  }
  if(pagination.hasPrevPage){
      let parsedUrl = url.parse(currentUrl,true)
      parsedUrl.query.page= pagination.prevPage;
      let prevLink = url.format({
          pathname: parsedUrl.pathname,
          query : parsedUrl.query,
      })
      pagination.prevLink = prevLink;
  }

 return {users,pagination};
    }
    validate(firstName, lastName ,email){
        if (!firstName || !lastName || !email) {
            console.log(
              "validation error: please complete firstName, lastname and email."
            );
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
       return ({firstName, lastName ,email})
    }
    
    async findOnebyEmail(email){
      try{
        let user = await UserModel.findOne({email:email})
        return user;
      }catch{
        console.log(e)
        throw new Error("validation error: please complete firstName, lastname and email.");
      }
    }
    async checkCart(userSession){
      let user = await UserModel.findOne({
        email: userSession.email,
        cart: userSession.cart
      });
      return user;
    }
    async createOne(firstName, lastName, email){
        this.validate(firstName, lastName, email);
        const userCreated = await UserModel.create({ firstName, lastName, email });
        return userCreated;
    }
    
    async deletOne(_id){
       try{
             let productDelet = await UserModel.findOneAndDelete({ _id: _id });
             return productDelet;
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }
    async deletOldConection(){
      try {
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 30); // Resta 10 minutos a la fecha actual
        const result = await UserModel.deleteMany({
          lastConnection: { $lt: tenMinutesAgo },
        });
             return result;
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }
  
    async addCart(email,id){
      let data = await  UserModel.updateOne({ email },{ $set: { cart: id } })
      return data;
    }

    async updateOne(_id,firstName, lastName, email){
      try{
          this.validate(firstName, lastName, email);
          const userUptaded = await UserModel.updateOne( { _id: _id },{ firstName, lastName, email });
          return userUptaded;
       }
      catch(e){
      throw  new Error("Id no encontrado")     
      }
   }
    async updatePremium(id){
      try{
          const userUptaded = await UserModel.findOneAndUpdate(
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
          const userUptaded = await UserModel.findOneAndUpdate(
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
          const userUptaded = await UserModel.findOneAndUpdate(
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
        const userUptaded = await UserModel.findOneAndUpdate(
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
        const userLastConection = await UserModel.findOneAndUpdate(
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