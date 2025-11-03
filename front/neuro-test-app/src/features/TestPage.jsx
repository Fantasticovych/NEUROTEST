import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import fetchWithAuth, { API_URL } from "../utils/fetchWithAuth";
import styles from "./TestPage.module.css";

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isViewMode = searchParams.get("view") === "1";

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [showCorrections, setShowCorrections] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/api/get-tests/`);
        if (response.ok) {
          const data = await response.json();
          const selected = data.find((t) => t.test_id === parseInt(id));
          if (selected) {
            const updatedQuestions = selected.questions.map((q) => ({
              ...q,
              allAnswers: isViewMode
                ? [...q.incorrect_answers, q.correct_answer]
                : shuffleArray([...q.incorrect_answers, q.correct_answer]),
            }));
            setTest({ ...selected, questions: updatedQuestions });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPreviousResult = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_URL}/api/get-test-result/${id}/`
        );
        if (response.ok) {
          const data = await response.json();
          setPreviousResult(data);

          if (isViewMode && data) {
            setScore(data.score);
            setAnswers(data.answers || {});
            setSubmitted(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTest();
    fetchPreviousResult();
  
  }, [id, isViewMode]);

  const handleAnswer = (i, ans) => {
    if (submitted || isViewMode) return;
    setAnswers({ ...answers, [i]: ans });
  };

  const handleSubmit = async () => {
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    window.scrollTo(0, 0);

    setSaving(true);
    try {
      await fetchWithAuth(`${API_URL}/api/save-test-result/${id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: correct,
          total_questions: test.questions.length,
          answers,
        }),
      });

      setPreviousResult({
        score: correct,
        total: test.questions.length,
        percentage: (correct / test.questions.length) * 100,
        completed_at: new Date().toISOString(),
        answers,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRetake = async () => {
    try {
      const res = await fetchWithAuth(
        `${API_URL}/api/reset-test-result/${id}/`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setPreviousResult(null);
        setShowCorrections(false);
        const updatedQuestions = test.questions.map((q) => ({
          ...q,
          allAnswers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
        }));
        setTest({ ...test, questions: updatedQuestions });

        if (isViewMode) navigate(`/test/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderResult = () => {
    const total = test.questions.length;
    const currentScore =
      isViewMode && previousResult ? previousResult.score : score;
    const currentTotal =
      isViewMode && previousResult ? previousResult.total : total;

    const percentage = Math.round((currentScore / currentTotal) * 100);
    const passed = percentage >= 70;

    return (
      <div className={styles.resultContainer} data-passed={passed}>
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>
            {isViewMode
              ? `Результат тесту: ${test.topic}`
              : "Тест завершено! 🎉"}
          </h2>
          <div className={styles.resultScoreContainer}>
            <p className={styles.resultScoreText}>Ваш результат:</p>
            <div className={styles.resultScoreCircle}>
              <span className={styles.resultScore}>{currentScore}</span> /{" "}
              {currentTotal}
            </div>
          </div>
          <div className={styles.resultPercentage}>
            {percentage}
            <span className={styles.percentSymbol}>%</span>
          </div>
          <p className={styles.resultMessage}>
            {passed
              ? "Чудова робота! Ви успішно пройшли тест."
              : "Непогано, але є над чим попрацювати. Спробуйте ще раз!"}
          </p>
          <div className={styles.resultActions}>
            <button
              onClick={() => navigate("/library-tests")}
              className={styles.backBtn}
            >
              &larr; До бібліотеки
            </button>
            <button onClick={handleRetake} className={styles.retakeBtn}>
              Пройти ще раз
            </button>
          </div>
        </div>

        <p
          className={styles.viewCorrection}
          onClick={() => {
            setSubmitted(false);
            setShowCorrections(true);
          }}
        >
          Переглянути відповіді
        </p>
      </div>
    );
  };

  if (!test)
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loaderText}>Завантаження...</p>
      </div>
    );

  if (submitted) {
    return renderResult();
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.title}>{test.topic}</h1>
        <p className={styles.info}>
          Складність: <b>{test.difficulty}</b> | Питань:{" "}
          <b>{test.questions.length}</b>
        </p>
      </div>

      {previousResult && !submitted && !isViewMode && (
        <div className={styles.prevResultBox}>
          <h3>
            Останній результат: {previousResult.score}/{previousResult.total}
          </h3>
          <p>
            {Math.round(previousResult.percentage)}% (
            {new Date(previousResult.completed_at).toLocaleDateString()})
          </p>
          <button onClick={handleRetake} className={styles.retakeBtn}>
            Пройти знову
          </button>
        </div>
      )}

      <div className={styles.questions}>
        {test.questions.map((q, i) => (
          <div key={i} className={styles.questionCard}>
            <p className={styles.question}>
              {i + 1}. {q.question}
            </p>
            <div className={styles.answers}>
              {q.allAnswers.map((ans, j) => {
                const selected = answers[i] === ans;
                const correct = ans === q.correct_answer;
                let cls = styles.answer;

                if (submitted || showCorrections) {
                  if (correct) cls += ` ${styles.correct}`;
                  else if (selected && !correct) cls += ` ${styles.wrong}`;
                } else if (selected) {
                  cls += ` ${styles.selected}`;
                }

                return (
                  <button
                    key={j}
                    className={cls}
                    onClick={() => handleAnswer(i, ans)}
                    disabled={isViewMode}
                  >
                    {ans}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!isViewMode && (
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Збереження..." : "Завершити тест"}
        </button>
      )}
    </div>
  );
};

export default TestPage;
