import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "Normal User", 
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
          maxWidth: "420px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "1.8rem", fontWeight: "bold" }}>
          Sign Up
        </h1>

        {error && <p style={{ color: "#ff4d4d", marginBottom: "10px" }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "14px",
            }}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "14px",
            }}
          >
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
            <option value="Admin">Admin</option>
          </select>

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
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "12px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#4d90fe", textDecoration: "none" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
