import fs from 'fs'


class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            const productsString = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsString);
            this.products = products;
        } else {
            await fs.promises.writeFile(path, "[]");
            const productsString = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsString);
            this.products = products;
        }
        return this.products
    }

    async addProduct(newProduct) {
        try {
            let products = await this.getProducts();
            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail ||
                !newProduct.code ||
                !newProduct.stock
            ) {
                return "Completar todos los datos"
            } else {
                if (products.some((product) => product.code === newProduct.code)) {

                    return { error: `el producto  con Sku: ",${newProduct.code}, existe` };
                } else {
                    let maxID = 0;
                    products.forEach((product) => {
                        if (product.id > maxID) {
                            maxID = product.id;
                        }
                    });
                    maxID++;
                    const id = maxID;
                    const productCompleto = { ...newProduct, id }
                    products.push(productCompleto);
                    const productsString = JSON.stringify(products, null, 2);
                    await fs.promises.writeFile(this.path, productsString);
                }
            }
            return "Producto Agregado";
        } catch (e) {
            return new Error(e)

        }

    }

    async getProductsById(idSearch) {
        try {
            let data = await this.getProducts();
            let id = parseInt(idSearch);
            const productByid = data.find(element => element.id === id);
            return productByid

        } catch (error) {
            throw new Error(error)
        }

    }

    async updateProduct(updateId, dataUpdate) {
        let products = await this.getProducts();
        const productIndex = products.findIndex(element => element.id === updateId);
        if (productIndex === -1) {
            return { error: "el producto no se encontro" }
        } else {
            if (typeof (dataUpdate) === 'object') {
                products[productIndex] = { ...products[productIndex], ...dataUpdate, id: products[productIndex].id };
                const productsString = JSON.stringify(products, null, 2);
                await fs.promises.writeFile(this.path, productsString);
                return "Producto actualizado"
            } else {
                return { error: "Debes enviar un objeto" }
            }
        }
    }

    async deleteProduct(deletId) {
        try {
            let id = parseInt(deletId);
            let products = await this.getProducts();
            const productIndex = products.findIndex(element => element.id === id);
            if (productIndex >= 0) {
                products = products.filter((item) => item.id !== id)
                const productsString = JSON.stringify(products, null, 2);
                await fs.promises.writeFile(this.path, productsString);
                return "Producto eliminado"
            }
        }
        catch (e) {
            return;
        }
    }

}


//const product1={
//  "title": "Computadora",
//"description": "Core I5",
//"thumbnail": "imagen",
// "price": 800,
//"code": "nuevo-item",
//"stock": "200"
//}

//const product = new ProductManager("./src/products.json");

//async function async(){
// await product.addProduct(product1)
//await product.getProductsById(2);
//}
//async();

export default new ProductManager("./src/persistencia/products.json");

