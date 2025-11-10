
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [userForm, setUserForm] = useState({ name: "", email: "", address: "", password: "", role: "Normal User" });
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [message, setMessage] = useState("");
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/admin/stores");
      setStores(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", { params: filters });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchStores();
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/admin/users", userForm);
      setMessage("✅ User created successfully!");
      setUserForm({ name: "", email: "", address: "", password: "", role: "Normal User" });
      fetchStats();
      fetchUsers();
    } catch (err) {
      const error = err.response?.data;
      setMessage("❌ " + (error?.message || "Failed to add user"));
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/admin/stores", { ...storeForm, ownerId: storeForm.ownerId || null });
      setMessage("✅ Store created successfully!");
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStats();
      fetchStores();
    } catch (err) {
      const error = err.response?.data;
      setMessage("❌ " + (error?.message || "Failed to add store"));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
      <Navbar />
      <div className="container" style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "30px" }}>Admin Dashboard</h1>

       
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={cardStyle}>👤 Users: {stats.totalUsers}</div>
          <div style={cardStyle}>🏬 Stores: {stats.totalStores}</div>
          <div style={cardStyle}>⭐ Ratings: {stats.totalRatings}</div>
        </div>

        {message && (
          <p style={{ color: message.startsWith("✅") ? "#4CAF50" : "#ff4d4d", fontWeight: "bold" }}>
            {message}
          </p>
        )}

        {/* Add User */}
        <div style={sectionStyle}>
          <h2>Add User</h2>
          <form onSubmit={handleAddUser} style={formStyle}>
            <input placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} style={inputStyle} />
            <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={inputStyle} />
            <input placeholder="Address" value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} style={inputStyle} />
            <input type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} style={inputStyle} />
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} style={inputStyle}>
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" style={btnStyle}>Add User</button>
          </form>
        </div>

        {/* Add Store */}
        <div style={sectionStyle}>
          <h2>Add Store</h2>
          <form onSubmit={handleAddStore} style={formStyle}>
            <input placeholder="Store Name" value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} style={inputStyle} />
            <input type="email" placeholder="Store Email" value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} style={inputStyle} />
            <input placeholder="Store Address" value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} style={inputStyle} />
            <input placeholder="Owner ID" value={storeForm.ownerId} onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })} style={inputStyle} />
            <button type="submit" style={btnStyle}>Add Store</button>
          </form>
        </div>

        {/* Stores List  */}
        <div style={sectionStyle}>
          <h2>Stores</h2>
          <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #444", borderRadius: "6px" }}>
            <table style={tableStyle}>
              <thead style={{ position: "sticky", top: 0, backgroundColor: "#333", zIndex: 1 }}>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td style={tdStyle}>{s.name}</td>
                    <td style={tdStyle}>{s.email}</td>
                    <td style={tdStyle}>{s.address}</td>
                    <td style={tdStyle}>{s.averageRating || "No ratings yet"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users List */}
        <div style={sectionStyle}>
          <h2>Users</h2>
          <div style={{ marginBottom: "15px" }}>
            <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={inputStyle} />
            <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} style={inputStyle} />
            <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} style={inputStyle} />
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} style={inputStyle}>
              <option value="">All</option>
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="Admin">Admin</option>
            </select>
            <button onClick={fetchUsers} style={btnStyle}>Apply Filters</button>
          </div>
          <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #444", borderRadius: "6px" }}>
            <table style={tableStyle}>
              <thead style={{ position: "sticky", top: 0, backgroundColor: "#333", zIndex: 1 }}>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{u.address}</td>
                    <td style={tdStyle}>{u.role}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleViewUser(u.id)} style={btnStyle}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2>{selectedUser.name}</h2>
              <p>Email: {selectedUser.email}</p>
              <p>Address: {selectedUser.address}</p>
              <p>Role: {selectedUser.role}</p>
              {selectedUser.role === "Store Owner" && selectedUser.Stores?.length > 0 && (
                <>
                  <h3>Stores</h3>
                  {selectedUser.Stores.map((store) => (
                    <div key={store.id} style={{ marginBottom: "10px" }}>
                      <strong>{store.name}</strong> - ⭐ {store.averageRating}
                    </div>
                  ))}
                </>
              )}
              <button onClick={() => setSelectedUser(null)} style={btnStyle}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = { flex: 1, padding: "30px", fontSize: "1.4rem", fontWeight: "bold", textAlign: "center", borderRadius: "12px", backgroundColor: "#1e1e1e", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" };
const sectionStyle = { backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" };
const formStyle = { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" };
const inputStyle = { flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white" };
const btnStyle = { padding: "10px 16px", backgroundColor: "#4CAF50", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const thStyle = { padding: "10px", border: "1px solid #444", backgroundColor: "#333" };
const tdStyle = { padding: "10px", border: "1px solid #444" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContent = { backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "10px", width: "400px", color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" };
