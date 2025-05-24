//Requiring review model (or Review Collection in mongodb)
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.new=async (req,res,next)=>{

    const { id } = req.params;
    const listing = await Listing.findById(id);

    const { rating, comment } = req.body.review;

    const newReview = new Review({
        rating: parseInt(rating),
        comment: comment
    });

    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created !");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
    req.flash("success","Review Successfully Deleted !");
    res.redirect(`/listings/${id}`);
};