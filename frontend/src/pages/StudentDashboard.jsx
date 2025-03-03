import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/**
 * Dashboard for student users
 * @component
 * @returns {JSX.Element} The student dashboard view
 */
function StudentDashboard() {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  /**
   * Effect hook to handle user authentication and data loading
   * @function
   * @param {Function} navigate - React Router's navigate function
   * @returns {void}
   */
  useEffect(() => {
    // Get user data from localStorage (set during login)
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'student') {
      navigate('/login')
      return
    }
    setUserData(user)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!userData) return null

  return (
    <div className="dashboard-container">
      <nav className="home-nav">
        <Link to="/" className="logo">LearnLoop</Link>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      <div className="dashboard-header">
        <div>
          <h1>Welcome, {userData.firstName}</h1>
          <p>Student at {userData.institution}</p>
        </div>
      </div>

      {/* Rest of the student dashboard content */}
    </div>
  )
}

export default StudentDashboard 