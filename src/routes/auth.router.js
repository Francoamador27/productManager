import  express  from "express";
 export const authRouter = express.Router();
import { UserModel } from "../DAO/models/user.models.js";
import { isUser } from "../middleware/auth.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

authRouter.get("/login", async (req, res) => {
return res.render("login",{})
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
    if (!req.user) {
      return res.json({ error: 'invalid credentials' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin };
  
    return res.json({ msg: 'ok', payload: req.user });
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

           authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
            if (!req.user) {
              return res.json({ error: 'something went wrong' });
            }
            req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin };
          
            return res.json({ msg: 'ok', payload: req.user });
          });
          
          authRouter.get('/failregister', async (req, res) => {
            return res.json({ error: 'fail to register' });
          });
          authRouter.get('/faillogin', async (req, res) => {
            return res.json({ error: 'fail to login' });
          });
          
          authRouter.get("/register", async (req, res) => {
                return res.render("register",{})
                });
