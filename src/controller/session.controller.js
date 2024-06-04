import { UserDTO } from "../DAO/DTO/user.dto.js";

class SessionController{
  async registerGithub (req, res)  {
    req.session.user = req.user;
    // Successful authentication, redirect home.
    res.redirect('/products');
  }
  async showSession (req, res)  {
    if(req.session.user){
      const infoUser = new UserDTO(req.session.user)
      return res.json({user : infoUser});

    }
    console.log("no se ve session");
    return(res.json("Fall"))
  }
}

export const sessionController = new SessionController();