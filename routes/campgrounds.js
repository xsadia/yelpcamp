const express = require("express");
const { get } = require("mongoose");
const { findByIdAndUpdate, findByIdAndRemove } = require("../models/campground");
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

//edit route
router.get("/:id/edit",(req, res)=>{
  Campground.findById(req.params.id, (err, foundCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    } else{
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});
//update route
router.put("/:id", (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//destroy route
router.delete("/:id", (req, res)=>{
  Campground.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
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