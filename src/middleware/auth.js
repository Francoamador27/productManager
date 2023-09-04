import { UserDTO } from "../DAO/DTO/user.dto.js"
import { UserService } from "../services/users.services.js"

let Users = new UserService
// Medialware Admin
export function isUser(req,res,next){
  console.log("ENTRO A MIDDLEWARE ")

  try{
    if(req?.session?.user.email){
      console.log("ENTRO A USER ")
      return next()
        }
  }catch(e){
    console.log("ENTRO AL ERROR ")
    return res.status(500).render("error",{error:"no esta registrado"})

  }
    
} 
export async function isCart(req,res,next){
  const userSession = new UserDTO(req.session.user)
  const user = await Users.checkCart(userSession)
  if(user){
   console.log("user middleware cart",user)
  return next() 
  }
  return res.status(500).render("error",{error:"No es Admin"})
} 

  
  export function isAdmin(req,res,next){
    const user = new UserDTO(req.session.user)
    if(user.role === 'admin'){
        return next()
    }
    
    return res.status(500).render("error",{error:"No es Admin"})
} 
  export function isUseroPremium(req,res,next){
    const user = new UserDTO(req.session.user)
    if(user.role === 'admin'){
        return next()
    }if(user.role === 'premium'){
      return next()
    }
    return res.status(500).render("error",{error:"No es Admin ni Premium"})
} 