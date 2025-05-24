const mongoose = require('mongoose');
const initData =require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
       await mongoose.connect("mongodb://localhost:27017/air");
}

main().then(()=>{
       console.log("connected to database");
}).catch((err)=>{
       console.log(err);
});

const initialize=async()=>{
       await Listing.deleteMany({});
       await Listing.insertMany(initData.data);
       console.log("data inserted");
}
initialize();
