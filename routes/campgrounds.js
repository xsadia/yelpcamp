const express = require("express");
const { get } = require("mongoose");
const { findByIdAndUpdate, findByIdAndRemove } = require("../models/campground");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  res.render("campgrounds/new");
});

//create route
router.post("/", middleware.isLoggedIn, (req, res)=>{
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.img;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {name: name, image: image, description: description, author: author, price: price};
  Campground.create(newCampground, (err, newlyCreated)=>{
      if(err){
          console.log(err)
      } else{
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
      res.render("campgrounds/edit", {campground: foundCampground});
      });
    });

//update route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground removed.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;