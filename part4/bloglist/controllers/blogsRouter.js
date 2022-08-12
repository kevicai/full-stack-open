const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }); // populate user ids into user objects

  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const token = request.token;
  const user = await User.findById(decodedToken.id);
  const body = request.body;

  // set default likes to 0 if not specified
  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  // update blogs stored under the user in db
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON);
});

blogsRouter.delete("/:id", async (request, response) => {
  const token = request.token;
  const user = await User.findById(decodedToken.id);

  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id });

    user.blogs = user.blogs.filter((blog) => blog.toString() !== id);
    user.save();
    response.sendStatus(204).end();
  } else {
    response.status(401).json({ error: "unauthorized operation" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const user = await User.findById(decodedToken.id);
  const blog = request.body;
  const id = request.params.id;

  if (blog.user.toString() === user.id.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
      new: true,
    }).populate("user", { username: 1, name: 1 });

    updatedBlog
      ? response.status(200).json(updatedBlog.toJSON())
      : response.status(404).end();
  } else {
    response.status(401).json({ error: "unauthorized operation" });
  }
});

module.exports = blogsRouter;
