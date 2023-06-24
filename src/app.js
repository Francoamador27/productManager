import  express  from "express";
import { prodructsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { testRouter } from "./routes/test.router.js";
import { __dirname, connectMongo } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars"
import { viewsRouter } from "./routes/views.router.js";
import cors from "cors";
import { connectSocket } from "./sockets/chat.js";
import { usersRouter } from "./routes/users.router.js";
import { authRouter } from "./routes/auth.router.js";
import cookieParser from 'cookie-parser';
import session from "express-session";
import MongoStore from 'connect-mongo'
import { iniPassport } from "./config/passport.config.js";
import passport from "passport";
import {  sessionsRouter } from "./routes/session.router.js";
const app = express()
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
connectSocket(httpServer);
connectMongo();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());
// "mongodb+srv://francohugoamador25:5n0UFpBjSqF7loFG@cluster0.ad24vck.mongodb.net/ecommerce?retryWrites=true&w=majority"

//SESSION
app.use(
  session({
    store: MongoStore.create({
       mongoUrl: "mongodb+srv://francohugoamador25:5n0UFpBjSqF7loFG@cluster0.ad24vck.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);
//PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars",handlebars.engine());
app.set("views",path.join(__dirname, "views"))
app.set('view engine','handlebars');

app.use("/api/products",prodructsRouter)
app.use("/api/users",usersRouter)
app.use("/api/sessions",sessionsRouter)
app.use("/",viewsRouter)


app.use("/api/carts",cartsRouter)
app.use("/home",testRouter)
app.use("/auth",authRouter)






  



//CON QUERY  ?ID=

