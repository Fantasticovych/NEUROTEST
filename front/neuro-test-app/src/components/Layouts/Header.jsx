import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Fragment, useContext, useState } from "react";
import logo from "./../../assets/logo/logo_without_text.png";
import AuthContext from "../../store/AuthContext";

const Header = () => {
  const ctx = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  return (
    <Fragment>
      <header className={styles.header}>
        <div className={styles.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="logo" className={styles.logo} />
          <span className={styles.brand}>NEUROTEST</span>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/form-test">Forge Test</Link></li>
            <li><Link to="/library-tests">Library Tests</Link></li>
          </ul>
        </nav>

        <div className={styles.buttons}>
          <button
            className={styles.ctaButton}
            onClick={() => navigate("/form-test")}
          >
            Get Started
          </button>

          {ctx.user ? (
            <div className={styles.profileBox}>
              <button
                className={styles.username}
                onClick={() => setIsActive(!isActive)}
              >
                👤 {ctx.user.username}
              </button>

              {isActive && (
                <div className={styles.dropdown}>
                  <p className={styles.userInfo}>
                    {localStorage.getItem("username")}
                  </p>
                  <button
                    className={styles.logoutBtn}
                    onClick={ctx.logoutUser}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/register">Sign Up</Link> |{" "}
              <Link to="/login">Sign In</Link>
            </div>
          )}
        </div>
      </header>

      <main className={styles.pages}>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default Header;
