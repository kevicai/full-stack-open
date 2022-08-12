const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Hello World",
    author: "Author 1",
    url: "URL 1",
    likes: 1,
  },
  {
    title: "Blog 2",
    author: "Author 2",
    url: "URL 2",
    likes: 2,
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  usersInDb,
};
