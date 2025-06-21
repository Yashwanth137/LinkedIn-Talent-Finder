import { useEffect, useState } from "react";

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
    <div style={{ padding: "2rem" }}>
      <h1>LinkedIn Talent Finder</h1>
      <p>Backend says: {msg}</p>
    </div>
  );
}

export default App;
