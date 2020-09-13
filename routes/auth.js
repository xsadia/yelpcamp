const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//root route
router.get("/", (req, res)=>{
  res.render("landing");
});

//register form
router.get("/register", (req, res)=>{
  res.render("register");
});

//handles sign up logic
router.post("/register", (req, res)=>{
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
      return res.render("register", {error: err.message});
    }
    passport.authenticate("local")(req, res, ()=>{
      req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
      res.redirect("/campgrounds");
    });
  });
});

//login form route
router.get("/login", (req, res)=>{
  res.render("login");
});

//handles login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: 'Welcome back!'
}),(req, res)=>{});

//logout route
router.get("/logout",(req, res)=>{
  req.logout();
  req.flash("success", "Logged Out.");
  res.redirect("/campgrounds");
});

module.exports = router;
