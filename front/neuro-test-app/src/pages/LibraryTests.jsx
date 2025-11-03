import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth, { API_URL } from "../utils/fetchWithAuth";
import styles from "./LibraryTests.module.css";
import { FaTrashAlt, FaEye, FaRedoAlt } from "react-icons/fa";

const LibraryTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/api/get-tests/`);
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        } else {
          console.error("Не вдалося отримати тести");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleDelete = async (e, testId) => {
    e.stopPropagation();
    if (!window.confirm("Ви впевнені, що хочете видалити цей тест?")) return;

    try {
      const response = await fetchWithAuth(
        `${API_URL}/api/delete-test/${testId}/`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setTests((prev) => prev.filter((t) => t.test_id !== testId));
      } else {
        alert("Не вдалося видалити тест");
      }
    } catch (err) {
      console.error(err);
      alert("Сталася помилка при видаленні тесту");
    }
  };

  const handleRetake = async (e, testId) => {
    e.stopPropagation();
    await fetchWithAuth(`${API_URL}/api/reset-test-result/${testId}/`, { method: "DELETE" });
    navigate(`/test/${testId}`);
  };

  const getFilteredTests = () => {
    switch (activeTab) {
      case "completed":
        return tests.filter((t) => t.is_completed);
      case "pending":
        return tests.filter((t) => !t.is_completed);
      default:
        return tests;
    }
  };

  const getSortedTests = () => {
    const filtered = getFilteredTests();
    const sorted = [...filtered];
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "difficulty":
        const order = { easy: 1, medium: 2, hard: 3 };
        return sorted.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      default:
        return sorted;
    }
  };

 if (loading)
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.loaderText}>Завантаження тестів...</p>
    </div>
  );

  if (tests.length === 0) return <p className={styles.noResults}>Тести відсутні</p>;

  const displayedTests = getSortedTests();
  const completedCount = tests.filter((t) => t.is_completed).length;
  const pendingCount = tests.filter((t) => !t.is_completed).length;

  return (
    <div className={styles.libraryContainer}>
      <h1>Моя бібліотека тестів</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Усі ({tests.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "completed" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Пройдені ({completedCount})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Чекають свого часу ({pendingCount})
        </button>
      </div>

      <div className={styles.sortControls}>
        <label htmlFor="sort">Сортувати за:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="date-desc">Датою (спочатку нові)</option>
          <option value="date-asc">Датою (спочатку старі)</option>
          <option value="difficulty">Складністю</option>
        </select>
      </div>

      <div className={styles.testGrid}>
        {displayedTests.map((test) => (
          <div key={test.test_id} className={`${styles.testCard} ${test.is_completed ? styles.completed : ""}`}>
            <h2 className={styles.topic}>{test.topic}</h2>
            <p>Кількість питань: {test.questions.length}</p>
            <p>Складність: {test.difficulty}</p>
            <p>Створено: {new Date(test.created_at).toLocaleDateString()}</p>

            {test.is_completed && test.last_result && (
              <>
                <p className={styles.lastCompleted}>
                  Останнє проходження: {new Date(test.last_result.completed_at).toLocaleDateString()}
                </p>
              </>
            )}

            <div className={styles.cardButtons}>
              {test.is_completed && test.last_result ? (
                <>
                  <button
                    className={styles.viewButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/test/${test.test_id}?view=1`);
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className={styles.retakeButton}
                    onClick={(e) => handleRetake(e, test.test_id)}
                  >
                    <FaRedoAlt />
                  </button>
                </>
              ) : (
                <button
                  className={styles.startButton}
                  onClick={(e) => handleRetake(e, test.test_id)}
                >
                  Пройти тест
                </button>
              )}

              <button
                className={styles.deleteButton}
                onClick={(e) => handleDelete(e, test.test_id)}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryTests;
