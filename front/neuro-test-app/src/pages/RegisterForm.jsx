import styles from "./RegisterForm.module.css";
import email_logo from "./../assets/email.png";
import password_logo from "./../assets/password.png";
import person from "./../assets/person.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../store/AuthContext";
import { jwtDecode } from "jwt-decode";

const RegisterForm = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ctx = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    const data = await response.json();

    const tokens = {
      access: data.access,
      refresh: data.refresh,
    };

    if (response.ok) {
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      localStorage.setItem("username", username);
      ctx.setAuthTokens(tokens);
      ctx.setUser(jwtDecode(tokens.access));
      alert("successful");
      navigate("/");
    } else {
      alert("Registration failed: " + JSON.stringify(data));
    }
  };

  return (
    <div className={styles.wrapper}>
    <div className={styles.containerForm}>
      <div className={styles.tabs}>
        <Link
          to="/register"
          className={`${styles.tab} ${isRegisterPage ? styles.activeTab : ""}`}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className={`${styles.tab} ${!isRegisterPage ? styles.activeTab : ""}`}
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
          <img src={email_logo} alt="email icon" />
          <input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
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
          Sign up
        </button>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
