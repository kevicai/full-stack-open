const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const { initialBlogs } = require("./api_test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("get blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs have an id property", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("get blogs", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await",
      author: "Author 3",
      url: "URL 3",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain("async/await");
  });

  test("a new blog with no likes property will default to 0", async () => {
    const newBlog = {
      title: "no likes",
      author: "Author 3",
      url: "URL 3",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    expect(response.body[2].likes).toBe(0);
  });
});

describe("delete blogs", () => {
  test("delete one blog", async () => {
    const allBlogs = await api.get("/api/blogs");

    await api.delete(`/api/blogs/${allBlogs.body[0].id}`).expect(204);

    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Blog 2");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
