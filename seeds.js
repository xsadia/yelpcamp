const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seeds = [
  {
    name: "choncc's housing",
    image: "https://vignette.wikia.nocookie.net/leagueoflegends/images/4/4e/Choncc_Base_Tier_1.png/revision/latest/scale-to-width-down/340?cb=20200831002017",
    description: "Description massa"
  },
  {
    name: "godo's",
    image: "https://i.redd.it/fp48vh6rdq231.jpg",
    description: "Description massa"
  },
  {
    name: "pingu",
    image: "https://i.redd.it/ddwk8kz7na321.jpg",
    description: "Description massa"
  },

];

//remove campgrounds
async function seedDB(){
  await Campground.deleteMany({});
  console.log("campgrounds removed");
  await Comment.deleteMany({});
  console.log("comments removed");

  for(const seed of seeds) {
    let campground = await Campground.create(seed);
    console.log("campground created");
    let comment = await Comment.create(
      {
        text: "bla bla bla bla blas",
        author:"rinne"
      }
    )
    console.log("comment created");
    campground.comments.push(comment);
    campground.save();
    console.log("comment added to campground");
  }
}

module.exports = seedDB;


