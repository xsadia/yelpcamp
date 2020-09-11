const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("Connected To DataBase")})

.catch((err)=>{console.log(err.message)});

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs" );

app.use(require("express-session")({
  secret: "rinne te amo",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log("ERROR");
        } else {
            res.render("campgrounds/index", {campGrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res)=>{
    const name = req.body.name;
    const image = req.body.img;
    const description = req.body.description;
    const newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err)
        } else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log("erro", err);
        } else {
          res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//==============================
//ROTA COMENTARIOS
//==============================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
    } else{
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
        } else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
});

//===============================auth routes===========================

app.get("/register", (req, res)=>{
  res.render("register");
});

app.post("/register", (req, res)=>{
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, ()=>{
      res.redirect("/campgrounds");
    });
  });
});

app.get("/login", (req, res)=>{
  res.render("login")
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}),(req, res)=>{});

app.get("/logout",(req, res)=>{
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(1337, ()=>{
    console.log("Yelp Camp On!");
});