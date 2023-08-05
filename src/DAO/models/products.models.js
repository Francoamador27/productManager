import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const schema = new Schema({
  title: { type: String, required: true,  },
  price: { type: Number, required: true },
  description: { type: String, required: true,  },
  code: { type: String, required: true,  unique:true },
  thumbnail: { type: String,  max: 100, },
  category: { type: String, required: true,  },
  stock: { type: Number, required: true,  },

});

schema.plugin(mongoosePaginate);
export const ProductsModel = model("products", schema);
