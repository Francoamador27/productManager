import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const schema = new Schema({
  firstName: { type: String, required: false, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique:true },
  password: { type: String, required: false, max: 100,  },
  cart: { type: String , required: false,  },
  age: {type: Number,max: 100 ,required: false },
  role: { type: String, default:"user", required: false },
  status: { type: String, default:"not-require", required: false },
  lastConnection: {
    type: Number, // Tipo de datos: número
    default: () => Date.now(), // Valor predeterminado: fecha actual en números
  },  documents: {
    dniFile: String,
    domicilioFile: String,
    cuentaFile: String,
  },
});
schema.plugin(mongoosePaginate);

export const UserModel = model("users", schema);
