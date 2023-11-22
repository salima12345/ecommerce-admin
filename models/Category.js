import mongoose, {model, Schema, models} from "mongoose";

const CategorySchema=new Schema({
    name:{type:String, required:true},
    parent:{type:mongoose.Types.ObjectId, ref:'Category'},
    image: [{type:String}],
    
    properties: [{type:Object}]



   


});
export const Caterogy = models.Category || model('Category', CategorySchema);