import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./pages/hero.jsx";
import LoginRegisterPage from "./pages/login.jsx"; 
import InputPage from "./pages/input.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import { AuthProvider } from "./pages/AuthContext.jsx";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        // The msg state isn't used in the UI, but we'll leave the fetch logic
        setMsg(JSON.stringify(data.sample_user, null, 2));
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);


  return (
    <Router>
      {/* ✅ Wrap all routes with AuthProvider.
        This makes the auth context (login, logout, token) available
        to all components rendered by these routes.
      */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          
          {/* The ProtectedRoute component will now have access to the auth context
            to determine if a user is authenticated.
          */}
          <Route path="/input" element={
            <ProtectedRoute>
              <InputPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;