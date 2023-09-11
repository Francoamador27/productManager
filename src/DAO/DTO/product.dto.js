export class ProductDTO {
  constructor(product) {
      console.log("dto",product)
      this.id = product._id;
      this.title =product.title;
      this.price = product.price;
      this.description =product.description;
      this.code =product.code;
      this.thumbnail =product.thumbnail;
      this.category =product.category;
      this.stock =product.stock;
      this.owner =product.owner;

    }
  }