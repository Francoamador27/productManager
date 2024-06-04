import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const schema = new Schema({
  title: { type: String, required: true, },
  description: { type: String, required: true, },
  price: { type: Number },
  money: { type: String },
  code: { type: String, required: true, unique: true },
  thumbnail: { type: Array, max: 100, },
  category: { type: String, required: true, },
  phonenumber: { type: Number, required: false, },
  location: {
    lat: {
      type: String,
      default: '',
    },
    lng: {
      type: String,
      default: '',
    },
  },
  ubicacion: { type: Object, default: { departamento: '', ciudad: '' } },
  availability: { type: Object, required: false, default: {} },
  owner: { type: String, required: true, },

});

schema.plugin(mongoosePaginate);
export const ProductsSchema = model("products", schema);
