import React from "react";
import Blog from "./Blog";

export default function Bloglist({ blogs, user }) {
  return (
    <div>
      <h2>Blogs</h2>
      <div>Hello {user.name}</div>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
}
