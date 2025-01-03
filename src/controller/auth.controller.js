import jwt from 'jsonwebtoken';
import { createHash, isValidPassword, transport } from "../utils/utils.js";
import { UserService } from '../services/users.services.js';
import { ProductsService } from '../services/products.services.js';
import { UserDTO } from '../DAO/DTO/user.dto.js';

const secretKey = 'tu_clave_secreta';
const Service = new UserService();
const Products = new ProductsService()
class AuthController{

    async renderLogin  (req, res) {
        return res.render("login",{})
        }
    async login  (req, res) {
        if (!req.user) {
          return res.json({ error: 'invalid credentials' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role };
        let lastLoginDate = Date.now();
        await Service.updateConection(req.user.email,lastLoginDate)
        return res.redirect("/products")
      }
    async perfil  (req, res)  {
        const user = req.session.user
        let vfyUoA= false;
        if(req?.session?.user?.email){
          let role = req.session.user.role
          if (role === "admin" || role === "premium") {
             vfyUoA= true;
          }
          let userBd = await  Service.findOnebyEmail(user.email)
          userBd = new UserDTO(userBd)
          console.log(userBd)
          return res.render("perfil",{user,vfyUoA})
        }
      }
    async logut (req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render("error",{error:"error"})
            }
            return res.redirect("/auth/login")
                })
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
  
      async recoverSendEmail(req, res) {
        try {
          const { email } = req.body;
    
          // Genera el token con vencimiento
          const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    
          const mailOptions = {
            from: '"Recuperar contraseña" <info@experienciascordoba.com.ar>',
            to: email,
            subject: 'Recuperar contraseña',
            html: `
                <div>
                  <img src="https://experienciascordoba.com.ar/logohorizontal.png" alt="Logo" style="width: 200px; height: auto;" />
                  <h1>¡Recupera tu contraseña!</h1>
                  <p>Recupera tu contraseña haciendo <a href="${process.env.API_URL}/auth/recover-pass?code=${token}">Click Aquí</a></p>
                </div>
              `,
          };
          await transport.sendMail(mailOptions);
          return res.status(200).json({
            status: 'enviado',
            message: "Se ha enviado un correo electrónico para la recuperación de contraseña. Por favor, revisa tu bandeja de entrada.",
          });
        } catch (error) {
          console.error('Error enviando correo:', error);
          return res.status(500).send('Error enviando correo');
        }
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
           console.log(code)
          const email = req.body.email;
          const password = req.body.password;
          // Verifica el token utilizando la clave secreta
          const decoded =  jwt.verify(code, secretKey);
          const emailDecoded = decoded.email;
          console.log(emailDecoded,"email decodificado")
          if(email===emailDecoded){
           let passwordHash = createHash(password)
           let userEmail = await Service.findOnebyEmail(email);
           let passwordDb = userEmail.password;
      
           let valid = isValidPassword(password,passwordDb)
            if(valid){
              res.render("recover-pass",{email,code,vfyPassword})

            }else{
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