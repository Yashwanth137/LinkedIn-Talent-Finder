import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Recruitment Tool</h1>
      <p>Backend says: {msg}</p>
    </div>
  );
}

export default App;
