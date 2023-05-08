import  express  from "express";
import { prodructsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
const app = express()
const port = 8080;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/api/products",prodructsRouter)
app.use("/api/carts",cartsRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//CON QUERY  ?ID=

