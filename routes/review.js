const express=require("express");
const router=express.Router({mergeParams : true});

//Requiring wrap async for custom error handling 
const wrapAsync=require("../utils/wrapAsync");

//Requiring custom error class for displaying custom message and not use default express middleware
const ExpressError=require("../utils/expressError");

//Requiring review model (or Review Collection in mongodb)
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//For validation using Joi
const {reviewSchema}=require("../schema.js");

//Requiring function for user authentication
const {isLoggedIn,validateReview, isAuthor}=require("../utils/middleware.js");

//Requiring review controller
const reviewController=require("../controller/reviews.js");

//Review Route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.new));

//Review Delete Route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.delete));

module.exports=router;