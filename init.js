const mongoose=require("mongoose");
let initdata=require("./init/data.js");
const Listing=require("./models/listing.js");

if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env.API_SECRET);

//Requiring mapbox for forward geocoding
const geocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const token=process.env.MAP_TOKEN;
const geocodingClient=geocoding({accessToken:token});

async function main(){
       await mongoose.connect("mongodb://localhost:27017/airbnb");
}
main().then((res)=>{
       console.log("Connected Successfully");
}).catch((err)=>{
       console.log(err);
})



// const init=async()=>{
//        let ownerId = new mongoose.Types.ObjectId("682c67268badcd9e327e145c");
//        await Listing.deleteMany({});
//            initdata = initdata.data.map((obj) => ({
//         ...obj,
//         owner: ownerId,
//         geometry:,
//     }));
//        await Listing.insertMany(initdata);
// }

const init = async()=>{
       await Listing.deleteMany({});
       let ownerId = new mongoose.Types.ObjectId("682c67268badcd9e327e145c");
       const newData=[];
       for(item of initdata.data){
       let response=await geocodingClient.forwardGeocode({
       query: item.location,
       limit:1,
       })
       .send();
       const geometry=response.body.features[0]?.geometry||{type:"Point",coordinates:[72,72]};
       
       newData.push({
              ...item,
              owner:ownerId,
              geometry:geometry,
       });
       }
       await Listing.insertMany(newData);
       
};
init().then(()=>{
       console.log("Data Inserted Successfully");
}).catch((err)=>{
       console.log(err);
});