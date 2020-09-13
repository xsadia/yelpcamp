const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const seedDB = require("./seeds");
const methodOverride = require("method-override");
const port = process.env.PORT || 1337;


//require routes
const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(()=>{console.log("Connected To DataBase")})

.catch((err)=>{console.log(err.message)});

//seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs" );
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(port, ()=>{
  console.log("Yelp Camp On!");
});