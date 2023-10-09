import { CartsModel } from "../DAO/models/carts.model.js";
import { CartsSchema } from "../DAO/schema/carts.schema.js";

const Carts = new CartsModel();
export class CartsService{
    
    async getAll(){
        try{
            const carts = await Carts.getAll();
            return carts;
        }catch(e){
                console.log(e);
        }
    }
    async getById(idCart){
        let cart = await Carts.getById(idCart);

        let products =  cart.products.map((doc)=>{
            return {id: doc.product.id,
                 title: doc.product.title, 
                 price:doc.product.price,
                 description: doc.product.description,
                 thumbnail: doc.product.thumbnail,
                 stock:doc.product.stock,
                 quantity: doc.quantity,
                 subtotal: doc.quantity*doc.product.price,
                category: doc.product.category}
        })
        return products;
      }
    async createOne(){
        try{
            const cartCreated = await Carts.createOne();
                    return cartCreated;
        }catch(e){
                console.log(e)
        }
    }
    async addProdductCart(idCart,idProduct){
        try{
            let cart = await Carts.getById(idCart);
            let productIndex = cart.products.findIndex(p => p.product._id.toString() === idProduct)
            if(productIndex === -1){
            cart.products.push({product:idProduct, quantity:1});
            await Carts.updateOne(idCart,cart);
            return cart;
       }
            cart.products[productIndex].quantity++;
            await Carts.updateOne(idCart,cart);
            return cart.products;  
        }catch(e){
            throw new Error("Error")
        }
    }
    async deletProductCart(idCart,idProduct){
        try{
            let cart = await CartsSchema.findOne({_id:idCart});
            let productIndex = cart.products.findIndex(p => p.product.toString() === idProduct)
            if(cart.products[productIndex].quantity > 1){
                cart.products[productIndex].quantity--;
                await CartsSchema.updateOne({_id:idCart},cart);
                return cart;
       }
            cart.products.splice(productIndex, 1)
            await CartsSchema.updateOne({_id:idCart},cart);
            return cart.products;  
        }catch(e){
            throw new Error(e)
        }
    }

    async delectAllProducts(idCart){
      let cart =  await Carts.delectAllProducts(idCart);
      return cart;
    }


}