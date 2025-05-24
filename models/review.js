const mongoose=require('mongoose');
const { max, type } = require('../schema');
const { date, required } = require('joi');
const {Schema}=mongoose;
const User=require('./user');

const reviewSchema=new Schema({
       comment : {
              type : String,
              required : true,
       },
       rating : {
              type : Number,
              min : 1,
              max : 5,
              required : true,
       },
       created_at : {
              type : Date,
              default : Date.now,
       },
       author:{
              type:Schema.Types.ObjectId,
              ref:"User",
       }
});

module.exports = mongoose.model("Review",reviewSchema);