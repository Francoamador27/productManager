import  express  from "express";
import { prodructsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { testRouter } from "./routes/test.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import path from "path";
import handlebars from "express-handlebars"
import { viewsRouter } from "./routes/views.router.js";
import productManager from "./productManager.js";
const app = express()
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars",handlebars.engine());
app.set("views",path.join(__dirname, "views"))
app.set('view engine','handlebars');

app.use("/api/products",prodructsRouter)
app.use("/api/carts",cartsRouter)
app.use("/test",testRouter)
app.use("/",viewsRouter)

let products = await productManager.getProducts();


 socketServer.on('connection', socket=>{
  socket.on('new-product', async data=>{
  await productManager.addProduct(data)
  })
  socket.on('delet-product', async data=>{
    console.log(data)
    await productManager.deleteProduct(data)
    })
 

  socket.emit("evento_socket_individual","este mensaje lo debe recibir el socket")
  socket.broadcast.emit("socket_para_todos_menos_actual","este evento lo recibiran todos menos el actual")
  
  socketServer.emit("products",products)
})




//CON QUERY  ?ID=

