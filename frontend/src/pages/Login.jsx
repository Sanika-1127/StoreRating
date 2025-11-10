import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 

      if (res.data.user.role === "Admin") navigate("/admin");
      else if (res.data.user.role === "Normal User") navigate("/user");
      else if (res.data.user.role === "Store Owner") navigate("/owner");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "30px 40px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "1.8rem", fontWeight: "bold" }}>
          Login
        </h1>

        {error && <p style={{ color: "#ff4d4d", marginBottom: "10px" }}>{error}</p>}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "14px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#4d90fe",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#357ae8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4d90fe")}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "12px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#4d90fe", textDecoration: "none" }}>
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}
