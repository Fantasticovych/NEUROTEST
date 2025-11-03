import styles from "./LoginForm.module.css";
import password_logo from "./../assets/password.png";
import person from "./../assets/person.png";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../store/AuthContext";

const LoginForm = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const ctx = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    ctx.loginUser(username,password);
  }

  return (
    <div className={styles.wrapper}>
    <div className={styles.containerForm}>
      <div className={styles.tabs}>
        <Link
          to="/register"
          className={`${styles.tab} ${!isLoginPage ? styles.activeTab : ""}`}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className={`${styles.tab} ${isLoginPage ? styles.activeTab : ""}`}
        >
          Sign In
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <img src={person} alt="name icon" />
          <input
            placeholder="Name"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.input}>
          <img src={password_logo} alt="password icon" />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.button} type="submit">
          Sign in
        </button>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
