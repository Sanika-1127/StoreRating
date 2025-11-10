import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function StoreOwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/stores/owner/dashboard");
      if (res.data.message) {
        setMessage(res.data.message);
      } else {
        setStores(res.data);
      }
    } catch (err) {
      setMessage(
        "❌ " + (err.response?.data?.message || "Failed to load dashboard")
      );
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
      <Navbar />
      <div className="container" style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "30px" }}>Store Owner Dashboard</h1>
        {message && (
          <p style={{ color: message.startsWith("✅") ? "#4CAF50" : "#ff4d4d", fontWeight: "bold" }}>
            {message}
          </p>
        )}

        {stores.map((store) => (
          <div key={store.id} style={{ marginBottom: "40px" }}>
            
            <div
              style={{
                width: "750px",
                maxWidth:"100%",
                padding: "20px",
                margin: "0 auto 20px auto",
                borderRadius: "10px",
                backgroundColor: "#1e1e1e",
                color: "white",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <h3>⭐ Your Average Rating</h3>
              <h1 style={{ fontSize: "3rem", margin: "10px 0", color: "#4CAF50" }}>
                {store.averageRating || "No ratings yet"}
              </h1>
            </div>

            <h3 style={{ color: "white", marginBottom: "10px" }}>Users Who Rated Your Store</h3>

            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#2a2a2a",
                width: "800px",           
                maxWidth: "100%",         
                margin: "0 auto",   
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#3a3a3a", position: "sticky", top: 0 }}>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #444", color: "white" }}>User Name</th>
                    <th style={{ padding: "10px", border: "1px solid #444", color: "white" }}>Email</th>
                    <th style={{ padding: "10px", border: "1px solid #444", color: "white" }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: "10px", textAlign: "center", color: "#ccc" }}>
                        No ratings yet
                      </td>
                    </tr>
                  ) : (
                    store.ratings.map((r) => (
                      <tr key={r.id} style={{ backgroundColor: "#2a2a2a" }}>
                        <td style={{ padding: "10px", border: "1px solid #444", color: "white" }}>{r.user.name}</td>
                        <td style={{ padding: "10px", border: "1px solid #444", color: "white" }}>{r.user.email}</td>
                        <td style={{ padding: "10px", border: "1px solid #444", color: "#4CAF50" }}>⭐ {r.rating}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
