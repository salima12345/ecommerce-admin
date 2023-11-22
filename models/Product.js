import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  details: String,

  price: {type: Number},
  images: [{type:String}],

  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  sale: { type: Boolean, default: false }, 
  discountPercentage: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  countSales: { type: Number, default: 0 },
  properties: {type:Object},
  colors: [
    {
      name: { type: String, required: true },
      images: [{ type: String }],
    },
  ],

  
  
}, {
  timestamps: true,
}
);

export const Product = models.Product || model('Product', ProductSchema);