import { UserDTO } from "../DAO/DTO/user.dto.js"

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
  
  export function isAdmin(req,res,next){
    const user = new UserDTO(req.session.user)
    if(user.role === 'admin'){
        return next()

    }
    
    return res.status(500).render("error",{error:"No es Admin"})
} 