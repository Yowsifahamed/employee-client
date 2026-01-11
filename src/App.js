import Login from "./Login";
import Employees from "./Employees";

function App() {
  const token = localStorage.getItem("token");

  return token ? <Employees /> : <Login />;
}

export default App;
