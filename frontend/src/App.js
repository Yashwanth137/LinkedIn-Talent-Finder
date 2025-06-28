import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./pages/hero.jsx";
import LoginRegisterPage from "./pages/login"

function App() {
  const [msg, setMsg] = useState("");

 useEffect(() => {
  fetch("http://localhost:8000/")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);
      setMsg(JSON.stringify(data.sample_user, null, 2));
    })
    .catch(err => console.error("Fetch error:", err));
}, []);


  return (
    <Router> {/* ✅ Wrap everything in Router */}
      <Routes>
        <Route path="/" element={<Hero />} />
        {/* Add more routes here */}
         <Route path="/login" element={<LoginRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
