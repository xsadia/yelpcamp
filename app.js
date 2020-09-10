const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
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
          console.log(foundCampground);
          res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//==============================
//ROTA COMENTARIOS
//==============================

app.get("/campgrounds/:id/comments/new",(req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
    } else{
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", (req, res)=>{
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

app.listen(1337, ()=>{
    console.log("Yelp Camp On!");
});