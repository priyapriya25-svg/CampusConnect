
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">🎓</span>
          CampusConnect
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>

        <Link to="/login" className="login-btn">
          Login →
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">
            ✨ YOUR VOICE MATTERS
          </p>

          <h1>
            Making Campus Life
            <span> Better Together.</span>
          </h1>

          <p className="hero-description">
            A simple platform for students to report campus
            problems, share suggestions and track their
            complaints. Let's make our college a better place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Submit a Complaint →
            </Link>

            <Link to="/login" className="secondary-btn">
              Track Complaint
            </Link>
          </div>

          <div className="hero-trust">
            <span>✓ Easy to use</span>
            <span>✓ Transparent updates</span>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-card">
            <div className="image-icon">🏫</div>

            <h3>Better Campus, Better Experience</h3>

            <p>Your feedback helps us improve.</p>

            <div className="mini-status">
              <span className="status-dot"></span>
              Making campus better, together
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <p className="section-tag">OUR FEATURES</p>

        <h2>How CampusConnect Helps You</h2>

        <p className="section-description">
          Everything you need to make your campus experience better.
        </p>

        <div className="feature-container">

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Submit Complaints</h3>
            <p>
              Report classroom, laboratory and other campus problems.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Track Progress</h3>
            <p>
              Check the status of your submitted complaints.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Share Suggestions</h3>
            <p>
              Share your ideas to improve college facilities.
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-icon">💬</div>

        <h2>Every Voice Makes a Difference</h2>

        <p>
          CampusConnect connects students and college
          administration through a transparent complaint
          and suggestion management system.
        </p>

        <Link to="/register" className="about-btn">
          Join CampusConnect →
        </Link>
      </section>

      {/* Footer */}
      <footer id="contact">
        <h3>🎓 CampusConnect</h3>

        <p>Building a better campus together.</p>

        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <p className="copyright">
          © 2026 CampusConnect. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
