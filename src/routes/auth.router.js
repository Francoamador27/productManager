import  express  from "express";
 export const authRouter = express.Router();
import { UserModel } from "../DAO/models/user.models.js";
import { isUser } from "../middleware/auth.js";

authRouter.get("/login", async (req, res) => {
return res.render("login",{})
});

authRouter.post("/login", async (req, res) => {
    const{email, pass} = req.body
    if(!email || !pass){
        return res.render("error",{error:"email o password vacio"})

    }

    const usuarioEncontrado = await UserModel.findOne({email:email})
    if(usuarioEncontrado && usuarioEncontrado.pass == pass){
        req.session.email= usuarioEncontrado.email;
        req.session.isAdmin = usuarioEncontrado.isAdmin;
        return res.redirect("/products")
    }else{
        return res.render("error",{error:"email o password incorrecta"})
    }
    });
    

    authRouter.get("/perfil",isUser, async (req, res) => {
        const user = {email: req.session.email,isAdmin: req.session.isAdmin}
        return res.render("perfil",{user})
        });
    
    authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).render("error",{error:"error"})
        }
        return res.redirect("/auth/login")
            })
            // console.log(req?.session?.user,req?.session?.admin)
           })

        authRouter.post("/register", async (req, res) => {
            const{email, pass,firstName,lastName} = req.body
            if(!email || !pass || !firstName || !lastName){
                return res.render("error",{error:"complete todos los datos"})
            }try{
                console.log({firstName, lastName,email,pass,isAdmin: false})
              await UserModel.create({firstName, lastName,email,pass,isAdmin: false})
                    req.session.email= email;
                     req.session.isAdmin = false;
                    return res.redirect("/auth/perfil")
                

            }catch(e){
                console.log(e)
                return res.render("error",{error:"intente con otro mail, no se pudo crear"})

            }
            });
authRouter.get("/register", async (req, res) => {
    return res.render("register",{})
    });
