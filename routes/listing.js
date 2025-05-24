const express=require('express');
const router=express.Router();

//Requiring wrap async for custom error handling 
const wrapAsync=require("../utils/wrapAsync");

//Requiring custom error class for displaying custom message and not use default express middleware
const ExpressError=require("../utils/expressError");

//Requiring Listing model (or Listing collection in database)
const Listing = require("../models/listing");

//For validation using Joi
const {listingSchema}=require("../schema.js");

//Requiring middleware for authentication
const { isLoggedIn, isOwner ,validateListing } = require('../utils/middleware.js');

//Requiring callback functions from controller folder
const listingController=require("../controller/listings.js");

//Requiring multer to process multipart form data
const multer=require('multer');
//Requiring cloudinary account
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});

// // New Listing Routes (MUST be before /listings/:id)
// router.get("/newlisting",isLoggedIn,listingController.newlist);

// router.post("/newlisting",isLoggedIn,validateListing, wrapAsync(listingController.newlistp));

//We can combine routes with same path but different method using router.route
router.route("/newlisting")
.get(isLoggedIn,listingController.newlist)
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.newlistp));

// List All Listings
router.get("/", wrapAsync(listingController.index));

// Edit Routes
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.edit));

router.put("/:id/editing",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.pedit));

// Show Route (must be LAST of the listing routes)
router.get("/:id", wrapAsync(listingController.show));

//Destroy route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.delete));


module.exports=router;