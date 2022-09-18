import "./Blog.css";

const Blog = ({blog}) => (
  <div className="blog-card">
    <div>{blog.title}</div>
    <div>By: {blog.author}</div>
  </div>  
)

export default Blog