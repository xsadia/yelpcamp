const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//index route - Show all campgrounds
router.get("/", (req, res)=>{
  Campground.find({}, (err, allCampgrounds)=>{
      if(err){
          console.log("ERROR");
      } else {
          res.render("campgrounds/index", {campGrounds: allCampgrounds});
      }
  });
});

//New campground form route
router.get("/new", isLoggedIn, (req, res)=>{
  res.render("campgrounds/new");
});

//create route
router.post("/", isLoggedIn, (req, res)=>{
  const name = req.body.name;
  const image = req.body.img;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {name: name, image: image, description: description, author: author};
  Campground.create(newCampground, (err, newlyCreated)=>{
      if(err){
          console.log(err)
      } else{
          console.log(newlyCreated);
          res.redirect("/campgrounds");
      }
  });
});

//Show route - show more about ONE campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          console.log("erro", err);
      } else {
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;