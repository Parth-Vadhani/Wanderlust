//Requiring User model
const User=require("../models/user.js");


module.exports.gsignup=async (req,res,next)=>{
       res.render("./users/signup.ejs");
};

module.exports.psignup=async(req,res,next)=>{
       
       try{
              let {username , email , password}=req.body.user;
              const user1=new User({username,email});
              const registeredUser=await User.register(user1, password);
              console.log(registeredUser);
              req.login(registeredUser,(err)=>{
                     if(err){
                            return next(err);
                     }else{
                            req.flash("success","Welcome to Wanderlust !");
                            res.redirect("/listings");
                     }
              })
              
              
       }catch(err){
              req.flash("err","err.message");
              res.redirect("./users/signup.ejs");
       }
};

module.exports.glogin=async(req,res,next)=>{
       res.render("./users/login.ejs");
};

module.exports.plogin=async(req,res,next)=>{
       req.flash("success","Welcome back to Wanderlust");
       const redirectTo = res.locals.redirectUrl || "/listings";
       res.redirect(redirectTo);
};

module.exports.logout=async (req,res,next)=>{
       req.logout((err)=>{
              if(err){
                     return (next(err));
              }else{
                     req.flash("success","Successfuly logged out !");
                     res.redirect("/listings");
              }     
       });
};