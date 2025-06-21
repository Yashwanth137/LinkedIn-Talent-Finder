import { useEffect, useState } from "react";

import LoginForm from "./pages/login.jsx";

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
    <div>
      <LoginForm/>
    </div>
  );
}

export default App;
