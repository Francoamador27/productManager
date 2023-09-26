import { UserDTO } from "../DAO/DTO/user.dto.js"
import { ProductsService } from "../services/products.services.js"
import { UserService } from "../services/users.services.js"
const Products = new ProductsService()
let Users = new UserService
// Medialware Admin
export function isUser(req,res,next){
  try{
    if(req?.session?.user.email){
      return next()
        }
  }catch(e){
    return res.status(500).render("error",{error:"no esta registrado"})

  }
    
} 
export async function isCart(req,res,next){
  const userSession = new UserDTO(req.session.user)
  const user = await Users.checkCart(userSession)
  if(user){
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
  export function iAdminoPremium(req,res,next){
    const user = new UserDTO(req.session.user)
    if(user.role === 'admin'){
        return next()
    }if(user.role === 'premium'){
      return next()
    }
    return res.status(500).render("error",{error:"No es Admin ni Premium"})
} 
export async function checkOwner(req,res,next){
  try{

    let owner = req.session.user.email;
    let userRole = req.session.user.role;
    const _id = req.params.id;
    if(userRole === 'admin'){
      return next();
    }
    let checkProduct = await Products.checkOwner(_id,owner)
  if(checkProduct){
    return next();
  }
  }catch(e){
    res.status(500).render("error", { error: "Error interno del servidor." });
  }
} 
export async function isNotOwner(req,res,next){
  try{
    let owner = req.session.user.email;
    let userRole = req.session.user.role;
    const _id = req.params.pid;
    console.log("id en el middelware",_id)
    if(userRole === "admin"){
      return next();
    }      
      const product = await Products.getById(_id);
      console.log(product)
      if (product && product.owner === owner) {
        // Si el usuario está intentando comprar su propio producto, responde con un error 400 (Solicitud incorrecta)
        return res.status(400).render("error", { error: "No puedes comprar tu propio producto." });
      }
      return next();

  }catch(e){
    res.status(500).render("error", { error: "Error interno del servidor." });
  }

}

export async function checkDocuments(req,res,next){
  let email = req.session.user.email;
  let userRole = req.session.user.role;
  const _id = req.params.id;
  if(userRole === 'admin'){
   return next();
  }
  const productCheck = await Products.checkOwner(_id,owner); 
  if (!productCheck) {
      // Si no se encuentra el producto, puedes lanzar un error de permiso
      return res.status(500).render("error",{error:"No tienes permiso para este producto"})
    }        
    return next()
} 