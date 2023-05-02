import  express  from "express";
import  productManager  from "./test1.js";
const app = express()
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//CON QUERY  ?ID=

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    let quantity = products.length; 
    if(limit){
                if(limit <= quantity ){
                    return res.status(200).json(products.slice(0,limit));
                }else{
                    return res.status(400).json({message:"error No tenemos esa cantidad"});
                }
            }
         return res.status(201).json(products);
    });

app.get('/products/:id', async (req, res) => {
    const idSearch = req.params.id;
    const product = await productManager.getProductsById(idSearch);
    return res.json(product)
    });

//POST = CREAR
app.post('/products', async (req, res) => {
     let newProduct = req.body;
   const product = await productManager.addProduct({id: (Math.random()* 1000000).toFixed(0),...newProduct})
   if (!product) {
    res.status(200).json({ message: "Producto agregado con éxito"});
} else {
    res.status(409).json({ error: "no se pudo crear"})
}
   
    });

//PUT = MODIFICAR
app.put('/products/:id', async (req, res) => {
const datosNuevosUsuario = req.body;
const idSearch = req.params.id;
await productManager.updateProduct(idSearch,datosNuevosUsuario);
return res.status(200).json({message: "producto actualizado"})
});


//ELIMINAR
app.delete('/products', async (req, res) => {
});