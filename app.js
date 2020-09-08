const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("Connected To DataBase")})

.catch((err)=>{console.log(err.message)});

//Schema

const campGroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campGroundSchema);

/* Campground.create({
    name: "Granite Hill",
    image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "This is a huge granite hill, no bathrooms, no water, beatiful granite"
}, (err, campground)=>{
    if(err){
        console.log("ERROR: " + err);
    } else {
        console.log("Campground added: " + campground);
    }
}); */

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs" );

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log("ERROR");
        } else {
            res.render("index", {campGrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new.ejs");
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
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log("erro", err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(1337, ()=>{
    console.log("Yelp Camp On!");
});