import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [logged, setLogged] = useState(false);
  return logged ? <Dashboard /> : <Login onLogin={() => setLogged(true)} />;
}

export default App;