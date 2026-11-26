
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  const loadComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComplaints(
          Array.isArray(data) ? data : data.complaints || []
        );
      } else {
        setMessage(data.message || "Unable to load complaints.");
      }
    } catch {
      setMessage("Server connection failed.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/complaints/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Complaint status updated successfully.");
        loadComplaints();
      } else {
        setMessage(data.message || "Status update failed.");
      }
    } catch {
      setMessage("Server connection failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const progress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const getStatusClass = (status) => {
    if (status === "Resolved") return "cc-resolved";
    if (status === "In Progress") return "cc-progress";
    return "cc-pending";
  };

  return (
    <div className="cc-dashboard">
      <header className="cc-topbar">
        <Link to="/" className="cc-logo">
          🎓 CampusConnect
        </Link>

        <div className="cc-top-actions">
          <span className="cc-user-label">🛡️ Admin Panel</span>
          <button onClick={logout} className="cc-logout">
            Logout ↗
          </button>
        </div>
      </header>

      <main className="cc-main">
        <section className="cc-welcome cc-admin-welcome">
          <div>
            <p className="cc-eyebrow">ADMINISTRATION</p>
            <h1>Admin Dashboard</h1>
            <p>
              Manage student complaints and monitor their progress.
            </p>
          </div>

          <div className="cc-welcome-icon">🛡️</div>
        </section>

        <section className="cc-stats">
          <div className="cc-stat-card">
            <span className="cc-stat-icon">📋</span>
            <div>
              <p>Total Complaints</p>
              <h2>{complaints.length}</h2>
            </div>
          </div>

          <div className="cc-stat-card">
            <span className="cc-stat-icon">⏳</span>
            <div>
              <p>Pending</p>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="cc-stat-card">
            <span className="cc-stat-icon">🔄</span>
            <div>
              <p>In Progress</p>
              <h2>{progress}</h2>
            </div>
          </div>

          <div className="cc-stat-card">
            <span className="cc-stat-icon">✅</span>
            <div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
            </div>
          </div>
        </section>

        <section className="cc-panel cc-admin-panel">
          <div className="cc-panel-heading">
            <div>
              <h2>📑 All Student Complaints</h2>
              <p>Review complaints and update their status.</p>
            </div>

            <button
              className="cc-refresh"
              onClick={loadComplaints}
            >
              ↻ Refresh
            </button>
          </div>

          {message && <p className="cc-message">{message}</p>}

          {complaints.length === 0 ? (
            <div className="cc-empty">
              <span>📭</span>
              <h3>No complaints available</h3>
              <p>New student complaints will appear here.</p>
            </div>
          ) : (
            <div className="cc-complaint-list">
              {complaints.map((complaint) => (
                <div
                  className="cc-complaint-card"
                  key={complaint._id}
                >
                  <div className="cc-complaint-top">
                    <h3>{complaint.title}</h3>

                    <span
                      className={`cc-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status || "Pending"}
                    </span>
                  </div>

                  <p>{complaint.description}</p>

                  <div className="cc-complaint-meta">
                    <span>📂 {complaint.category}</span>
                    <span>
                      🔖 {complaint.trackingId || "Tracking ID"}
                    </span>
                    <span>
                      👤{" "}
                      {complaint.student?.name ||
                        complaint.user?.name ||
                        complaint.studentName ||
                        "Student"}
                    </span>
                  </div>

                  <div className="cc-status-control">
                    <label>Update Status</label>

                    <select
                      value={complaint.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(
                          complaint._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="cc-dashboard-footer">
        © 2026 CampusConnect · Admin Management
      </footer>
    </div>
  );
}

export default AdminDashboard;
