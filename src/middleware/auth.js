import { UserDTO } from "../DAO/DTO/user.dto.js"
import { ProductsService } from "../services/products.services.js"
import { UserService } from "../services/users.services.js"
const Products = new ProductsService()
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
export async function checkOwner(req,res,next){
  let owner = req.session.user.email;
  let userRole = req.session.user.role;
  const _id = req.params.id;
  if(userRole === 'admin'){
   next();
  }
  const productCheck = await Products.checkOwner(_id,owner); 
  if (!productCheck) {
      // Si no se encuentra el producto, puedes lanzar un error de permiso
      return res.status(500).render("error",{error:"No tienes permiso para este producto"})
    }        
    return next()
} 