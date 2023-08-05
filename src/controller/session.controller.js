import { UserDTO } from "../DAO/DTO/user.dto.js";

class SessionController{
  async registerGithub (req, res)  {
    req.session.user = req.user;
    // Successful authentication, redirect home.
    res.redirect('/products');
  }
  async showSession (req, res)  {
    const infoUser = new UserDTO(req.session.user)
    return res.send({user : infoUser});
  }
}

export const sessionController = new SessionController();