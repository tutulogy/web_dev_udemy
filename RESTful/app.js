var express = require("express"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
methodOverrider= require("method-override"),
app = express();


mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverrider("_method"));

//Mongoose Config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created:{
    type:Date,
    default:Date.now
  }
});
//Model Config
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image:"https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732e7dd2924bc55b_340.jpg",
//   body:"Hello this is a blog post"
// });

//RESTFUL ROUTES
app.get("/", (req, res)=>{
  res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log("Error");
    }else{
      res.render("index",{blogs:blogs});
    }
  });
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
  //create a blogs
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body)
  console.log("+++++++++++++++");
  console.log(req.body);

  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show",{blog:foundBlog});
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  //first we need to find the blog
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit",{blog:foundBlog});
    };
  });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  //find the existing data
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
  //update the data
});

//DELEE ROUTE
app.delete("/blogs/:id", function(req, res){
  //destroy blogs
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  })
  //redirect somewhere
});

app.listen(3000, function(){
  console.log("server starting");
});
