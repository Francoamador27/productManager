import url from "url"
import { ProductsModel } from "../DAO/models/products.model.js";
import CustomError from "../errors/custom-error.js";
import EErrors from "../errors/enums.js";
const Products = new ProductsModel;

export class ProductsService{

    async getProducts(limit,page,category,order,maxPrice,currentUrl){
        let filters = {};
        let defaultOrder = 'asc';
         order = order || defaultOrder;
       if (maxPrice) {
        filters.price = { $lte: maxPrice };
        }
        if (category) {
            filters.category = { $regex: category, $options:'i' };
          }
         const dataProducts = await Products.getAll(filters,limit,page, order);
         if(!dataProducts){
            CustomError.createError({
                name:"Products get All",
                cause:"No se pudieron obtener los datos",
                message:"Los productos no se pudieron encontrar",
                code: EErrors.PRODUCTS_NO_FIND,
            })
         }
         const {docs, ...rest} = dataProducts;
         let products =  docs.map((doc)=>{
             return {id: doc.id,
                  title: doc.title, 
                  price:doc.price,
                  description: doc.description,
                  thumbnail: doc.thumbnail,
                  stock:doc.stock,
                 category: doc.category}
         })
         let pagination = rest;
         if(pagination.hasNextPage){
             let parsedUrl = url.parse(currentUrl,true)
             parsedUrl.query.page= pagination.nextPage;
             let nextLink = url.format({
                 pathname: parsedUrl.pathname,
                 query : parsedUrl.query,
             })
             pagination.nextLink = nextLink;
         }
         if(pagination.hasPrevPage){
             let parsedUrl = url.parse(currentUrl,true)
             parsedUrl.query.page= pagination.prevPage;
             let prevLink = url.format({
                 pathname: parsedUrl.pathname,
                 query : parsedUrl.query,
             })
             pagination.prevLink = prevLink;
         }
        return {products,pagination};
    }

    async getById(_id){
        const product = await Products.getById(_id)
  
        if(!product){
            CustomError.createError({
                name:"User creation errror",
                cause:"El id no se encontro",
                message:"Ese producto no se encontro",
                code: EErrors.PRODUCTS_NO_FIND,
            })
        }
       return product;
   }
   
    async createOne(newProduct){
        try{

            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail ||
               !newProduct.code ||
               !newProduct.category ||
               !newProduct.stock
            ){CustomError.createError({
                name:"Completar campos",
                cause:"Algunos de los Campos no existe, ",
                message:"Controlar que esten completos los campos",
                code: EErrors.INVALID_TYPES_ERROR,
            })
            }

            let title = newProduct.title  ;
            let description = newProduct.description ;
            let price = parseInt(newProduct.price) ;
            let code = newProduct.code ;
            let stock = parseInt(newProduct.stock);
            let category = newProduct.category;
            let thumbnail =newProduct.thumbnail;
            const productCreated = await Products.createOne(title, price,description,code,thumbnail,category,stock);
            return productCreated;
         }catch(e){
            throw new Error("<Error inesperado>")
            }
    }
    
    async deletOne(_id){
       try{
          if(_id){
             let productDelet = await Products.deletOne(id);
             return productDelet;
        }
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }
    async updateOne(_id,updateData){
        try{
            const updatedProduct = await Products.updateOne(_id,updateData)
            return updatedProduct;
         }
        catch(e){
        throw  new Error("Error")     
        }
     }
   
   async updateStock(_id,updateStock){
    try{
        const filtro = { _id: _id };
        const actualizacion = { $set: { stock: updateStock } }; // Nuevo valor del stock que quieres establecer
      
        let productUpdate = await Products.updateOne(filtro, actualizacion) 
        return productUpdate;
     }
    catch(e){
    throw  new Error("Error")     
    }
 }

 async creatProductNoStock(_id,productsNoStock){
    try{
      
        const filtro = { _id: _id };
        const actualizacion = { $set: { productsNoStock: productsNoStock } };
        let productUpdate = await Products.updateOne(filtro, actualizacion) 
        return productUpdate;
     }
    catch(e){
    throw  new Error("Error")     
    }
 }

   
}