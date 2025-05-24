const Listing=require("../models/listing");
const Review = require("../models/review");
const ExpressError=require("../utils/expressError");
const {listingSchema,reviewSchema,userSchema}=require("../schema.js");

module.exports.validateListing= async(req,res,next)=>{
       let {error}=listingSchema.validate(req.body);
       if(error){
              let errMsg=error.details.map((el)=>el.message).join(",");
              throw new ExpressError(400,errMsg);
       }else{
              next();
       }
};
//Custom function to validate the request so no one can send request with partial body and that would not be inserted into database
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};
module.exports.validateUser= (req,res,next) =>{
    let {error} = userSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.rurl = req.originalUrl;
        req.flash("err", "Please log in to create new listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.redirectUrl = (req, res, next) => {
    if (req.session.rurl) {
        res.locals.redirectUrl = req.session.rurl;  // ✅ use `redirectUrl`
        delete req.session.rurl;  // ✅ clear it after using
    } else {
        res.locals.redirectUrl = "/listings";  // fallback
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
       let {id}=req.params;
       let listing=await Listing.findById(id);
    if(res.locals.currUser && !res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("err","only listing owner allowed to update or delete !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
       let {id,reviewId} = req.params;
       let review = await Review.findById(reviewId);
       if(res.locals.currUser && !res.locals.currUser._id.equals(review.author._id)){
           req.flash("err","only review author allowed to update or delete !");
           return res.redirect(`/listings/${id}`);
       }
       next();
}
 
