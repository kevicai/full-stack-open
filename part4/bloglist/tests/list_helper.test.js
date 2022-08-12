const listHelper = require("../utils/list_helper");
const blogs = [
  {
    _id: "d12",
    title: "t12",
    author: "a12",
    url: ".",
    likes: 12,
    __v: 0,
  },
  {
    _id: "d7",
    title: "t7",
    author: "a7",
    url: ".",
    likes: 7,
    __v: 0,
  },
  {
    _id: "d2",
    title: "t2",
    author: "a2",
    url: ".",
    likes: 2,
    __v: 0,
  },
];

describe("total likes", () => {
  test("from multiple blogs", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(21);
  });

  test("from no blogs", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
});

describe("top liked blog likes", () => {
  test("from multiple blogs", () => {
    const result = listHelper.topLikesBlog(blogs);
    expect(result).toEqual({ title: "t12", author: "a12", likes: 12 });
  });

  test("from no blogs", () => {
    const result = listHelper.topLikesBlog([]);
    expect(result).toBe(null);
  });
});
