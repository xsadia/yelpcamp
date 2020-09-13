const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
    } else{
      res.render("comments/new", {campground: campground});
    }
  });
});
//comments create
router.post("/", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
        } else{
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          comment.save();          
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
});
//comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, foundComment)=>{
    if(err){
      res.redirect("back");
    } else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});
//comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
    if(err){
      res.redirect("back");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//comments delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect("back");
    } else{
      res.redirect("back");
    }
  });
});

module.exports = router;