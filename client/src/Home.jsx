
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>CampusConnect</h1>

        <p>
          A smart platform to raise and manage
          campus complaints and suggestions.
        </p>

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
