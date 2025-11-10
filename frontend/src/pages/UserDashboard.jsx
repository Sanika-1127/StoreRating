import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({}); 
  const [message, setMessage] = useState("");

  const fetchStores = async (nameFilter = "") => {
    try {
      const res = await api.get("/stores", {
        params: nameFilter ? { name: nameFilter } : {},
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(search);
  };

  const handleRate = async (storeId) => {
    setMessage("");
    const rating = ratings[storeId];
    if (!rating) {
      setMessage("❌ Please select a rating before submitting.");
      return;
    }
    try {
      await api.post(`/stores/${storeId}/rate`, { rating });
      setMessage("✅ Rating submitted!");
      fetchStores(search);
    } catch (err) {
      const error = err.response?.data;
      setMessage("❌ " + (error?.message || "Failed to submit rating"));
    }
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <Navbar />
      <div className="container" style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "20px" }}>User Dashboard</h1>

        <form
          onSubmit={handleSearch}
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            placeholder="Search store by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "650px", 
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              width: "150px",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {message && (
          <p style={{ color: message.startsWith("✅") ? "#4CAF50" : "#ff4d4d", fontWeight: "bold" }}>
            {message}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {stores.map((s) => (
            <div
              key={s.id}
              className="card"
              style={{
                flex: "0 0 calc(50% - 10px)", 
                boxSizing: "border-box",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#1e1e1e",
                color: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <h3>{s.name}</h3>
              <p>{s.address}</p>
              <p>⭐ Average Rating: {s.averageRating || "No ratings yet"}</p>

              <select
                value={ratings[s.id] || ""}
                onChange={(e) => setRatings({ ...ratings, [s.id]: e.target.value })}
                style={{
                  width: "100%",
                  marginBottom: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #444",
                  backgroundColor: "#2a2a2a",
                  color: "white",
                }}
              >
                <option value="">Select rating</option>
                <option value="1">⭐ 1</option>
                <option value="2">⭐⭐ 2</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>

              <button
                onClick={() => handleRate(s.id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Submit Rating
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
