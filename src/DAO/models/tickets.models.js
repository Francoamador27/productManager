
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const schema = new Schema({
  purchase_datetime: { type: String, required: true },
  code: { type: String, required: true,  unique:true },
  products:{
    type:[{
        product:{
             type: Schema.Types.ObjectId,
             ref:'products',
             index:true,
        },
        quantity:{type:Number},
  
    }],
    default: [],
  } ,
  amount: { type: Number,  },
  purchaser: { type: String, required: true,  },

});

schema.plugin(mongoosePaginate);
export const TicketsModel = model("tickets", schema);