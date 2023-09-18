import  express  from "express";
import { prodructsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
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
import config from "./config/config.js";
import { mailRouter } from "./routes/mail.router.js";
import compression from "express-compression";
import errorHandler from "./middleware/error.js"
import { __dirname, connectMongo } from "./utils/utils.js";
import cluster from "cluster";
import os from "os";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-Ui-Express";
import { body, query } from "express-validator";

const app = express()
const port = config.port;


const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});


connectMongo();
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Proyecto Coder",
      description: "Proyecto de Ecommerce Node",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
//SANITIZACION 
//SANITIZACION 
app.use(body().escape());
app.use(query().escape());
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());


//SESSION
app.use(
  session({
    store: MongoStore.create({
       mongoUrl: config.mongoUrl, ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

//PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
connectSocket(httpServer);

app.engine("handlebars",handlebars.engine());
console.log(__dirname)
app.set("views",path.join(__dirname, "views"))
app.set('view engine','handlebars');

app.use("/api/products",prodructsRouter)
app.use("/api/users",usersRouter)
app.use("/api/sessions",sessionsRouter)
app.use("/api/mail",mailRouter)
app.use("/",viewsRouter)


app.use(errorHandler);


app.use("/api/carts",cartsRouter)
app.use("/auth",authRouter)
app.use(compression({
  brotli:{enabled:true,zlib:{}}
}));





  


export default app;

