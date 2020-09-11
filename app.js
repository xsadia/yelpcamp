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

//require routes
const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("Connected To DataBase")})

.catch((err)=>{console.log(err.message)});

//seedDB();
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

app.use(authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(1337, ()=>{
  console.log("Yelp Camp On!");
});