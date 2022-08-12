const lodash = require("lodash");

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const topLikesBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const topBlog = blogs.reduce(
    (top, blog) => (top.likes >= blog.likes ? top : blog),
    blogs[0]
  );
  return { title: topBlog.title, author: topBlog.author, likes: topBlog.likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCount = lodash.countBy(blogs, "author");
  // returns a map of "author" to numOfBlogs

  const topAuthor = Object.keys(authorCount).reduce((top, curr) => {
    return authorCount[top] >= authorCount[curr] ? top : curr;
  });

  return {
    author: topAuthor,
    blogs: authorCount[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesCount = lodash(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, "likes"),
    }))
    .value();

  return likesCount.reduce((a, b) => {
    return a.likes >= b.likes ? a : b;
  });
};

module.exports = { totalLikes, topLikesBlog, mostBlogs, mostLikes };
