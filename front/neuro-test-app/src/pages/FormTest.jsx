import { Fragment, useState } from "react";
import styles from "./FormTest.module.css";
import fetchWithAuth, { API_URL } from "../utils/fetchWithAuth";
import { useNavigate } from "react-router-dom";

const CreateTest = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [point, setPoint] = useState("");
  const [count, setCount] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const response = await fetchWithAuth(`${API_URL}/api/generate-test/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, point, count, difficulty }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Test generated:", data);
      setTopic("");
      setPoint("");
      setCount(1);
      setDifficulty("easy");
      setSuccessMessage("✅ Тест успішно згенеровано!");
      setTimeout(() => setSuccessMessage(""), 3000);
      navigate("/library-tests");
    } else {
      console.error("Error generating test");
      setSuccessMessage("❌ Сталася помилка. Спробуйте ще раз.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <div className={styles.ring}>
          <i></i>
          <i></i>
          <i></i>
          <form className={styles.form} onSubmit={onSubmitHandler}>
            <h2 className={styles.title}>✨ Generate Your Test</h2>

            <label>Topic Name</label>
            <input
              type="text"
              placeholder="Наприклад: JavaScript, History..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />

            <label>Points / Key Concepts</label>
            <textarea
              rows={4}
              placeholder="Введіть основні пункти теми..."
              value={point}
              onChange={(e) => setPoint(e.target.value)}
            ></textarea>

            <label>Number of Questions</label>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />

            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button type="submit">Generate</button>
            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateTest;
