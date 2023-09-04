import jwt from 'jsonwebtoken';
import { createHash, isValidPassword, transport } from "../utils/utils.js";
import { UserService } from '../services/users.services.js';

const secretKey = 'tu_clave_secreta';
const Service = new UserService();

class AuthController{

    async renderLogin  (req, res) {
        return res.render("login",{})
        }
    async login  (req, res) {
        if (!req.user) {
          return res.json({ error: 'invalid credentials' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role };
      
        return res.redirect("/products")
      }
    async perfil  (req, res)  {
        const user = {email: req.session.user.email,isAdmin: req.session.user.role}
        return res.render("perfil",{user})
        }
    async logut (req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render("error",{error:"error"})
            }
            return res.redirect("/auth/login")
                })
                // console.log(req?.session?.user,req?.session?.admin)
               }
    async register  (req, res)  {
        if (!req.user) {
          return res.json({ error: 'something went wrong' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role,cart: req.user.cart };
        return res.redirect("/products")
      }
    async failRegister  (req, res)  {
      let errorRegister = true;

      return res.render("register",{errorRegister})
    }
    async failLogin  (req, res)  {
      let errorLogin = true;
      return res.render("login",{errorLogin})
    }
    async renderRegister  (req, res) {
        return res.render("register",{})
        }
    async recoverEmail  (req, res) {
      return res.render("recover-email",{})
      }    
  
    async recoverSendEmail  (req, res) {
      const {email} = req.body;

      const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
      transport.sendMail({
        from:'Recuperar contraseña',
        to: email,
        subject:'Recover password',
        html:`
        <div>
            <h1>¡Recupera tu contraseña ! </h1>
           <p>recupera tu contraseña haciendo <a href="${process.env.API_URL}/auth/recover-pass?code=${token}" >Click Aqui</a></p>
            </div>
        `
     }) 
      return res.render("check-email",{})
    }  
    async recoverPass (req,res){
        const code = req.query.code;
        let vfy = true;
        try {
          // Verifica el token utilizando la clave secreta
          const decoded = jwt.verify(code, secretKey);
          let vfy =false;
          // El token es válido, puedes acceder a la información del usuario
          const email = decoded.email;
          res.render("recover-pass",{email,code,vfy})
        } catch (error) {
          // Si el token no es válido, maneja el error adecuadamente
          return res.render("recover-email",{vfy})
        }
      ;
    }  
    async recoverPassPost (req,res){
        try { 
          let vfyPassword = true;
           const code = req.body.code;
          const email = req.body.email;
          const password = req.body.password;
          // Verifica el token utilizando la clave secreta
          const decoded =  jwt.verify(code, secretKey);
          // El token es válido, puedes acceder a la información del usuario
          const emailDecoded = decoded.email;
          if(email===emailDecoded){
           let passwordHash = createHash(password)
           let userEmail = await Service.findOnebyEmail(email);
           let passwordDb = userEmail.password
           let valid = isValidPassword(password,passwordDb)
            if(valid){
              res.render("recover-pass",{email,code,vfyPassword})

            }else{
              console.log('usuario en db',userEmail)
              let uptadedPass = await Service.updatePassword(email,passwordHash);
              res.render("succes-pass",{email,code})
              
            }
          }else{
            res.render("recover-pass",{email,code,vfy})

          }
        } catch (error) {
          // Si el token no es válido, maneja el error adecuadamente
          res.status(401).json({ message: 'Token inválido' });
        }
      ;
    }  
}

export const authController = new AuthController();