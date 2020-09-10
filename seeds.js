const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seeds = [
  {
    name: "Choncc's housing",
    image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "I'm baby church-key art party bitters direct trade, literally tacos irony skateboard hashtag yr post-ironic twee raw denim yuccie. Gluten-free deep v wayfarers, paleo vegan celiac succulents gastropub salvia kinfolk literally biodiesel. Irony af chartreuse gochujang. Fashion axe slow-carb kinfolk deep v. Aesthetic mustache meditation af polaroid +1 blue bottle dreamcatcher meh put a bird on it readymade asymmetrical flannel semiotics chillwave. Prism neutra pug small batch readymade kogi sartorial photo booth vegan XOXO."
  },
  {
    name: "Godo's creek",
    image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "I'm baby church-key art party bitters direct trade, literally tacos irony skateboard hashtag yr post-ironic twee raw denim yuccie. Gluten-free deep v wayfarers, paleo vegan celiac succulents gastropub salvia kinfolk literally biodiesel. Irony af chartreuse gochujang. Fashion axe slow-carb kinfolk deep v. Aesthetic mustache meditation af polaroid +1 blue bottle dreamcatcher meh put a bird on it readymade asymmetrical flannel semiotics chillwave. Prism neutra pug small batch readymade kogi sartorial photo booth vegan XOXO."
  },
  {
    name: "Mountain Pingu",
    image: "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "I'm baby church-key art party bitters direct trade, literally tacos irony skateboard hashtag yr post-ironic twee raw denim yuccie. Gluten-free deep v wayfarers, paleo vegan celiac succulents gastropub salvia kinfolk literally biodiesel. Irony af chartreuse gochujang. Fashion axe slow-carb kinfolk deep v. Aesthetic mustache meditation af polaroid +1 blue bottle dreamcatcher meh put a bird on it readymade asymmetrical flannel semiotics chillwave. Prism neutra pug small batch readymade kogi sartorial photo booth vegan XOXO."
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


