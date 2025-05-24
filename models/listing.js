const mongoose=require("mongoose");
const { type } = require("../schema");
const Schema=mongoose.Schema;
const Review=require('./review');
const User=require('./user');

const listingSchema=new Schema({
       title:{
              type:String,
              required:true,
       },
       description:{type:String},
       image:{
       //        type:String,
       //        default:"https://media.istockphoto.com/id/1413054619/photo/3d-rendering-of-modern-house-with-wood-plank-facade-by-the-sea-or-ocean-on-sunset.jpg?s=612x612&w=0&k=20&c=VLnV7ph1aJgHwUZLJeRgsJe9vKsiY1AbwrxCeMGCk94=",
       //        set:(v)=>v===""?"https://media.istockphoto.com/id/1413054619/photo/3d-rendering-of-modern-house-with-wood-plank-facade-by-the-sea-or-ocean-on-sunset.jpg?s=612x612&w=0&k=20&c=VLnV7ph1aJgHwUZLJeRgsJe9vKsiY1AbwrxCeMGCk94=":v,
              filename:String,
              url:String,
       },
       price:{type:Number},
       location:{type:String},
       country:{type:String},
       reviews:[
              {
                     type:Schema.Types.ObjectId,
                     ref : "Review",
              }
       ],
       owner:{
              type:Schema.Types.ObjectId,
              ref:"User",
       },
       geometry:{
              type:{
                     type:String,
                     enum:["Point"],
                     required:true,
              },
              coordinates:{
                     type:[Number],
                     required:true,
              }
       }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
       if(listing){
              await Review.deleteMany({_id : {$in : listing.reviews}});
       }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports =Listing;



