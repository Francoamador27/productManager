import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 100, unique:true },
  thumbnail: { type: String,  max: 100, },
  category: { type: String, required: true, max: 100 },
  stock: { type: Number, required: true, max: 100 },

});

export const ProductsModel = model("products", schema);
