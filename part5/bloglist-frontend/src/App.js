import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import loginService from "./services/loginService";
import blogsService from "./services/blogsService";
import LoginForm from "./components/LoginForm";
import Bloglist from "./components/Bloglist";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogsService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogsService.setToken(user.token);

      // check token expiration
      console.log(jwt_decode(user.token));
      const exp = jwt_decode(user.token).exp;
      if (Date.now() >= exp * 1000) {
        window.localStorage.clear();
      }
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
      blogsService.setToken(user.token);
      setUser(user);
      console.log("login");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      {user ? (
        <Bloglist blogs={blogs} user={user} />
      ) : (
        <LoginForm handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
