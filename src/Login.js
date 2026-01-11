import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email or Username</label>
          <input
            type="text"
            placeholder="you@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">Forgot Password?</div>

          {error && <div className="error">{error}</div>}

          <button type="submit">Login</button>
        </form>

        <div className="footer-text">
          Don’t have an account? <span>Create Account</span>
        </div>
      </div>
    </div>
  );
}
