
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
  });

  
const loadComplaints = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/complaints/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const complaintList = Array.isArray(data)
        ? data
        : data.complaints || data.data || [];

      setComplaints(complaintList);
    } else {
      setMessage(data.message || "Unable to load complaints.");
    }
  } catch (error) {
    console.log("Load complaints error:", error);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Complaint submitted successfully! 🎉");
        setFormData({
          title: "",
          description: "",
          category: "Other",
        });
        loadComplaints();
      } else {
        setMessage(data.message || "Complaint submission failed.");
      }
    } catch {
      setMessage("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") return "cc-resolved";
    if (status === "In Progress") return "cc-progress";
    return "cc-pending";
  };

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="cc-dashboard">
      <header className="cc-topbar">
        <Link to="/" className="cc-logo">
          🎓 CampusConnect
        </Link>

        <div className="cc-top-actions">
          <span className="cc-user-label">👤 Student</span>
          <button onClick={logout} className="cc-logout">
            Logout ↗
          </button>
        </div>
      </header>

      <main className="cc-main">
        <section className="cc-welcome">
          <div>
            <p className="cc-eyebrow">STUDENT PORTAL</p>
            <h1>Welcome to your Dashboard 👋</h1>
            <p>
              Share your concerns and help make your campus better.
            </p>
          </div>

          <div className="cc-welcome-icon">🏫</div>
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
            <span className="cc-stat-icon">✅</span>
            <div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
            </div>
          </div>
        </section>

        <section className="cc-content-grid">
          <div className="cc-panel">
            <div className="cc-panel-heading">
              <div>
                <h2>📝 Submit a Complaint</h2>
                <p>Tell us what needs to be improved.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="cc-form">
              <label>Complaint Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter complaint title"
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Other</option>
                <option>Classroom</option>
                <option>Laboratory</option>
                <option>Hostel</option>
                <option>Mess</option>
                <option>Campus Facilities</option>
              </select>

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint..."
                rows="5"
                required
              />

              <button
                type="submit"
                className="cc-submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Complaint →"}
              </button>

              {message && (
                <p className="cc-message">{message}</p>
              )}
            </form>
          </div>

          <div className="cc-panel">
            <div className="cc-panel-heading">
              <div>
                <h2>📌 My Complaints</h2>
                <p>Track your submitted complaints.</p>
              </div>
            </div>

            {complaints.length === 0 ? (
              <div className="cc-empty">
                <span>📭</span>
                <h3>No complaints yet</h3>
                <p>Your submitted complaints will appear here.</p>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="cc-dashboard-footer">
        © 2026 CampusConnect · Better campus, together.
      </footer>
    </div>
  );
}

export default Dashboard;

