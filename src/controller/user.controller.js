import { UserService } from "../services/users.services.js";
import { transport } from "../utils/utils.js";

const Service = new UserService();

class UserController{
 async getAll (req, res) {
    try {
          var currentUrl = req.url;
          const {page} = req.query;
          let {lastTwo}= req.query;
          const {limit}= req.query;
          const{role} = req.query;
          const status = req.query.status || "";
          const data = await Service.getAll(limit,page,status,currentUrl,lastTwo,role);
      return res.status(200).json({
        status: "success",
        msg: "listado de usuarios",
        data: data,
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  async getOnebyEmail (req, res)  {
    try{
    const email = req.params.email;
    let userFound = await Service.findOnebyEmail(email)
    return res.status(201).json({
      status: "success",
      msg: "user found",
      data: userFound,
    });
    }catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }

  async deletOne (req, res){
    try{
    const _id = req.params.id;

    let userDelet = await Service.deletOne(_id)
    let email = userDelet.email;
    transport.sendMail({
      from:'Su usuario fue eliminado',
      to: email,
      subject:'Usuario Eliminado de Coderhouse proyect Franco',
      html:`
      <div>
          <h1>Usuario Eliminado de Coderhouse proyect Franco </h1>
          </div>
      `
   }) 
    return res.status(201).json({
      status: "success",
      msg: "user deleted",
      data: userDelet,
    });
    }catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }   
}
  async deletOldConection (req, res){
    try{
    let usersDeleted = await Service.deletOldConection();

    return res.status(201).json({
      status: "success",
      msg: "user deleted",
      data: usersDeleted,
    });
    }catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }   
}
async updateOne (req, res) {
  const _id  = req.params.id;
  const { firstName, lastName, email } = req.body;
  try {
    let userUptaded = await Service.updateOne(_id,firstName, lastName, email)
    return res.status(201).json({
      status: "success",
      msg: "user uptaded",
      data: userUptaded,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
}
async updatePremium (req, res) {
  const id  = req.params.id;
  console.log(id)
  try {
    let userUptaded = await Service.updatePremium(id)
    return res.status(201).json({
      status: "success",
      msg: "user uptaded",
      data: userUptaded,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
}


async uploadDocuments (req, res) {
  try {
    const id = req.params.id
    
    const dniFile = req.files['dni'][0].filename; 
    const domicilioFile = req.files['domicilio'][0].filename;
    const cuentaFile = req.files['cuenta'][0].filename;
    const newDocumentProperties = {
      dniFile: dniFile,
      domicilioFile: domicilioFile,
      cuentaFile: cuentaFile,
    };
    let userUptaded = await Service.updateDocuments(id,newDocumentProperties)
    return res.status(201).render('archivos-enviados',{userUptaded});

  
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
}
}

export const userController = new UserController();