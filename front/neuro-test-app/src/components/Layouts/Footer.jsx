import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
          <h3>SmartTests</h3>
          <p>AI-powered test creation & learning platform</p>
        </div>

        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/form-test")}>Create Test</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className={styles.footerSocials}>
          <h4>Follow us</h4>
          <div className={styles.socialIcons}>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer">
              <i className="fab fa-telegram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} SmartTests. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
