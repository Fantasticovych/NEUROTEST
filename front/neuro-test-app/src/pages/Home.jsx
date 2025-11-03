import styles from "./Home.module.css";
import student from "./../assets/student.jpg";
import pencil from "./../assets/icons/pencil.png";
import lamp from "./../assets/icons/lamp.png";
import stats from "./../assets/icons/stat.png";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layouts/Footer";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["main-home"]}>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.content_text}>
            <h1>Create and take online tests on any topic in seconds</h1>
            <p>
              Choose a topic, number of questions, and time - our AI will
              automatically generate a unique test for you. Track your progress
              in your personal account and improve your knowledge in any field.
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/form-test");
            }}
          >
            Create Now
          </button>
        </div>
        <div className={styles.content_img}>
          <img src={student} alt="" />
        </div>
      </div>

      <div className={styles.opportunities}>
        <div className={styles.opportunities_items}>
          <img src={pencil} alt="" />
          <div className={styles.opportunities_text}>
            <h4>Dynamic Testing </h4>
            <p>Easily create and manage tests.</p>
          </div>
        </div>
        <div className={styles.opportunities_items}>
          <img src={stats} alt="" />
          <div className={styles.opportunities_text}>
            <h4>Progress Tracking </h4>
            <p>Monitor your performance and growth.</p>
          </div>
        </div>
        <div className={styles.opportunities_items}>
          <img src={lamp} alt="" />
          <div className={styles.opportunities_text}>
            <h4>Innovative Ideas </h4>
            <p>Unleash your creativity with tests.</p>
          </div>
        </div>
      </div>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1</span>
            <p>Enter the topic and number of questions.</p>
          </div>
          <div className={styles.step}>
            <span>2</span>
            <p>Our AI instantly generates a unique test for you.</p>
          </div>
          <div className={styles.step}>
            <span>3</span>
            <p>Take the test, see your results, and track progress.</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why choose our platform?</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <h3>AI-Powered Tests</h3>
            <p>Get smart, adaptive questions created just for you.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Instant Feedback</h3>
            <p>Receive detailed results right after completing a test.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Share & Learn</h3>
            <p>Invite friends or students to take your tests.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to create your first test?</h2>
        <p>Start learning smarter — it’s fast, fun, and free.</p>
        <button onClick={() => navigate("/form-test")}>Get Started</button>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
