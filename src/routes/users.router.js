import  express  from "express";
 export const usersRouter = express.Router();
import { UserService } from "../services/users.services.js";

const Service = new UserService()

usersRouter.get("/", async (req, res) => {
  try {
    const users =await Service.getAll();
    return res.status(200).json({
      status: "success",
      msg: "listado de usuarios",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.post("/", async (req, res) => {
    const { firstName, lastName, email } = req.body;
    try {
      let userCreated =  await Service.createOne(firstName, lastName, email);
      return res.status(201).json({
        status: "success",
        msg: "user created",
        data: userCreated,
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });
  

  usersRouter.delete('/:id', async (req, res) => {
    try{
    const _id = req.params.id;
    userDelet = await Service.deletOne(_id)
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
    
});
usersRouter.put("/:id", async (req, res) => {
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
});
