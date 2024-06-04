import url from "url"
import { ProductsModel } from "../DAO/models/products.model.js";
import CustomError from "../errors/custom-error.js";
import EErrors from "../errors/enums.js";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { __dirname } from "../utils/utils.js";
import fs from "fs";

const Products = new ProductsModel;

export class ProductsService {

    async getProducts(limit, page, category, order, maxPrice, currentUrl, owner) {
        try {
            let filters = {};
            let defaultOrder = 'asc';
            order = order || defaultOrder;
            if (owner && owner !== "admin") {
                filters.owner = { $regex: owner, $options: 'i' };
            }
            if (maxPrice) {
                filters.price = { $lte: maxPrice };
            }
            if (category) {
                filters.category = { $regex: category, $options: 'i' };
            }
            const dataProducts = await Products.getAll(filters, limit, page, order);
            if (!dataProducts) {
                CustomError.createError({
                    name: "Products get All",
                    cause: "No se pudieron obtener los datos",
                    message: "Los productos no se pudieron encontrar",
                    code: EErrors.PRODUCTS_NO_FIND,
                })
            }
            const { docs, ...rest } = dataProducts;
            let products = docs.map((doc) => {
                return {
                    id: doc.id,
                    title: doc.title,
                    price: doc.price,
                    money: doc.money,
                    description: doc.description,
                    thumbnail: doc.thumbnail,
                    ubicacion: doc.ubicacion,
                    stock: doc.stock,
                    category: doc.category
                }
            })
            let pagination = rest;
            if (pagination.hasNextPage) {
                let parsedUrl = url.parse(currentUrl, true)
                parsedUrl.query.page = pagination.nextPage;
                let nextLink = url.format({
                    pathname: parsedUrl.pathname,
                    query: parsedUrl.query,
                })
                pagination.nextLink = nextLink;
            }
            if (pagination.hasPrevPage) {
                let parsedUrl = url.parse(currentUrl, true)
                parsedUrl.query.page = pagination.prevPage;
                let prevLink = url.format({
                    pathname: parsedUrl.pathname,
                    query: parsedUrl.query,
                })
                pagination.prevLink = prevLink;
            }
            return { products, pagination };

        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    }

    async getUbicacions() {
        try {
            const ubicaciones = await Products.getUbicaciones();
            const groupedLocations = {};
            ubicaciones.forEach(product => {
                const { departamento, ciudad } = product.ubicacion;
                
                if (!groupedLocations[departamento]) {
                    groupedLocations[departamento] = new Set();
                }
                groupedLocations[departamento].add(ciudad);
            });
            
            // Convierte el objeto en el formato deseado
            const result = Object.keys(groupedLocations).map(departamento => ({
                departamento,
                ciudades: Array.from(groupedLocations[departamento])
            }));
            return result;
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    }

    async checkOwner(_id, owner) {
        try {
            const product = await Products.checkOwner(_id, owner);
            return product;

        } catch (e) {
            CustomError.createError({
                name: "User creation errror",
                cause: "El producto no tiene owner",
                message: "Ese producto no se encontro",
                code: EErrors.PRODUCTS_NO_FIND,
            })
        }
    }
    async getById(_id) {

        const product = await Products.getById(_id);
        if (!product) {
            CustomError.createError({
                name: "User creation errror",
                cause: "El id no se encontro",
                message: "Ese producto no se encontro",
                code: EErrors.PRODUCTS_NO_FIND,
            })
        }
        return product;
    }
    async createOne(newProduct) {
        try {

            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail ||
                !newProduct.category ||
                !newProduct.phonenumber
            ) {
                CustomError.createError({
                    name: "Completar campos",
                    cause: "Algunos de los Campos no existe, ",
                    message: "Controlar que esten completos los campos",
                    code: EErrors.INVALID_TYPES_ERROR,
                })
            }

            let title = newProduct.title;
            let description = newProduct.description;
            let price = parseInt(newProduct.price);
            let code = uuidv4();
            let phonenumber = parseInt(newProduct.phonenumber);
            let category = newProduct.category;
            let thumbnail = newProduct.thumbnail;
            newProduct.location = {};
            newProduct.location.lat = newProduct.lat;
            newProduct.location.lng = newProduct.lng;
            let location = newProduct.location;
            let currencytype = newProduct.currencytype;
            let availability = newProduct.availability;
            let owner = newProduct.owner;
            const productCreated = await Products.createOne(title, currencytype, price, description, code, thumbnail, category, phonenumber, location, availability, owner);
            return productCreated;
        } catch (e) {
            console.log(e)
            throw new Error("<Error inesperado>")
        }
    }
    async createGallery(newProduct) {
        try {

            if (!newProduct.title || !newProduct.description || !newProduct.price ||
                !newProduct.category || !newProduct.thumbnail ||
                !newProduct.phonenumber
            ) {
                CustomError.createError({
                    name: "Completar campos",
                    cause: "Algunos de los Campos no existe, ",
                    message: "Controlar que esten completos los campos",
                    code: EErrors.INVALID_TYPES_ERROR,
                })
            }

            let title = newProduct.title;
            let description = newProduct.description;
            let price = parseInt(newProduct.price);
            let code = uuidv4();
            let phonenumber = parseInt(newProduct.phonenumber);
            let category = newProduct.category;
            newProduct.location = {};
            newProduct.location.lat = newProduct.lat;
            newProduct.location.lng = newProduct.lng;
            let location = newProduct.location;
            let currencytype = newProduct.currencytype;
            let availability = newProduct.availability;
            let ubicacion = newProduct.ubicacion;
            let money = newProduct.money;
            let thumbnail = newProduct.thumbnail
            let owner = newProduct.owner;
            const productCreated = await Products.createGallery(title, currencytype, price, description, code, category, phonenumber, location, availability, owner, thumbnail, money, ubicacion);
            return productCreated;
        } catch (e) {
            console.log(e)
            throw new Error("<Error inesperado>")
        }
    }

    async deletOne(_id) {
        try {
            if (_id) {
                let data = await this.getById(_id);
                logger.info({ message: "Producto encontrado", data: data })
                console.log("data.thumbnail", data.thumbnail)
                data.thumbnail.forEach(element => {
                    console.log("borrar", element)
                    this.deleteImage(_id, element);

                });
                let productDelet = await Products.deletOne(_id);

                return productDelet;
            }
        }
        catch (e) {
            logger.error({ message: e.message })
            throw new Error("Nuevo error")
        }
    }
    async updateOne(_id, updateData) {
        try {
            await this.getById(_id);

            const updatedProduct = await Products.updateOne(_id, updateData)
            return updatedProduct;
        }
        catch (e) {
            console.log(e)
            throw new Error("Nuevo error")
        }
    }

    async updateStock(_id, updateStock) {
        try {
            const filtro = { _id: _id };
            const actualizacion = { $set: { stock: updateStock } }; // Nuevo valor del stock que quieres establecer

            let productUpdate = await Products.updateOne(filtro, actualizacion)
            return productUpdate;
        }
        catch (e) {
            throw new Error("Error")
        }
    }

    async creatProductNoStock(_id, productsNoStock) {
        try {

            const filtro = { _id: _id };
            const actualizacion = { $set: { productsNoStock: productsNoStock } };
            let productUpdate = await Products.updateOne(filtro, actualizacion)
            return productUpdate;
        }
        catch (e) {
            throw new Error("Error")
        }
    }


    async deleteImage(_id, imageName) {
        try {
            const product = await this.getById(_id);
            if (!product) {
                return { success: false, errorCode: 404, message: 'Product not found' };
            }
            const imageIndex = product.thumbnail.indexOf(imageName);
            if (imageIndex === -1) {
                return { success: false, errorCode: 404, message: 'Image not found in product' };
            }
            const imagePath = path.join(__dirname, '/public/products/', imageName);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return { success: false, errorCode: 404, message: 'Image file not found' };
                    }
                    return { success: false, errorCode: 500, message: 'Error deleting the image' };
                }
            });
            product.thumbnail.splice(imageIndex, 1);
            const updatedProduct = await this.updateOne(_id, product);

            return { success: true, data: updatedProduct };
        } catch (error) {
            return { success: false, errorCode: 500, message: 'Internal Server Error' };
        }
    }
}