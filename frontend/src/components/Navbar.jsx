import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1e1e1e", 
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)", 
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>Store Rating</h1>
      <button
        onClick={handleLogout}
        style={{
          background: "#ff4d4d", 
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.9rem",
          padding: "6px 12px", 
          width: "auto",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#ff1a1a")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#ff4d4d")}
      >
        Logout
      </button>
    </div>
  );
}
