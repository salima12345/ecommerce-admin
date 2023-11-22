import {mongooseConnect} from "@/lib/mongoose";
import { Caterogy } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { isAdminRequest } from "./auth/[...nextauth]";



export default  async  function handle(req,res)
   { const{method}=req;
    await mongooseConnect();
    await isAdminRequest(req,res);
    
   

    
    if (method === 'GET') {
       res.json(await  Caterogy.find().populate('parent'));
      }
   
    if (method === 'POST'){
        const {name,parentCategory,image, properties} = req.body;
        const categoryDoc = await Caterogy.create({
            name,
            parent: parentCategory || undefined,   
            image,
            
            properties,

          });
          res.json(categoryDoc);

    }

    if (method === 'PUT') {
       
      
      try {
        const {name,parentCategory, properties,imageCat,_id} = req.body;
        const categoryDoc = await Caterogy.updateOne({_id},{
         
          name,
          parent: parentCategory || undefined,
          image: imageCat,
          
          properties,
         
        },
        { new: true }

        );
        res.json(categoryDoc);

      } catch (error) {
        console.error('Error in PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    }
    
    

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Caterogy.deleteOne({_id});
        res.json('ok');
      }}