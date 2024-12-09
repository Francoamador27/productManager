export class ProductDTO {
  constructor(product) {
      this.id = product._id;
      this.title =product.title;
      this.currencytype =product.currencytype;
      this.price = product.price;
      this.description =product.description;
      this.code =product.code;
      this.thumbnail =product.thumbnail;
      this.category =product.category;
      this.phonenumber =product.phonenumber;
      this.owner =product.owner;

    }
  }