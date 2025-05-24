//Requiring to fetch env variables
require('dotenv').config();

//Defining Port
const port = process.env.PORT || 8080;

//using mongodb url
const urldb=process.env.ATLAS_URL;

//Requiring express
const express = require("express");
const app = express();

//Requiring mongoose
const mongoose = require("mongoose");
const path = require("path");

//Requiring passport for authentication implementation 
const passport=require("passport");
const LocalStrategy= require("passport-local");

//Requiring user model  
const User=require("./models/user.js");

//Requiring Session 
const session = require('express-session');

//Requiring mongo store for session storage
const MongoStore=require('connect-mongo');

//Requiring flash to diaplay message
const flash=require('connect-flash');

//MongoStore
const store=MongoStore.create({
    mongoUrl:urldb,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo store",err);
});

//Variable to store session options 
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
            httpOnly:true,
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
            expires: Date.now() + 2 * 24 * 60 * 60 * 1000
    },
};

//For using session in server
app.use(session(sessionOptions));
app.use(flash());

//Using passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//First install method-override package then include this to send request like put patch delete
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate=require('ejs-mate');

//For using wrap async function to handle the errors
const wrapAsync=require("./utils/wrapAsync");

//For using custom error class instead of the default express middleware to display our custom message 
const ExpressError=require("./utils/expressError");

//Requiring routes 
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//For running server on particular port
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

//For using ejs 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs",ejsMate);

//For using express
app.use(express.static(path.join(__dirname, "public")));

//For decoding body or data passed through post request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Function to connect with the database
async function main() {
    await mongoose.connect(urldb);
}

main().then((res) => {
    console.log("Connected Successfully");
}).catch((err) => {
    console.log(err);
});

//Local storage of flash messages
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.err=req.flash("err");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


//Middleware that would redirect particular request to the file containing that routes
app.use("/",userRouter);
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);


//This will get all the request
 app.all("/*splat",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found"));
 });

//Error Handling Middleware 
app.use((err,req,res,next)=>{
       let {status=500,message="something went wrong"}=err;
       res.status(status).render("error.ejs",{err});
       //res.status(status).send(message);
});

