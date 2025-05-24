const express=require("express");
const router=express.Router({mergeParams:true});

//Requiring wrap async for custom error handling 
const wrapAsync=require("../utils/wrapAsync");

//Requiring custom error class for displaying custom message and not use default express middleware
const ExpressError=require("../utils/expressError");

//Requiring User model
const User=require("../models/user.js");

//Joi for validation
const {userSchema}=require("../schema.js");

//Requiring passport for authentication
const passport=require("passport");

//Requiring middleware to store url
const {redirectUrl,validateUser}=require('../utils/middleware.js');

//Requiring user controller
const userController=require("../controller/users.js");

router.route("/signup")
.get(wrapAsync(userController.gsignup))
.post(validateUser,wrapAsync(userController.psignup));
// router.put("");
// router.delete("");

router.route("/login")
.get(wrapAsync(userController.glogin))
.post(redirectUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash:true}),wrapAsync(userController.plogin));

router.get("/logout",wrapAsync(userController.logout));

module.exports=router;
