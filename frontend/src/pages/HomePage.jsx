import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/images/learnLoopLogoNoText.svg'

/**
 * Home page component that provides navigation to login and registration
 * @component
 * @returns {JSX.Element} A div containing login and register buttons
 */
function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src={logo} alt="LearnLoop Logo" />
          <Link to="/" className="logo">LearnLoop</Link>
        </div>
        <div className="nav-buttons">
          <button 
            className="nav-button"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
          <button 
            className="nav-button primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <h1>Bridging the Gap Between Teachers and Students</h1>
        <p className="hero-subtitle">
          LearnLoop helps educators create more effective feedback loops, 
          leading to better learning outcomes and student engagement.
        </p>
        <div className="hero-buttons">
          <button 
            className="cta-button"
            onClick={() => navigate('/register')}
          >
            Start Your Journey
          </button>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Real-time Feedback</h3>
            <p>Enable immediate communication between teachers and students</p>
          </div>
          <div className="feature-card">
            <h3>Course Management</h3>
            <p>Organize materials and track progress efficiently</p>
          </div>
          <div className="feature-card">
            <h3>Enhanced Learning</h3>
            <p>Improve understanding through structured feedback loops</p>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="LearnLoop Logo" />
            <span>LearnLoop</span>
          </div>
          <div className="footer-links">
            <Link to="/mission">Our Mission</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage 