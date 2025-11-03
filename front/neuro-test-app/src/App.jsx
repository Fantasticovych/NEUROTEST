import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layouts/Header";
import Home from "./pages/Home";
import FormTest from "./pages/FormTest";
import styles from "./App.module.css";
import LibraryTests from "./pages/LibraryTests";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import TestPage from "./features/TestPage";

function App() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/" element={<Header />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="form-test" element={<FormTest />} />
          <Route path="test/:id" element={<TestPage />} />
          <Route path="library-tests" element={<LibraryTests />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
