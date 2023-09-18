import chai from "chai";
import inquirer from "inquirer";
import supertest from "supertest";

const expect = chai.expect;

const request = supertest("http://localhost:8080");


 
describe("Pruebas de rutas de productos", () => {
    it("Debería obtener todos los productos (GET /api/products)", async () => {
      const response = await request.get("/api/products");
      const body = response.body
      expect(body).to.have.property('data');
      expect(body.status).to.equal('success');
      expect(body.data).to.have.property('products');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object"); // Asumiendo que la respuesta es un arreglo de productos
    });
    it("Debería obtener un producto específico por ID: 64c6dafb0bfd35a2c3d6926d (GET /api/products/:id)", async () => {
      const idProducto = "64c6dafb0bfd35a2c3d6926d"; // Reemplaza con un ID válido de tu base de datos
      const response = await request.get(`/api/products/${idProducto}`);
      const body = response.body;
      console.log(body);
      expect(response.status).to.equal(200); // Verificar que la respuesta sea un código 200 (éxito)
      expect(body.data).to.have.property('_id', idProducto); // Verificar que el ID del producto sea el esperado
      expect(response.body).to.be.an("object"); // Asumiendo que la respuesta es un objeto de producto
    });
  });
  describe("Pruebas de rutas de Users", () => {
    it("Debería obtener todos los usuarios (GET /api/users)", async () => {
      const response = await request.get("/api/users");
      const body = response.body;
      console.log(body);
      expect(body).to.have.property('data');
      expect(body.status).to.equal('success');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object"); 
        expect(body.data).to.be.an("array");
    });
    it("Debería obtener el usuario por su mail (GET /api/users/:email)", async () => {
       let email = "francohugoamador@hotmail.com";
      const response = await request.get(`/api/users/${email}`);
      const body = response.body;
      console.log("body",body)
      expect(body).to.have.property('data');
      expect(body.status).to.equal('success');
      expect(response.status).to.equal(201);
      expect(response.body).to.be.an("object"); 
      expect(body.data.email).to.equal(email);
      expect(body.data).to.have.property('firstName');
    });
  });

  describe("Pruebas de rutas de carts", () => {
    it("Debería obtener todos los productos (GET /api/carts)", async () => {
      const response = await request.get("/api/carts");
      const body = response.body
      console.log(body);
      expect(body).to.have.property('data');
      expect(body.status).to.equal('success');
      expect(body.data).to.be.an('array');
      expect(response.status).to.equal(200);
    });
   
  });