//Requiring Listing model (or Listing collection in database)
const Listing = require("../models/listing");

//Requiring mapbox for forward geocoding
const geocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const token=process.env.MAP_TOKEN;
const geocodingClient=geocoding({accessToken:token});
module.exports.newlist=  (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.newlistp=async (req, res, next) => {

    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit:1,
    })
    .send();

       let url=req.file.path;
       console.log(url);

       let filename=req.file.filename;
       console.log(filename);

       let newlist = req.body.listing;
       let newListing = new Listing(newlist);

       newListing.owner=req.user._id;
       newListing.image={url,filename};
       newListing.geometry=response.body.features[0].geometry;
       await newListing.save().then((res) => {
       console.log(res);
       });
       req.flash("success","New Listing Created");
     res.redirect("/listings");
 };

module.exports.index=async (req, res, next) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.edit=async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let originalUrl=listing.image.url;
    let newUrl=originalUrl.replace("/upload","/upload/w_250");
    if(!listing){
        req.flash("err","Listing doesn't exist !");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs", { listing ,newUrl});
    }
    
};
// module.exports.pedit=async (req, res,next) => {
//        let { id } = req.params;
//        let body = req.body.listing;
       
//        let url=req.file.path;
//        console.log(url);

//        let filename=req.file.filename;
//        console.log(filename);

//        body.image={url,filename};

//        console.log(body);
//        let updateList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//        console.log(updateList);
//        req.flash("success","Successfully edited this listing");
//        res.redirect(`/listings/${id}`);
// };
 module.exports.pedit=async (req, res,next) => {
       let { id } = req.params;
       let body = req.body.listing;

// //     if(!body){
// //        next(new ExpressError(400,"Please Give Data"));
// //     }
       console.log(body);
       let updateList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

       if(req.file){
              let url=req.file.path;
              console.log(url);

              let filename=req.file.filename;
              console.log(filename);
              updateList.image={url,filename};
              await updateList.save();
       }

       console.log(updateList);
       req.flash("success","Successfully edited this listing");
       res.redirect(`/listings/${id}`);
};

module.exports.show=async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path :"reviews",populate:{path : "author"}}).populate("owner");
    if(!listing){
        req.flash("err","Listing you are trying to access doesn't exist !");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs", { listing });
    }
};

module.exports.delete=async (req, res, next) =>{
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing !");
    res.redirect("/listings");
};

